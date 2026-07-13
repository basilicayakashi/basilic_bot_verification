// master-pet.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AutocompleteInteraction,
  BaseInteraction,
  CacheType,
  Locale,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { firstValueFrom } from 'rxjs';

import {
  RoleType,
  RequestType,
  declareMasterPetRole,
  undeclareMasterPetRole,
  createMasterPetRoleRequest,
  getMasterPetRoleRequest,
  deleteMasterPetRoleRequest,
  createMasterPetRoleLink,
  removeMasterPetRoleLink,
  hasMasterPetRoleLink,
  purgeMasterPetRoleUser,
  listDeclaredMasterPetUsers,
  hasDeclaredMasterPetRole,
  getDeclaredMasterPetRolesForUser,
  getMastersOfUser,
  getPetsOfUser,
  listAllDeclaredMasterPetUsers,
  setMasterPetReferenceMessage,
  getMasterPetReferenceMessage,
  isMasterSymbolTaken,
  getMasterSymbolsForGuild,
  updateMasterSymbol,
} from '../database/sql.js';

import { getMessagesServer } from "../langues/index.js";

// Accepte un emoji unicode simple OU un emoji personnalisé du serveur (<:nom:id> ou <a:nom:id>)
const EMOJI_REGEX = /^(\p{Extended_Pictographic}\uFE0F?|<a?:\w{2,32}:\d{17,20}>)$/u;

// ============================================================
// COMMANDES SLASH
// ============================================================

function isUsedOnAServer(
  interaction: BaseInteraction<CacheType>
): interaction is BaseInteraction<"cached"> & { guild: NonNullable<BaseInteraction<CacheType>["guild"]> } {
  return interaction.inGuild() && interaction.guild != null;
}

async function executeDeclare(interaction: ChatInputCommandInteraction, role: RoleType) {
  const guildId = interaction.guildId!;
  const userId = interaction.user.id;
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const already = await firstValueFrom(hasDeclaredMasterPetRole(guildId, userId, role));
  if (already) {
    return interaction.reply({ content: msgServer.masterPet.alreadyDeclared(role), ephemeral: true });
  }

  await firstValueFrom(declareMasterPetRole(guildId, userId, role));
  return interaction.reply({ content: msgServer.masterPet.declaredSuccess(role), ephemeral: true });
}

async function executeUndeclare(interaction: ChatInputCommandInteraction, role: RoleType) {
  const guildId = interaction.guildId!;
  const userId = interaction.user.id;
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  await firstValueFrom(undeclareMasterPetRole(guildId, userId, role));

  if (role === 'master') {
    await refreshMasterSymbolsMessage(interaction.client, guildId);   // ✅ plus de releaseMasterSymbol, la ligne (et son symbole) est déjà supprimée
  }

  return interaction.reply({ content: msgServer.masterPet.undeclaredSuccess(role), ephemeral: true });
}

async function executeRequest(
  interaction: ChatInputCommandInteraction,
  requesterRole: RoleType,
  requestType: RequestType
) {
  const guildId = interaction.guildId!;
  const requesterId = interaction.user.id;
  const targetId = interaction.options.getString('membre', true);
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const targetMember = await interaction.guild!.members.fetch(targetId).catch(() => null);
  if (!targetMember) {
    return interaction.reply({ content: msgServer.masterPet.memberNotFound, ephemeral: true });
  }

  if (targetId === requesterId) {
    return interaction.reply({ content: msgServer.masterPet.cannotTargetSelf, ephemeral: true });
  }
  if (targetMember.user.bot) {
    return interaction.reply({ content: msgServer.masterPet.cannotTargetBot, ephemeral: true });
  }

  const hasRole = await firstValueFrom(hasDeclaredMasterPetRole(guildId, requesterId, requesterRole));
  if (!hasRole) {
    return interaction.reply({
      content: requesterRole === 'master' ? msgServer.masterPet.mustDeclareMasterFirst : msgServer.masterPet.mustDeclarePetFirst,
      ephemeral: true,
    });
  }

  const alreadyLinked = await firstValueFrom(hasMasterPetRoleLink(guildId, requesterId, targetId));
  if (alreadyLinked) {
    return interaction.reply({ content: msgServer.masterPet.alreadyLinked, ephemeral: true });
  }

  const req = await firstValueFrom(createMasterPetRoleRequest(guildId, requesterId, targetId, requestType));
  if (!req) {
    return interaction.reply({ content: msgServer.masterPet.requestExpired, ephemeral: true });
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`mp_accept_${req.id}`).setLabel(msgServer.masterPet.accept).setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`mp_decline_${req.id}`).setLabel(msgServer.masterPet.decline).setStyle(ButtonStyle.Danger)
  );

  const dmContent = requestType === 'master_to_pet'
    ? msgServer.masterPet.requestPetSent(requesterId, targetId)
    : msgServer.masterPet.requestMasterSent(requesterId, targetId);

  const dmSent = await targetMember.send({ content: dmContent, components: [row] }).catch(() => null);

  if (!dmSent) {
    // ✅ le membre visé a ses DMs fermés → on annule la demande créée en base
    await firstValueFrom(deleteMasterPetRoleRequest(req.id));
    return interaction.reply({ content: msgServer.masterPet.targetDmClosed, ephemeral: true });
  }

  return interaction.reply({ content: msgServer.masterPet.requestSentConfirmation, ephemeral: true });
}

