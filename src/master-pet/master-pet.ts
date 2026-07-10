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
} from '../database/sql.js';

import { getMessagesServer } from "../langues/index.js";


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

  const content = requestType === 'master_to_pet'
    ? msgServer.masterPet.requestPetSent(requesterId, targetId)
    : msgServer.masterPet.requestMasterSent(requesterId, targetId);

  return interaction.reply({ content, components: [row] });
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

// ============================================================
// DÉFINITIONS DES COMMANDES (data + execute)
// ============================================================

const declareMaster = {
  data: new SlashCommandBuilder()
    .setName('declare-master')
    .setDescription('Se déclarer comme master sur ce serveur'),
  execute: (i: ChatInputCommandInteraction) => executeDeclare(i, 'master'),
};

const declarePet = {
  data: new SlashCommandBuilder()
    .setName('declare-pet')
    .setDescription('Se déclarer comme pet sur ce serveur'),
  execute: (i: ChatInputCommandInteraction) => executeDeclare(i, 'pet'),
};

const undeclareMaster = {
  data: new SlashCommandBuilder()
    .setName('undeclare-master')
    .setDescription('Ne plus être déclaré comme master'),
  execute: (i: ChatInputCommandInteraction) => executeUndeclare(i, 'master'),
};

const undeclarePet = {
  data: new SlashCommandBuilder()
    .setName('undeclare-pet')
    .setDescription('Ne plus être déclaré comme pet'),
  execute: (i: ChatInputCommandInteraction) => executeUndeclare(i, 'pet'),
};

const requestPet = {
  data: new SlashCommandBuilder()
    .setName('request-pet')
    .setDescription('Propose à un membre de devenir votre pet')
    .addStringOption(opt =>
      opt.setName('membre')
        .setDescription('Le membre visé (doit être dans le serveur)')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: (i: ChatInputCommandInteraction) => executeRequest(i, 'master', 'master_to_pet'),
};

const requestMaster = {
  data: new SlashCommandBuilder()
    .setName('request-master')
    .setDescription('Propose à un membre de devenir votre master')
    .addStringOption(opt =>
      opt.setName('membre')
        .setDescription('Le membre visé (doit être dans le serveur)')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: (i: ChatInputCommandInteraction) => executeRequest(i, 'pet', 'pet_to_master'),
};

const unlink = {
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Supprime votre lien master/pet avec un membre')
    .addUserOption(opt => opt.setName('membre').setDescription('Le membre visé').setRequired(true)),
  execute: executeUnlink,
};

export const masterPetCommands = [
  declareMaster,
  declarePet,
  undeclareMaster,
  undeclarePet,
  requestPet,
  requestMaster,
  unlink,
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

  // Pour request-pet, on liste les non-pets potentiels ; pour request-master, les masters existants.
  // Ici, exemple pour proposer les membres déjà déclarés dans le rôle "cible" attendu.
  const roleToList: RoleType = commandName === 'request-pet' ? 'pet' : 'master';

  const userIds = await firstValueFrom(listDeclaredMasterPetUsers(guildId, roleToList));

  const guild = interaction.guild!;
  const choices: { name: string; value: string }[] = [];

  for (const userId of userIds) {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) continue;
    if (!member.displayName.toLowerCase().includes(focused)) continue;
    choices.push({ name: member.displayName, value: userId });
  }

  await interaction.respond(choices.slice(0, 25)); // Discord limite à 25 résultats
}