async function executeUnlink(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const userId = interaction.user.id;
  const target = interaction.options.getUser('membre', true);
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const linked = await firstValueFrom(hasMasterPetRoleLink(guildId, userId, target.id));
  if (!linked) {
    return interaction.reply({ content: msgServer.masterPet.noLinkFound, ephemeral: true });
  }

  await firstValueFrom(removeMasterPetRoleLink(guildId, userId, target.id));
  return interaction.reply({ content: msgServer.masterPet.unlinkSuccess(target.id), ephemeral: true });
}

async function executeProfile(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const targetId = interaction.options.getString('membre', true);
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const targetMember = await interaction.guild!.members.fetch(targetId).catch(() => null);
  if (!targetMember) {
    return interaction.reply({ content: msgServer.masterPet.memberNotFound, ephemeral: true });
  }

  const [roles, masterIds, petIds] = await Promise.all([
    firstValueFrom(getDeclaredMasterPetRolesForUser(guildId, targetId)),
    firstValueFrom(getMastersOfUser(guildId, targetId)),
    firstValueFrom(getPetsOfUser(guildId, targetId)),
  ]);

  const rolesText = roles.length > 0
    ? roles.map(r => r === 'master' ? msgServer.masterPet.roleMaster : msgServer.masterPet.rolePet).join(', ')
    : msgServer.masterPet.noRoleDeclared;

  const mastersText = masterIds.length > 0
    ? masterIds.map(id => `<@${id}>`).join(', ')
    : msgServer.masterPet.noneLabel;

  const petsText = petIds.length > 0
    ? petIds.map(id => `<@${id}>`).join(', ')
    : msgServer.masterPet.noneLabel;

  return interaction.reply({
    content: msgServer.masterPet.profileSummary(targetId, rolesText, mastersText, petsText),
    ephemeral: true,
  });
}

const masterPetProfile = {
  data: new SlashCommandBuilder()
    .setName('master-pet-profile')
    .setDescription("Display the master/pet profile of a member")
    .setDescriptionLocalizations({
      [Locale.French]: "Affiche la fiche master/pet d'un membre",
      [Locale.German]: "Zeige das Master-/Pet-Profil eines Mitglieds",
      [Locale.SpanishES]: "Muestra el perfil master/mascota de un miembro",
      [Locale.Polish]: "Wyświetl profil master/pet członka",
    })
    .addStringOption(opt =>
      opt.setName('membre')
        .setDescription("The member to view (must have declared a master/pet role)")
        .setDescriptionLocalizations({
          [Locale.French]: "Le membre à consulter (doit avoir déclaré un rôle master/pet)",
          [Locale.SpanishES]: "El miembro a consultar (debe haber declarado un rol master/mascota)",
          [Locale.German]: "Das zu konsultierende Mitglied (muss eine Master-/Pet-Rolle deklariert haben)",
          [Locale.Polish]: "Członek do sprawdzenia (musi mieć zadeklarowaną rolę master/pet)",
        })
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: executeProfile,
};

export async function refreshMasterSymbolsMessage(client: Client, guildId: string) {
  const settings = await firstValueFrom(getMasterPetReferenceMessage(guildId));
  if (!settings) return;

  const symbols = await firstValueFrom(getMasterSymbolsForGuild(guildId));

  const channel = await client.channels.fetch(settings.referenceChannelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const message = await channel.messages.fetch(settings.referenceMessageId).catch(() => null);
  if (!message) return;

  const guild = await client.guilds.fetch(guildId).catch(() => null);
  const msgServer = getMessagesServer(guild?.preferredLocale ?? "en");

  const embed = new EmbedBuilder()
    .setTitle(msgServer.masterPet.masterSymbolsTableTitle)
    .setColor(0xFFCC00);

  if (symbols.length === 0) {
    embed.setDescription(msgServer.masterPet.noSymbolsClaimed);
  } else {
    embed.addFields(
      {
        name: msgServer.masterPet.symbolColumnHeader,
        value: symbols.map(s => s.symbol).join('\n'),
        inline: true,
      },
      {
        name: msgServer.masterPet.masterColumnHeader,
        value: symbols.map(s => `<@${s.userId}>`).join('\n'),
        inline: true,
      }
    );
  }

  await message.edit({ content: null, embeds: [embed] }).catch(() => null);
}

async function executeSetReferenceMessage(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {   // ✅ ajout de isDMBased()
    return interaction.reply({ content: msgServer.masterPet.invalidChannel, ephemeral: true });
  }

  const placeholderMessage = await channel.send({ content: msgServer.masterPet.noSymbolsClaimed });

  await firstValueFrom(setMasterPetReferenceMessage(guildId, channel.id, placeholderMessage.id));
  await refreshMasterSymbolsMessage(interaction.client, guildId);

  return interaction.reply({ content: msgServer.masterPet.referenceMessageSet, ephemeral: true });
}

const masterPetSetReference = {
  data: new SlashCommandBuilder()
    .setName('master-pet-set-reference')
    .setDescription("Update the message with the masters list and their symbols")
    .setDescriptionLocalizations({
      [Locale.French]: "Définit le message à tenir à jour avec la liste des masters et leurs symboles",
      [Locale.SpanishES]: "Actualiza el mensaje con la lista de maestros y sus símbolos",
      [Locale.German]: "Aktualisiere die Nachricht mit der Liste der Master und ihren Symbolen",
      [Locale.Polish]: "Aktualizuj wiadomość listą masterów i ich symbolami",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: executeSetReferenceMessage,
};

// ============================================================
// DÉFINITIONS DES COMMANDES (data + execute)
// ============================================================

const declareMaster = {
  data: new SlashCommandBuilder()
    .setName("declare-master")
    .setDescription("Declare yourself as a master on this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Se déclarer comme master sur ce serveur",
      [Locale.SpanishES]: "Declararte como maestro en este servidor",
      [Locale.German]: "Melde dich auf diesem Server als Master an",
      [Locale.Polish]: "Zgłoś się jako master na tym serwerze",
    })
    .addStringOption(opt =>
      opt.setName('symbole')
        .setDescription("A Unicode emoji or a server emoji")
        .setDescriptionLocalizations({
          [Locale.French]: "Un emoji unicode ou un emoji du serveur",
          [Locale.SpanishES]: "Un emoji Unicode o un emoji del servidor",
          [Locale.German]: "Ein Unicode-Emoji oder ein Server-Emoji",
          [Locale.Polish]: "Emoji Unicode albo emoji z serwera",
        })
        .setRequired(true)
    ),
  execute: executeDeclareMaster,
};

const declarePet = {
  data: new SlashCommandBuilder()
    .setName('declare-pet')
    .setDescription("Declare yourself as a pet on this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Se déclarer comme pet sur ce serveur",
      [Locale.SpanishES]: "Declararte como mascota en este servidor",
      [Locale.German]: "Melde dich auf diesem Server als Pet an",
      [Locale.Polish]: "Zgłoś się jako pet na tym serwerze",
    }),
  execute: (i: ChatInputCommandInteraction) => executeDeclare(i, 'pet'),
};

const undeclareMaster = {
  data: new SlashCommandBuilder()
    .setName('undeclare-master')
    .setDescription("Remove your master declaration on this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprimer votre déclaration de master sur ce serveur",
      [Locale.SpanishES]: "Eliminar tu declaración de maestro en este servidor",
      [Locale.German]: "Entferne deine Master-Anmeldung auf diesem Server",
      [Locale.Polish]: "Usuń swoją deklarację jako master na tym serwerze",
    }),
  execute: (i: ChatInputCommandInteraction) => executeUndeclare(i, 'master'),
};

const undeclarePet = {
  data: new SlashCommandBuilder()
    .setName('undeclare-pet')
    .setDescription("Remove your pet declaration on this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprimer votre déclaration de pet sur ce serveur",
      [Locale.SpanishES]: "Eliminar tu declaración de mascota en este servidor",
      [Locale.German]: "Entferne deine Pet-Anmeldung auf diesem Server",
      [Locale.Polish]: "Usuń swoją deklarację jako pet na tym serwerze",
    }),
  execute: (i: ChatInputCommandInteraction) => executeUndeclare(i, 'pet'),
};

const requestPet = {
  data: new SlashCommandBuilder()
    .setName('request-pet')
    .setDescription("Propose a member to become your pet")
    .setDescriptionLocalizations({
      [Locale.French]: "Proposer à un membre de devenir votre pet",
      [Locale.SpanishES]: "Proponer a un miembro que se convierta en tu mascota",
      [Locale.German]: "Vorschlagen, dass ein Mitglied zu deinem Pet wird",
      [Locale.Polish]: "Zaproponuj członkowi, że zostanie twoim psem",
    })
    .addStringOption(opt =>
      opt.setName('membre')
        .setDescription('The member targeted (must be in the server)')
        .setDescriptionLocalizations({
          [Locale.French]: "Le membre ciblé (doit être sur le serveur)",
          [Locale.SpanishES]: "El miembro objetivo (debe estar en el servidor)",
          [Locale.German]: "Der Zielmitglied (muss auf dem Server sein)",
          [Locale.Polish]: "Celowy członek (musi być na serwerze)",
        })
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: (i: ChatInputCommandInteraction) => executeRequest(i, 'master', 'master_to_pet'),
};

/*
const requestMaster = {
  data: new SlashCommandBuilder()
    .setName('request-master')
    .setDescription("Propose a member to become your master")
    .setDescriptionLocalizations({
      [Locale.French]: "Proposer à un membre de devenir votre master",
      [Locale.SpanishES]: "Proponer a un miembro que se convierta en tu maestro",
      [Locale.German]: "Vorschlagen, dass ein Mitglied zu deinem Master wird",
      [Locale.Polish]: "Zaproponuj członkowi, że zostanie twoim mistrzem",
    })
    .addStringOption(opt =>
      opt.setName('membre')
        .setDescription("The member targeted (must be in the server)")
        .setDescriptionLocalizations({
          [Locale.French]: "Le membre ciblé (doit être sur le serveur)",
          [Locale.SpanishES]: "El miembro objetivo (debe estar en el servidor)",
          [Locale.German]: "Der Zielmitglied (muss auf dem Server sein)",
          [Locale.Polish]: "Celowy członek (musi być na serwerze)",
        })
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: (i: ChatInputCommandInteraction) => executeRequest(i, 'pet', 'pet_to_master'),
};
*/

const unlink = {
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription("Remove your master/pet link with a member")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprime votre lien master/pet avec un membre",
      [Locale.SpanishES]: "Elimina tu enlace master/pet con un miembro",
      [Locale.German]: "Entfernt deinen Master/Pet-Link mit einem Mitglied",
      [Locale.Polish]: "Usuwa twój link mistrz/pies z członkiem",
    })
    .addUserOption(opt => opt
      .setName('membre')
      .setDescription('The member targeted')
      .setDescriptionLocalizations({
        [Locale.French]: "Le membre ciblé",
        [Locale.SpanishES]: "El miembro objetivo",
        [Locale.German]: "Das Zielmitglied",
        [Locale.Polish]: "Celowy członek",
      })
      .setRequired(true)),
  execute: executeUnlink,
};

const masterSymbolChange = {
  data: new SlashCommandBuilder()
    .setName("master-symbol-change")
    .setDescription('Change votre symbole actuel pour un nouveau (doit rester unique sur ce serveur)')
    .addStringOption(opt =>
      opt.setName('symbole')
        .setDescription('Le nouveau symbole (emoji unicode ou emoji du serveur)')
        .setRequired(true)
    ),
  execute: executeChangeSymbol,
};

export const masterPetCommands = [
  declareMaster,
  declarePet,
  undeclareMaster,
  undeclarePet,
  requestPet,
  //requestMaster,
  unlink,
  masterPetProfile,
  masterPetSetReference,
  //masterSymbolSet,
  //masterSymbolRemove,
  masterSymbolChange,
];

// ============================================================
// BOUTONS (accept/decline)
// ============================================================

export function isMasterPetButton(customId: string): boolean {
  return customId.startsWith('mp_');
}

export async function handleMasterPetButton(interaction: ButtonInteraction) {
  const [, action, idStr] = interaction.customId.split('_');
  const req = await firstValueFrom(getMasterPetRoleRequest(Number(idStr)));
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  if (!req) {
    return interaction.reply({ content: msgServer.masterPet.requestExpired, ephemeral: true });
  }
  if (req.targetId !== interaction.user.id) {
    return interaction.reply({ content: msgServer.masterPet.notYourRequest, ephemeral: true });
  }

  if (action === 'accept') {
    const [masterId, petId] = req.requestType === 'master_to_pet'
      ? [req.requesterId, req.targetId]
      : [req.targetId, req.requesterId];
    await firstValueFrom(createMasterPetRoleLink(req.guildId, masterId, petId));
  }

  await firstValueFrom(deleteMasterPetRoleRequest(req.id));

  await interaction.update({
    content: action === 'accept'
      ? msgServer.masterPet.requestAccepted(req.requesterId, req.targetId)
      : msgServer.masterPet.requestDeclined(req.requesterId, req.targetId),
    components: [],
  });
}

export async function handleMasterPetAutocomplete(interaction: AutocompleteInteraction) {
  const guildId = interaction.guildId!;
  const focused = interaction.options.getFocused().toLowerCase();
  const commandName = interaction.commandName;

  let userIds: string[];

  if (commandName === 'master-pet-profile') {
    // profil : n'importe quel membre ayant déclaré master OU pet
    userIds = await firstValueFrom(listAllDeclaredMasterPetUsers(guildId));
  } else {
    // request-pet / request-master : filtre par rôle cible attendu
    const roleToList: RoleType = commandName === 'request-pet' ? 'pet' : 'master';
    userIds = await firstValueFrom(listDeclaredMasterPetUsers(guildId, roleToList));
  }

  const guild = interaction.guild!;
  const choices: { name: string; value: string }[] = [];

  for (const userId of userIds) {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) continue;
    if (!member.displayName.toLowerCase().includes(focused)) continue;
    choices.push({ name: member.displayName, value: userId });
  }

  await interaction.respond(choices.slice(0, 25));
}

async function executeDeclareMaster(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const userId = interaction.user.id;
  const symbol = interaction.options.getString('symbole', true).trim();
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const already = await firstValueFrom(hasDeclaredMasterPetRole(guildId, userId, 'master'));
  if (already) {
    return interaction.reply({ content: msgServer.masterPet.alreadyDeclared('master'), ephemeral: true });
  }

  if (!EMOJI_REGEX.test(symbol)) {
    return interaction.reply({ content: msgServer.masterPet.invalidSymbol, ephemeral: true });
  }

  const taken = await firstValueFrom(isMasterSymbolTaken(guildId, symbol, userId));
  if (taken) {
    return interaction.reply({ content: msgServer.masterPet.symbolAlreadyTaken, ephemeral: true });
  }

  await firstValueFrom(declareMasterPetRole(guildId, userId, 'master', symbol));   // ✅ une seule écriture
  await refreshMasterSymbolsMessage(interaction.client, guildId);

  return interaction.reply({ content: msgServer.masterPet.masterDeclaredWithSymbol(symbol), ephemeral: true });
}

async function executeChangeSymbol(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const userId = interaction.user.id;
  const newSymbol = interaction.options.getString('symbole', true).trim();
  const msgServer = isUsedOnAServer(interaction)
    ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
    : getMessagesServer("en");

  const isMaster = await firstValueFrom(hasDeclaredMasterPetRole(guildId, userId, 'master'));
  if (!isMaster) {
    return interaction.reply({ content: msgServer.masterPet.mustDeclareMasterFirst, ephemeral: true });
  }

  if (!EMOJI_REGEX.test(newSymbol)) {
    return interaction.reply({ content: msgServer.masterPet.invalidSymbol, ephemeral: true });
  }

  const taken = await firstValueFrom(isMasterSymbolTaken(guildId, newSymbol, userId));
  if (taken) {
    return interaction.reply({ content: msgServer.masterPet.symbolAlreadyTaken, ephemeral: true });
  }

  await firstValueFrom(updateMasterSymbol(guildId, userId, newSymbol));   // ✅ au lieu de claimMasterSymbol
  await refreshMasterSymbolsMessage(interaction.client, guildId);

  return interaction.reply({ content: msgServer.masterPet.symbolChanged(newSymbol), ephemeral: true });
}