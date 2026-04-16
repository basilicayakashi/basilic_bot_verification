import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder,
  TextChannel,
  MessageFlags,
  BaseInteraction,
  CacheType,
  Locale
} from "discord.js";

import { SpamAlertService } from "./moderation/spam-alert.js";

import {
  getVerifiedUserStmt,
  insertVerifiedUserStmt,
  insertSetupPermissionStmt,
  getSetupPermissionStmt,
  getAuthorizedGuildIdsStmt,
  getSetupPermissionByGuildStmt,
  getBlacklistedUserStmt,
  getBlacklistedUsersEverywhereStmt,
  insertBlacklistedUserStmt,
  deleteBlacklistedUserStmt,
  upsertGuildVerificationSettingsStmt,
  deleteGuildVerificationQuestionsStmt,
  insertGuildVerificationQuestionStmt,
  getGuildVerificationSettingsStmt,
  getGuildVerificationQuestionsStmt,
  getGuildVerificationQuestionByIndexStmt,
  updateGuildVerificationQuestionStmt,
  deleteGuildVerificationQuestionByIdStmt,
  reorderGuildVerificationQuestionsStmt,
  getGuildSpamSettingsStmt,
  upsertGuildSpamSettingsStmt,
  insertPendingVerificationSubmissionStmt,
  deletePendingVerificationSubmissionStmt,
  getExpiredPendingVerificationSubmissionsStmt,
  getGuildWelcomeMessageStmt,
  upsertGuildWelcomeMessageStmt,
  deleteGuildWelcomeMessageStmt,
} from "./database/sql.js";

import type {
  VerifiedUserRow,
  SetupVerificationPermissionRow,
  BlacklistedUserRow,
  AuthorizedGuildRow,
  GuildVerificationQuestionRow,
  GuildVerificationSettingsRow,
  GuildSpamSettingsRow,
  GuildWelcomeMessageRow,
} from "./database/sql.js";

import { handleVerificationButtons, handleVerificationModals} from "./moderation/verification-flow.js";

//les messages envoyés à la personne qui fait appel au bot
import { getMessagesUser, getMessagesOut, getMessagesServer, getMessagesInternal} from "./langues/index.js";

import dotenv from "dotenv";

dotenv.config();

// =========================
// CONFIG
// =========================
const TOKEN = process.env.DISCORD_TOKEN!;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const isProduction = process.env.BOT_EN_PRODUCTION === "1";

// =========================
// CLIENT
// =========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.GuildMember],
});

const spamAlertService = new SpamAlertService({
  getGuildSpamSettings: (guildId: string) =>
    getGuildSpamSettingsStmt.get(guildId) as GuildSpamSettingsRow | undefined,
});

// =========================
// COMMANDES SLASH
// =========================
const cmd_en = getMessagesUser({ locale: "en" });
const cmd_fr = getMessagesUser({ locale: "fr" });
const cmd_es = getMessagesUser({ locale: "es" });
const cmd_de = getMessagesUser({ locale: "de" });
const cmd_pl = getMessagesUser({ locale: "pl" });

const commands = [
  new SlashCommandBuilder()
    .setName("setup-verification")
    .setDescription(cmd_en.setupVerificationDescription)
    .setDescriptionLocalizations({
      [Locale.French]: cmd_fr.setupVerificationDescription,
      [Locale.SpanishES]: cmd_es.setupVerificationDescription,
      [Locale.German]: cmd_de.setupVerificationDescription,
      [Locale.Polish]: cmd_pl.setupVerificationDescription,
    })
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName("verified_role")
        .setDescription(cmd_en.verifiedRoleIdDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.verifiedRoleIdDescription,
		  [Locale.SpanishES]: cmd_es.verifiedRoleIdDescription,
		  [Locale.German]: cmd_de.verifiedRoleIdDescription,
		  [Locale.Polish]: cmd_pl.verifiedRoleIdDescription,
		})
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("staff_category_id")
        .setDescription(cmd_en.staffCategoryIdDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.staffCategoryIdDescription,
		  [Locale.SpanishES]: cmd_es.staffCategoryIdDescription,
		  [Locale.German]: cmd_de.staffCategoryIdDescription,
		  [Locale.Polish]: cmd_pl.staffCategoryIdDescription,
		})
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("staff_role")
        .setDescription(cmd_en.staffRoleIdDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.staffRoleIdDescription,
		  [Locale.SpanishES]: cmd_es.staffRoleIdDescription,
		  [Locale.German]: cmd_de.staffRoleIdDescription,
		  [Locale.Polish]: cmd_pl.staffRoleIdDescription,
		})
        .setRequired(true)
    )
    .addIntegerOption((option) =>
    option
      .setName("verification_timeout_hours")
      .setDescription(cmd_en.DelaiDescriptionCommande)
      .setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.DelaiDescriptionCommande,
		  [Locale.SpanishES]: cmd_es.DelaiDescriptionCommande,
		  [Locale.German]: cmd_de.DelaiDescriptionCommande,
		  [Locale.Polish]: cmd_pl.DelaiDescriptionCommande,
		})
      .setRequired(false)
      .setMinValue(0)
  ),

  new SlashCommandBuilder()
    .setName("check-member")
    .setDescription(cmd_en.checkVerifiedDescription)
	.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.checkVerifiedDescription,
		  [Locale.SpanishES]: cmd_es.checkVerifiedDescription,
		  [Locale.German]: cmd_de.checkVerifiedDescription,
		  [Locale.Polish]: cmd_pl.checkVerifiedDescription,
		})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription(cmd_en.userIdLookupDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.userIdLookupDescription,
		  [Locale.SpanishES]: cmd_es.userIdLookupDescription,
		  [Locale.German]: cmd_de.userIdLookupDescription,
		  [Locale.Polish]: cmd_pl.userIdLookupDescription,
		})
        .setRequired(true)
    ),

  new SlashCommandBuilder()
  .setName("blacklist-member")
  .setDescription(cmd_en.blacklistMemberDescription)
  .setDescriptionLocalizations({
    [Locale.French]: cmd_fr.blacklistMemberDescription,
    [Locale.SpanishES]: cmd_es.blacklistMemberDescription,
    [Locale.German]: cmd_de.blacklistMemberDescription,
    [Locale.Polish]: cmd_pl.blacklistMemberDescription,
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("user_id")
      .setDescription(cmd_en.userIdLookupDescription)
      .setDescriptionLocalizations({
        [Locale.French]: cmd_fr.userIdLookupDescription,
        [Locale.SpanishES]: cmd_es.userIdLookupDescription,
        [Locale.German]: cmd_de.userIdLookupDescription,
        [Locale.Polish]: cmd_pl.userIdLookupDescription,
      })
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription(cmd_en.blacklistReasonDescription)
      .setDescriptionLocalizations({
        [Locale.French]: cmd_fr.blacklistReasonDescription,
        [Locale.SpanishES]: cmd_es.blacklistReasonDescription,
        [Locale.German]: cmd_de.blacklistReasonDescription,
        [Locale.Polish]: cmd_pl.blacklistReasonDescription,
      })
      .setRequired(false)
  ),

  new SlashCommandBuilder()
    .setName("allow-setup-verification")
    .setDescription(cmd_en.allowSetupVerificationDescription)
    .setDescriptionLocalizations({
        [Locale.French]: cmd_fr.allowSetupVerificationDescription,
        [Locale.SpanishES]: cmd_es.allowSetupVerificationDescription,
        [Locale.German]: cmd_de.allowSetupVerificationDescription,
        [Locale.Polish]: cmd_pl.allowSetupVerificationDescription,
      })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("guild_id")
        .setDescription(cmd_en.guildIdDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.guildIdDescription,
		  [Locale.SpanishES]: cmd_es.guildIdDescription,
		  [Locale.German]: cmd_de.guildIdDescription,
		  [Locale.Polish]: cmd_pl.guildIdDescription,
		})
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("add-verification-question")
    .setDescription(cmd_en.addVerificationQuestionDescription)
	.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.addVerificationQuestionDescription,
		  [Locale.SpanishES]: cmd_es.addVerificationQuestionDescription,
		  [Locale.German]: cmd_de.addVerificationQuestionDescription,
		  [Locale.Polish]: cmd_pl.addVerificationQuestionDescription,
		})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("label")
        .setDescription(cmd_en.questionLabelDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.questionLabelDescription,
		  [Locale.SpanishES]: cmd_es.questionLabelDescription,
		  [Locale.German]: cmd_de.questionLabelDescription,
		  [Locale.Polish]: cmd_pl.questionLabelDescription,
		})
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(cmd_en.questionTypeDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.questionTypeDescription,
		  [Locale.SpanishES]: cmd_es.questionTypeDescription,
		  [Locale.German]: cmd_de.questionTypeDescription,
		  [Locale.Polish]: cmd_pl.questionTypeDescription,
		})
        .setRequired(true)
		.addChoices(
		  {
			name: cmd_en.choiceShortText,
			value: "text_short",
			name_localizations: {
			  [Locale.French]: cmd_fr.choiceShortText,
			  [Locale.SpanishES]: cmd_es.choiceShortText,
			  [Locale.German]: cmd_de.choiceShortText,
			  [Locale.Polish]: cmd_pl.choiceShortText,
			},
		  },
		  {
			name: cmd_en.choiceParagraph,
			value: "text_paragraph",
			name_localizations: {
			  [Locale.French]: cmd_fr.choiceParagraph,
			  [Locale.SpanishES]: cmd_es.choiceParagraph,
			  [Locale.German]: cmd_de.choiceParagraph,
			  [Locale.Polish]: cmd_pl.choiceParagraph,
			},
		  },
		  {
			name: cmd_en.choiceImageUpload,
			value: "file_image",
			name_localizations: {
			  [Locale.French]: cmd_fr.choiceImageUpload,
			  [Locale.SpanishES]: cmd_es.choiceImageUpload,
			  [Locale.German]: cmd_de.choiceImageUpload,
			  [Locale.Polish]: cmd_pl.choiceImageUpload,
			},
		  }
		)
    )
    .addBooleanOption((option) =>
      option
        .setName("required")
        .setDescription(cmd_en.questionRequiredDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.questionRequiredDescription,
		  [Locale.SpanishES]: cmd_es.questionRequiredDescription,
		  [Locale.German]: cmd_de.questionRequiredDescription,
		  [Locale.Polish]: cmd_pl.questionRequiredDescription,
		})
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("list-verification-questions")
    .setDescription(cmd_en.listVerificationQuestionsDescription)
	.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.listVerificationQuestionsDescription,
		  [Locale.SpanishES]: cmd_es.listVerificationQuestionsDescription,
		  [Locale.German]: cmd_de.listVerificationQuestionsDescription,
		  [Locale.Polish]: cmd_pl.listVerificationQuestionsDescription,
		})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("edit-verification-question")
    .setDescription(cmd_en.editVerificationQuestionDescription)
	.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.editVerificationQuestionDescription,
		  [Locale.SpanishES]: cmd_es.editVerificationQuestionDescription,
		  [Locale.German]: cmd_de.editVerificationQuestionDescription,
		  [Locale.Polish]: cmd_pl.editVerificationQuestionDescription,
		})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription(cmd_en.questionIndexDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.questionIndexDescription,
		  [Locale.SpanishES]: cmd_es.questionIndexDescription,
		  [Locale.German]: cmd_de.questionIndexDescription,
		  [Locale.Polish]: cmd_pl.questionIndexDescription,
		})
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption((option) =>
      option
        .setName("label")
        .setDescription(cmd_en.newQuestionLabelDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.newQuestionLabelDescription,
		  [Locale.SpanishES]: cmd_es.newQuestionLabelDescription,
		  [Locale.German]: cmd_de.newQuestionLabelDescription,
		  [Locale.Polish]: cmd_pl.newQuestionLabelDescription,
		})
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(cmd_en.newQuestionTypeDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.newQuestionTypeDescription,
		  [Locale.SpanishES]: cmd_es.newQuestionTypeDescription,
		  [Locale.German]: cmd_de.newQuestionTypeDescription,
		  [Locale.Polish]: cmd_pl.newQuestionTypeDescription,
		})
    .setRequired(false)
		.addChoices(
          {
          name: cmd_en.choiceShortText,
          value: "text_short",
          name_localizations: {
            [Locale.French]: cmd_fr.choiceShortText,
            [Locale.SpanishES]: cmd_es.choiceShortText,
            [Locale.German]: cmd_de.choiceShortText,
            [Locale.Polish]: cmd_pl.choiceShortText,
          },
          },
          {
          name: cmd_en.choiceParagraph,
          value: "text_paragraph",
          name_localizations: {
            [Locale.French]: cmd_fr.choiceParagraph,
            [Locale.SpanishES]: cmd_es.choiceParagraph,
            [Locale.German]: cmd_de.choiceParagraph,
            [Locale.Polish]: cmd_pl.choiceParagraph,
          },
          },
          {
          name: cmd_en.choiceImageUpload,
          value: "file_image",
          name_localizations: {
            [Locale.French]: cmd_fr.choiceImageUpload,
            [Locale.SpanishES]: cmd_es.choiceImageUpload,
            [Locale.German]: cmd_de.choiceImageUpload,
            [Locale.Polish]: cmd_pl.choiceImageUpload,
          },
          }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("required")
        .setDescription(cmd_en.newQuestionRequiredDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.newQuestionRequiredDescription,
		  [Locale.SpanishES]: cmd_es.newQuestionRequiredDescription,
		  [Locale.German]: cmd_de.newQuestionRequiredDescription,
		  [Locale.Polish]: cmd_pl.newQuestionRequiredDescription,
		})
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("delete-verification-question")
    .setDescription(cmd_en.deleteVerificationQuestionDescription)
	.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.deleteVerificationQuestionDescription,
		  [Locale.SpanishES]: cmd_es.deleteVerificationQuestionDescription,
		  [Locale.German]: cmd_de.deleteVerificationQuestionDescription,
		  [Locale.Polish]: cmd_pl.deleteVerificationQuestionDescription,
		})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription(cmd_en.questionIndexDescription)
		.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.questionIndexDescription,
		  [Locale.SpanishES]: cmd_es.questionIndexDescription,
		  [Locale.German]: cmd_de.questionIndexDescription,
		  [Locale.Polish]: cmd_pl.questionIndexDescription,
		})
        .setRequired(true)
        .setMinValue(1)
    ),
	
  new SlashCommandBuilder()
    .setName("bot-help")
    .setDescription(cmd_en.botHelpDescription)
	.setDescriptionLocalizations({
		  [Locale.French]: cmd_fr.botHelpDescription,
		  [Locale.SpanishES]: cmd_es.botHelpDescription,
		  [Locale.German]: cmd_de.botHelpDescription,
		  [Locale.Polish]: cmd_pl.botHelpDescription,
		})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
	new SlashCommandBuilder()
	  .setName("unblacklist-member")
	  .setDescription(cmd_en.unblacklistMemberDescription)
	  .setDescriptionLocalizations({
		[Locale.French]: cmd_fr.unblacklistMemberDescription,
		[Locale.SpanishES]: cmd_es.unblacklistMemberDescription,
		[Locale.German]: cmd_de.unblacklistMemberDescription,
		[Locale.Polish]: cmd_pl.unblacklistMemberDescription,
	  })
	  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	  .addStringOption((option) =>
		option
		  .setName("user_id")
		  .setDescription(cmd_en.userIdLookupDescription)
		  .setDescriptionLocalizations({
			[Locale.French]: cmd_fr.userIdLookupDescription,
			[Locale.SpanishES]: cmd_es.userIdLookupDescription,
			[Locale.German]: cmd_de.userIdLookupDescription,
			[Locale.Polish]: cmd_pl.userIdLookupDescription,
		  })
		  .setRequired(true)
	  ),
	  
	  new SlashCommandBuilder()
	  .setName("setup-spam-detection")
	  .setDescription(cmd_en.setupSpamDetectionDescription)
	  .setDescriptionLocalizations({
			[Locale.French]: cmd_fr.setupSpamDetectionDescription,
			[Locale.SpanishES]: cmd_es.setupSpamDetectionDescription,
			[Locale.German]: cmd_de.setupSpamDetectionDescription,
			[Locale.Polish]: cmd_pl.setupSpamDetectionDescription,
		  })
	  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	  .addBooleanOption((option) =>
		option
		  .setName("enabled")
		  .setDescription(cmd_en.spamDetectionEnabledOptionDescription)
		  .setDescriptionLocalizations({
				[Locale.French]: cmd_fr.spamDetectionEnabledOptionDescription,
				[Locale.SpanishES]: cmd_es.spamDetectionEnabledOptionDescription,
				[Locale.German]: cmd_de.spamDetectionEnabledOptionDescription,
				[Locale.Polish]: cmd_pl.spamDetectionEnabledOptionDescription,
			  })
		  .setRequired(true)
	  )
	  .addChannelOption((option) =>
		option
		  .setName("alert_channel")
		  .setDescription(cmd_en.spamAlertChannelDescription)
		  .setDescriptionLocalizations({
				[Locale.French]: cmd_fr.spamAlertChannelDescription,
				[Locale.SpanishES]: cmd_es.spamAlertChannelDescription,
				[Locale.German]: cmd_de.spamAlertChannelDescription,
				[Locale.Polish]: cmd_pl.spamAlertChannelDescription,
			  })
		  .addChannelTypes(ChannelType.GuildText)
		  .setRequired(false)
	  )
	  .addRoleOption((option) =>
		option
		  .setName("staff_role")
		  .setDescription(cmd_en.spamStaffRoleDescription)
		  .setDescriptionLocalizations({
				[Locale.French]: cmd_fr.spamStaffRoleDescription,
				[Locale.SpanishES]: cmd_es.spamStaffRoleDescription,
				[Locale.German]: cmd_de.spamStaffRoleDescription,
				[Locale.Polish]: cmd_pl.spamStaffRoleDescription,
			  })
		  .setRequired(false)
	  )
    .addIntegerOption((option) =>
    option
      .setName("number")
      .setDescription(cmd_en.spamInfoNombre)
		  .setDescriptionLocalizations({
				[Locale.French]: cmd_fr.spamInfoNombre,
				[Locale.SpanishES]: cmd_es.spamInfoNombre,
				[Locale.German]: cmd_de.spamInfoNombre,
				[Locale.Polish]: cmd_pl.spamInfoNombre,
			  })
      .setRequired(false)
      .setMinValue(2)
  )
  .addIntegerOption((option) =>
    option
      .setName("duration")
      .setDescription(cmd_en.spamInfoDuree)
      .setDescriptionLocalizations({
				[Locale.French]: cmd_fr.spamInfoDuree,
				[Locale.SpanishES]: cmd_es.spamInfoDuree,
				[Locale.German]: cmd_de.spamInfoDuree,
				[Locale.Polish]: cmd_pl.spamInfoDuree,
			  })
      .setRequired(false)
      .setMinValue(5)
  ),
  // 1) Dans le tableau commands, ajoute cette commande
new SlashCommandBuilder()
  .setName("view-setup-verification")
  .setDescription("Display the current verification setup for this server")
  .setDescriptionLocalizations({
    [Locale.French]: "Affiche la configuration actuelle de vérification de ce serveur",
    [Locale.SpanishES]: "Muestra la configuración actual de verificación de este servidor",
    [Locale.German]: "Zeigt die aktuelle Verifizierungskonfiguration dieses Servers an",
    [Locale.Polish]: "Wyświetla obecną konfigurację weryfikacji tego serwera",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
  .setName("set-welcome-message")
  .setDescription("Create or update a welcome DM message for this server")
  .setDescriptionLocalizations({
    [Locale.French]: "Crée ou met à jour un message de bienvenue privé pour ce serveur",
    [Locale.SpanishES]: "Crea o actualiza un mensaje privado de bienvenida para este servidor",
    [Locale.German]: "Erstellt oder aktualisiert eine private Willkommensnachricht für diesen Server",
    [Locale.Polish]: "Tworzy lub aktualizuje prywatną wiadomość powitalną dla tego serwera",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("language")
      .setDescription("Language of the welcome message")
      .setDescriptionLocalizations({
        [Locale.French]: "Langue du message de bienvenue",
        [Locale.SpanishES]: "Idioma del mensaje de bienvenida",
        [Locale.German]: "Sprache der Willkommensnachricht",
        [Locale.Polish]: "Język wiadomości powitalnej",
      })
      .setRequired(true)
      .addChoices(
        { name: "Français", value: "fr" },
        { name: "English", value: "en" },
        { name: "Español", value: "es" },
        { name: "Deutsch", value: "de" },
        { name: "Polski", value: "pl" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Private welcome message to send")
      .setDescriptionLocalizations({
        [Locale.French]: "Message privé de bienvenue à envoyer",
        [Locale.SpanishES]: "Mensaje privado de bienvenida para enviar",
        [Locale.German]: "Private Willkommensnachricht, die gesendet wird",
        [Locale.Polish]: "Prywatna wiadomość powitalna do wysłania",
      })
      .setRequired(true)
      .setMaxLength(2000)
  ),
  new SlashCommandBuilder()
  .setName("delete-welcome-message")
  .setDescription("Delete a welcome DM message for this server")
  .setDescriptionLocalizations({
    [Locale.French]: "Supprime un message privé de bienvenue pour ce serveur",
    [Locale.SpanishES]: "Elimina un mensaje privado de bienvenida para este servidor",
    [Locale.German]: "Löscht eine private Willkommensnachricht für diesen Server",
    [Locale.Polish]: "Usuwa prywatną wiadomość powitalną dla tego serwera",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("language")
      .setDescription("Language of the welcome message to delete")
      .setDescriptionLocalizations({
        [Locale.French]: "Langue du message de bienvenue à supprimer",
        [Locale.SpanishES]: "Idioma del mensaje de bienvenida que se eliminará",
        [Locale.German]: "Sprache der zu löschenden Willkommensnachricht",
        [Locale.Polish]: "Język wiadomości powitalnej do usunięcia",
      })
      .setRequired(true)
      .addChoices(
        { name: "Français", value: "fr" },
        { name: "English", value: "en" },
        { name: "Español", value: "es" },
        { name: "Deutsch", value: "de" },
        { name: "Polski", value: "pl" }
      )
  ),
].map((command) => command.toJSON());

// =========================
// HELPERS
// =========================
function isTopRoleMember(member: any, guild: any): boolean {
  const nonBotMembers = guild.members.cache.filter((m: any) => !m.user.bot);

  let highestMember = null;

  for (const [, m] of nonBotMembers) {
    if (!highestMember) {
      highestMember = m;
      continue;
    }

    if (m.roles.highest.position > highestMember.roles.highest.position) {
      highestMember = m;
    }
  }

  if (!highestMember) return false;
  return member.id === highestMember.id;
}

function splitMessage(text: string, maxLength = 2000): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxLength) {
    let splitIndex = remaining.lastIndexOf("\n", maxLength);

    if (splitIndex === -1) {
      splitIndex = remaining.lastIndexOf(" ", maxLength);
    }

    if (splitIndex === -1) {
      splitIndex = maxLength;
    }

    chunks.push(remaining.slice(0, splitIndex));
    remaining = remaining.slice(splitIndex).trimStart();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}

async function canUseSetupVerification(interaction: any): Promise<boolean> {
  const permission = getSetupPermissionStmt.get(
    interaction.guild.id,
    interaction.user.id
  ) as SetupVerificationPermissionRow | undefined;

  if (!isBasilic(interaction) && !permission) {
    return false;
  }

  return true;
}

async function blacklistMemberInGuild(params: {
  guild: any;
  targetUserId: string;
  moderatorId: string;
  moderatorTag: string;
  reason?: string | null;
  username?: string | null;
  msgInternal: any;
}) {
  const { guild, targetUserId, moderatorId, moderatorTag, reason, username, msgInternal } = params;

  const nowIso = new Date().toISOString();

  let resolvedUsername = username ?? targetUserId;

  try {
    const user = await client.users.fetch(targetUserId);
    resolvedUsername = user.tag;
  } catch {
    // on garde la fallback
  }

  insertBlacklistedUserStmt.run(
    guild.id,
    targetUserId,
    resolvedUsername,
    nowIso,
    moderatorId,
    reason ?? null
  );

  const member = await guild.members.fetch(targetUserId).catch(() => null);

  if (member?.kickable) {
    await member.kick(msgInternal.blacklistKickReason(moderatorTag, reason));
    return { kicked: true, username: resolvedUsername };
  }

  return { kicked: false, username: resolvedUsername };
}

async function findUserGuilds(targetUserId: string): Promise<string[]> {
  const rows = getAuthorizedGuildIdsStmt.all() as AuthorizedGuildRow[];
  const uniqueGuildIds = [...new Set(rows.map((row) => row.guild_id))];
  const foundGuilds: string[] = [];

  for (const guildId of uniqueGuildIds) {
    try {
      const guild = await client.guilds.fetch(guildId).catch(() => null);
      if (!guild) continue;

      const member = await guild.members.fetch(targetUserId).catch(() => null);
      if (!member) continue;

      foundGuilds.push(`${guild.name} (${guild.id})`);
    } catch {
      // ignore
    }
  }

  return foundGuilds;
}

function formatGuildList(lines: string[]): string {
  if (lines.length === 0) return "-";
  return lines.map((line) => `- ${line}`).join("\n");
}

function getAccountAgeInDays(createdAt: Date): number {
  const diffMs = Date.now() - createdAt.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

function formatAccountAge(createdAt: Date, msgServer: any): string {
  const days = Math.floor(getAccountAgeInDays(createdAt));

  if (days < 1) return msgServer.lessThanOneDay;
  if (days === 1) return msgServer.oneDay;
  if (days < 30) return msgServer.days(days);

  const months = Math.floor(days / 30);
  if (months === 1) return msgServer.oneMonth;
  if (months < 12) return msgServer.months(months);

  const years = Math.floor(months / 12);
  if (years === 1) return msgServer.oneYear;
  return msgServer.years(years);
}

function buildDecisionButtonsRow(userId: string, msgServer : any) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`staff_validate_${userId}`)
      .setLabel(msgServer.approveButton)
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`staff_refuse_${userId}`)
      .setLabel(msgServer.rejectButton)
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId(`staff_blacklist_${userId}`)
      .setLabel(msgServer.blacklistButton)
      .setStyle(ButtonStyle.Secondary),
	  
	new ButtonBuilder()
	  .setCustomId(`staff_discuss_${userId}`)
	  .setLabel(msgServer.discussMemberButton)
	  .setStyle(ButtonStyle.Primary),
  );
}


function buildDisabledDecisionButtonsRow(finalAction: "approved" | "rejected" | "blacklisted", msgServer: any) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("staff_validate_done")
      .setLabel(msgServer.approvedDoneButton)
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),

    new ButtonBuilder()
      .setCustomId("staff_refuse_done")
      .setLabel(msgServer.rejectedDoneButton)
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),

    new ButtonBuilder()
      .setCustomId("staff_blacklist_done")
      .setLabel(msgServer.blacklistedDoneButton)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
	  
	new ButtonBuilder()
	  .setCustomId("staff_discuss_done")
	  .setLabel(msgServer.discussMemberButton)
	  .setStyle(ButtonStyle.Primary)
	  .setDisabled(true)
  );
}

function isGuildOwner(interaction: any): boolean {
  return interaction.guild.ownerId === interaction.user.id;
}

async function replyEphemeral(interaction: any, content: string) {
  await interaction.reply({
    content,
    flags: MessageFlags.Ephemeral,
  });
}

function isBasilicOrAuthorizedGuildOwner(interaction: any): boolean {
  if (isBasilic(interaction)) return true;

  return isAuthorizedServer(interaction) && isGuildOwner(interaction);
}

function isAuthorizedServer(interaction: any): boolean {
  const guildAllowed = getSetupPermissionStmt.get(
    interaction.guild.id
  ) as SetupVerificationPermissionRow | undefined;

  return !!guildAllowed;
}

//si c'est moi
function isBasilic(interaction: any): boolean{
  const BASILIC_IDS: string[] = [
    "260716512711540736", // compte principal
    "1482664456998621325", // compte secondaire
    "165957640281784320", // sparkydapikachu
  ];
  
  return BASILIC_IDS.includes(interaction.user.id);
}

function isUsedOnAServer(
  interaction: BaseInteraction<CacheType>
): interaction is BaseInteraction<"cached"> & { guild: NonNullable<BaseInteraction<CacheType>["guild"]> } {
  return interaction.inGuild() && interaction.guild != null;
}

function isAdministrator(member: any, interaction: any): boolean {
  return member.permissions.has(PermissionFlagsBits.Administrator) || isBasilic(interaction);
}

async function requireGuild(
  interaction: any,
  msg: string
): Promise<boolean> {
  if (isUsedOnAServer(interaction)) return true;

  await replyEphemeral(interaction, msg);
  return false;
}

async function getGuildVerificationSettingsOrReply(
  interaction: any,
  msgIn: any
): Promise<GuildVerificationSettingsRow | null> {
  const settings = getGuildVerificationSettingsStmt.get(
    interaction.guild.id
  ) as GuildVerificationSettingsRow | undefined;

  if (!settings) {
    await replyEphemeral(interaction, msgIn.verificationNotConfigured);
    return null;
  }

  return settings;
}

async function getCallingMember(interaction: any) {
  return interaction.guild.members.fetch(interaction.user.id);
}

async function requireAuthorizedGuildOwner(
  interaction: any,
  deniedMessage: string
): Promise<boolean> {
  if (!isBasilicOrAuthorizedGuildOwner(interaction)) {
    await replyEphemeral(interaction, deniedMessage);
    return false;
  }

  return true;
}

async function requireStaffOnConfiguredGuild(
  interaction: any,
  msgIn: any
): Promise<{ member: any; settings: GuildVerificationSettingsRow } | null> {
  const member = await getCallingMember(interaction);
  const settings = await getGuildVerificationSettingsOrReply(interaction, msgIn);

  if (!settings) return null;

  if (
    !isAdministrator(member, interaction) &&
    !member.roles.cache.has(settings.staff_role_id)
  ) {
    await replyEphemeral(interaction, msgIn.onlyStaffCanUseCommand);
    return null;
  }

  return { member, settings };
}

async function requireAdminOnGuild(
  interaction: any,
  msgIn: any
): Promise<any | null> {
  const member = await getCallingMember(interaction);

  if (!isAdministrator(member, interaction)) {
    await replyEphemeral(interaction, msgIn.onlyStaffCanUseCommand);
    return null;
  }

  return member;
}

// =========================
// READY
// =========================
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Connecté en tant que ${readyClient.user.tag}`);

  try {
    // Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),   : pour tester sur un seul serveur 
    // Routes.applicationCommands(CLIENT_ID),    : pour déployer sur d'autres serveurs
    // isProduction : 1 en production, 0 pour en test

    const rest = new REST({ version: "10" }).setToken(TOKEN);
    /*
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    */

  await rest.put(
    isProduction
      ? Routes.applicationCommands(CLIENT_ID)
      : Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

    console.log("✅ Commandes slash enregistrées");
  } catch (error) {
    console.error("❌ Erreur enregistrement commandes :", error);
  }
});


// =========================
// INTERACTIONS
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {
	const verificationDeps = {
	  client,
	  getVerifiedUserStmt,
	  insertVerifiedUserStmt,
	  getBlacklistedUserStmt,
	  getGuildVerificationSettingsStmt,
	  getGuildVerificationQuestionsStmt,
	  buildDecisionButtonsRow,
	  buildDisabledDecisionButtonsRow,
	  blacklistMemberInGuild,
	  isUsedOnAServer,
	  isAdministrator,
	  formatAccountAge,
	};
  
    const msgIn = getMessagesUser(interaction);
    const msgOut = getMessagesOut(interaction.locale);
    const msgServer = isUsedOnAServer(interaction)
        ? getMessagesServer(interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en")
        : getMessagesServer("en");
    const internalLocale = isUsedOnAServer(interaction)
        ? interaction.guildLocale ?? interaction.guild.preferredLocale ?? "en"
        : interaction.locale ?? "en";

    const msgInternal = getMessagesInternal(internalLocale);
	
	const handledButtons = await handleVerificationButtons({
	  interaction,
	  deps: verificationDeps,
	  msgIn,
	  msgOut,
	  msgServer,
	  msgInternal
	});
	if (handledButtons) return;

  // =======================
// BOUTONS SPAM
// =======================
if (interaction.isButton()) {

  // ===== FAUX SPAM =====
  if (interaction.customId.startsWith("spam:false_positive:")) {

    if (!interaction.inGuild()) return;

    const [, action, guildId, userId] = interaction.customId.split(":");

    spamAlertService.clearActiveAlert(guildId, userId);

    await interaction.update({
      content: interaction.message.content + "\n\n"+msgServer.spamFalsePositiveConfirmed,
      components: []
    });

    return;
  }

  // ===== BAN =====
  if (interaction.customId.startsWith("spam:ban:")) {
      const [, action, guildId, userId] = interaction.customId.split(":");

      const member = await interaction.guild!.members.fetch(userId).catch(() => null);

      if (member?.bannable) {
        await member.ban({
          reason: msgInternal.spamBanReason(interaction.user.tag)
        });
      }

      spamAlertService.clearActiveAlert(guildId, userId);

      await interaction.update({
        content: interaction.message.content + "\n\n" + msgServer.spamUserBanned,
        components: []
      });

      return;
    }
}

	const handledModals = await handleVerificationModals({
	  interaction,
	  deps: verificationDeps,
	  msgIn,
	  msgOut,
	  msgServer,
	  msgInternal,
	});
	if (handledModals) return;
	
    // =========================================
    // 1) COMMANDES SLASH
    // =========================================
    if (interaction.isChatInputCommand()) {
        
      //on veut que les commandes soient utilisées sur un serveur, pas en MP
        if (!isUsedOnAServer(interaction)) {
          await replyEphemeral(interaction, msgIn.commandMustBeUsedInServer);
          return;
        }

        //sur toutes les commandes autres que "allow-setup-verification"
        if (
          interaction.commandName !== "allow-setup-verification" &&
          !isBasilic(interaction) &&
          !isAuthorizedServer(interaction)
        ) {
          await replyEphemeral(interaction, msgIn.NotAuthorizedServer);
          return;
        }

      if (interaction.commandName === "setup-verification") {
        if (!isBasilicOrAuthorizedGuildOwner(interaction)) {
          await interaction.reply({
            content: msgIn.notAllowedConfigureVerification,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const verifiedRoleId = interaction.options.getRole("verified_role", true);
        const staffCategoryId = interaction.options.getString("staff_category_id", true);
        const staffRoleId = interaction.options.getRole("staff_role", true);
        const verificationTimeoutHours = interaction.options.getInteger("verification_timeout_hours", false) ?? 0;

        const nowIso = new Date().toISOString();

        upsertGuildVerificationSettingsStmt.run(
          interaction.guild!.id,
          verifiedRoleId.id,
          staffCategoryId,
          staffRoleId.id,
          interaction.user.id,
          nowIso,
          verificationTimeoutHours
        );

        if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) {
          await interaction.reply({
            content: msgIn.commandMustBeUsedInTextChannel,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("start_verification")
            .setLabel(msgServer.startVerificationButton)
            .setStyle(ButtonStyle.Primary)
        );

        await (interaction.channel as TextChannel).send({
          content: msgServer.startVerificationMessage,
          components: [row],
        });



        await interaction.reply({
          content: msgIn.verificationSettingsSaved,
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "check-member") {
        if (!(await requireGuild(interaction, msgIn.commandMustBeUsedInServer))) return;

        const context = await requireStaffOnConfiguredGuild(interaction, msgIn);
        if (!context) return;

        const targetUserId = interaction.options.getString("user_id", true);

        const verifiedRecord = getVerifiedUserStmt.get(targetUserId) as VerifiedUserRow | undefined;
        const blacklistedHere = getBlacklistedUserStmt.get(
          interaction.guild!.id,
          targetUserId
        ) as BlacklistedUserRow | undefined;
        const blacklistedEverywhere = getBlacklistedUsersEverywhereStmt.all(
          targetUserId
        ) as BlacklistedUserRow[];
        const foundGuilds = await findUserGuilds(targetUserId);

        let content = "";

        if (verifiedRecord) {
          content += msgIn.VerifiedUserFound(
            verifiedRecord.user_id,
            verifiedRecord.username,
            verifiedRecord.verified_at,
            verifiedRecord.verified_by
          );
        } else {
          content += msgIn.userUnknownToTheBot(targetUserId);
        }

        if (blacklistedHere) {
          content +=
            "\n\n" +
            msgIn.BlacklistedUserFound(
              blacklistedHere.user_id,
              blacklistedHere.username,
              blacklistedHere.blacklisted_at,
              blacklistedHere.blacklisted_by,
              blacklistedHere.reason ?? msgIn.noReasonProvided
            );
        }

        if (blacklistedEverywhere.length > 0) {
          const blacklistLines = blacklistedEverywhere.map(
            (entry) =>
              `${entry.guild_id} — ${entry.blacklisted_at} — ${entry.reason ?? msgIn.noReasonProvided}`
          );

          content +=
            "\n\n" +
            msgIn.memberBlacklistedOnServers(formatGuildList(blacklistLines));
        }

        content += "\n\n" + msgIn.memberPresentOnServers(formatGuildList(foundGuilds));

        const chunks = splitMessage(content);

        await replyEphemeral(interaction, chunks[0]);

        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({
            content: chunks[i],
            flags: MessageFlags.Ephemeral,
          });
        }

        return;
      }

      if (interaction.commandName === "blacklist-member") {
        if (!(await requireGuild(interaction, msgIn.commandMustBeUsedInServer))) return;

        const context = await requireStaffOnConfiguredGuild(interaction, msgIn);
        if (!context) return;

        const targetUserId = interaction.options.getString("user_id", true);
        const reason = interaction.options.getString("reason", false);

        const result = await blacklistMemberInGuild({
          guild: interaction.guild,
          targetUserId,
          moderatorId: interaction.user.id,
          moderatorTag: interaction.user.tag,
          reason,
          msgInternal,
        });

        await replyEphemeral(
          interaction,
          result.kicked
            ? msgIn.blacklistMemberSuccess(targetUserId, result.username)
            : msgIn.blacklistMemberSavedButKickFailed(targetUserId, result.username)
        );

        return;
      }

      if (interaction.commandName === "allow-setup-verification") {
        if (!isBasilic(interaction)) {
          await interaction.reply({
            content: msgIn.CommandReservedByBasilic,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const guildId = interaction.options.getString("guild_id", true);

        insertSetupPermissionStmt.run(
          guildId,
          new Date().toISOString()
        );

        await interaction.reply({
          content: msgIn.permissionAdded(guildId),
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "add-verification-question") {
        if (!(await requireGuild(interaction, msgIn.commandMustBeUsedInServer))) return;
        if (!(await requireAuthorizedGuildOwner(interaction, msgIn.notAllowedManageQuestions))) return;

        const guildSettings = await getGuildVerificationSettingsOrReply(interaction, msgIn);
        if (!guildSettings) return;

        const questions = getGuildVerificationQuestionsStmt.all(
          interaction.guild!.id
        ) as GuildVerificationQuestionRow[];

        if (questions.length >= 5) {
          await replyEphemeral(interaction, msgIn.YouCannotConfigureMoreThanFiveQuestions);
          return;
        }

        const label = interaction.options.getString("label", true).trim();
        const type = interaction.options.getString("type", true);
        const required = interaction.options.getBoolean("required", true);

        if (label.length > 45) {
          await replyEphemeral(interaction, "Can't exceed 45 characters");
          return;
        }

        const nextOrder = questions.length + 1;
        const questionKey = `question_${Date.now()}`;

        insertGuildVerificationQuestionStmt.run(
          interaction.guild!.id,
          nextOrder,
          questionKey,
          label,
          type,
          required ? 1 : 0
        );

        await replyEphemeral(interaction, msgIn.QuestionAddedAtIndex(nextOrder));
        return;
      }

      if (interaction.commandName === "list-verification-questions") {
        if (!isBasilicOrAuthorizedGuildOwner(interaction)) {
          await interaction.reply({
            content: msgIn.YouAreNotAllowedToViewVerificationQuestionsOnThisServer,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const questions = getGuildVerificationQuestionsStmt.all(
          interaction.guild!.id
        ) as GuildVerificationQuestionRow[];

        if (questions.length === 0) {
          await interaction.reply({
            content: msgIn.noVerificationQuestions,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const content = msgIn.verificationQuestionsTitle + `\n\n` +
          questions
            .map(
              (q, index) =>
                `**${index + 1}.** ${q.question_label}
              ${msgIn.typeLabel}: \`${q.question_type}\` | ${msgIn.requiredLabel}: \`${q.required === 1 ? msgIn.yes : msgIn.no}\``
            )
            .join("\n\n");

        await interaction.reply({
          content,
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "edit-verification-question") {
        if (!isBasilicOrAuthorizedGuildOwner(interaction)) {
          await interaction.reply({
            content: msgIn.YouAreNotAllowedtoEditVerificationQuestionsOnThisServer,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const index = interaction.options.getInteger("index", true);
        const newLabelRaw = interaction.options.getString("label", false);
        const newLabel = newLabelRaw?.trim();
        const newType = interaction.options.getString("type");
        const newRequired = interaction.options.getBoolean("required");
		
        if (newLabel && newLabel.length > 45) {
          await replyEphemeral(interaction, "Can't exceed 45 characters");
          return;
        }

        const question = getGuildVerificationQuestionByIndexStmt.get(
          interaction.guild!.id,
          index - 1
        ) as GuildVerificationQuestionRow | undefined;

        if (!question) {
          await interaction.reply({
            content: msgIn.noQuestionFound(index),
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        updateGuildVerificationQuestionStmt.run(
          newLabel ?? question.question_label,
          newType ?? question.question_type,
          newRequired === null ? question.required : newRequired ? 1 : 0,
          question.id
        );

        await interaction.reply({
          content: msgIn.questionUpdatedSuccessfully(index),
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "delete-verification-question") {
        const index = interaction.options.getInteger("index", true);

        const question = getGuildVerificationQuestionByIndexStmt.get(
          interaction.guild!.id,
          index - 1
        ) as GuildVerificationQuestionRow | undefined;

        if (!question) {
          await interaction.reply({
            content: msgIn.noQuestionFound(index),
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        deleteGuildVerificationQuestionByIdStmt.run(question.id);

        const remainingQuestions = getGuildVerificationQuestionsStmt.all(
          interaction.guild!.id
        ) as GuildVerificationQuestionRow[];

        for (let i = 0; i < remainingQuestions.length; i++) {
          reorderGuildVerificationQuestionsStmt.run(i + 1, remainingQuestions[i].id);
        }

        await interaction.reply({
          content: msgIn.questionDeletedSuccessfully(index),
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "bot-help") {
        const chunks = splitMessage(msgIn.helpMessage, 2000);

        await replyEphemeral(interaction, chunks[0]);

        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({
            content: chunks[i],
            flags: MessageFlags.Ephemeral,
          });
        }

        return;
      }
		  
	if (interaction.commandName === "unblacklist-member") {
    if (!(await requireGuild(interaction, msgIn.commandMustBeUsedInServer))) return;

    const context = await requireStaffOnConfiguredGuild(interaction, msgIn);
    if (!context) return;

    const targetUserId = interaction.options.getString("user_id", true);

    const blacklistedRecord = getBlacklistedUserStmt.get(
      interaction.guild!.id,
      targetUserId
    ) as BlacklistedUserRow | undefined;

    if (!blacklistedRecord) {
      await replyEphemeral(interaction, msgIn.userNotBlacklisted(targetUserId));
      return;
    }

    deleteBlacklistedUserStmt.run(interaction.guild!.id, targetUserId);

    await replyEphemeral(interaction, msgIn.userRemovedFromBlacklist(targetUserId));
    return;
  }
	
	if (interaction.commandName === "setup-spam-detection") {
	  const member = await interaction.guild!.members.fetch(interaction.user.id);

	  if (!isAdministrator(member, interaction)) {
		await interaction.reply({
		  content: msgIn.onlyStaffCanUseCommand,
		  flags: MessageFlags.Ephemeral,
		});
		return;
	  }

	  const enabled = interaction.options.getBoolean("enabled", true);
	  const alertChannel = interaction.options.getChannel("alert_channel");
	  const staffRole = interaction.options.getRole("staff_role");
    const messageThreshold = interaction.options.getInteger("number", false) ?? 6;
    const windowSeconds = interaction.options.getInteger("duration", false) ?? 20;

	  const existingSpamSettings = getGuildSpamSettingsStmt.get(interaction.guild!.id) as
		| GuildSpamSettingsRow
		| undefined;

	  const alertChannelId =
		alertChannel?.id ?? existingSpamSettings?.alert_channel_id ?? null;

	  const staffRoleId =
		staffRole?.id ?? existingSpamSettings?.staff_role_id ?? null;

	  if (enabled && !alertChannelId) {
		await interaction.reply({
		  content: "You must provide an alert channel when enabling spam detection.",
		  flags: MessageFlags.Ephemeral,
		});
		return;
	  }

    upsertGuildSpamSettingsStmt.run(
      interaction.guild!.id,
      enabled ? 1 : 0,
      alertChannel?.id ?? null,
      staffRole?.id ?? null,
      messageThreshold,
      windowSeconds,
      interaction.user.id,
      new Date().toISOString()
    );

	  await interaction.reply({
		content: enabled
		  ? `✅ Spam detection enabled.\nAlert channel: <#${alertChannelId}>${
			  staffRoleId ? `\nStaff role: <@&${staffRoleId}>` : ""
			}`
		  : "✅ Spam detection disabled.",
		flags: MessageFlags.Ephemeral,
	  });

	  return;
	}

  if (interaction.commandName === "view-setup-verification") {
    const settings = getGuildVerificationSettingsStmt.get(
      interaction.guild!.id
    ) as GuildVerificationSettingsRow | undefined;

    if (!settings) {
      await interaction.reply({
        content: msgIn.verificationNotConfigured,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const verifiedRole = interaction.guild!.roles.cache.get(settings.verified_role_id);
    const staffRole = interaction.guild!.roles.cache.get(settings.staff_role_id);

    const verifiedRoleDisplay = verifiedRole
      ? `<@&${settings.verified_role_id}>`
      : `Rôle introuvable (${settings.verified_role_id})`;

    const staffRoleDisplay = staffRole
      ? `<@&${settings.staff_role_id}>`
      : `Rôle introuvable (${settings.staff_role_id})`;

    await interaction.reply({
      content: msgIn.ViewVeriicationsetup(verifiedRoleDisplay, staffRoleDisplay, settings.verification_timeout_hours),
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

      return;
    }

    // =========================================
    // 2) BOUTONS
    // =========================================
	
	// dans verification-flow.ts

    // =========================================
    // 3) SOUMISSION DU MODAL
    // =========================================  
      if (interaction.isModalSubmit()) {
        if (!isUsedOnAServer(interaction)) {
          await interaction.reply({
            content: msgIn.actionMustBeUsedInServer,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);

        const questions = getGuildVerificationQuestionsStmt.all(
          interaction.guild.id
        ) as GuildVerificationQuestionRow[];

        if (questions.length === 0) {
          await interaction.reply({
            content: msgIn.noVerificationQuestions,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const accountAgeText = formatAccountAge(member.user.createdAt, msgServer);
        const createdTimestamp = Math.floor(member.user.createdAt.getTime() / 1000);

        const guildSettings = getGuildVerificationSettingsStmt.get(interaction.guild.id) as
          | {
              guild_id: string;
              verified_role_id: string;
              panel_channel_id: string;
              staff_category_id: string;
              staff_role_id: string;
              created_by: string;
              updated_at: string;
            }
          | undefined;

        if (!guildSettings) {
          await interaction.reply({
            content: msgIn.verificationNotConfigured,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const staffCategory = await interaction.guild.channels
          .fetch(guildSettings.staff_category_id)
          .catch(() => null);

        if (!staffCategory || staffCategory.type !== ChannelType.GuildCategory) {
          await interaction.reply({
            content: msgIn.configuredStaffCategoryNotFound,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

      const verificationChannel = await interaction.guild.channels.create({
        name: `verification-${member.user.username}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 90),
        type: ChannelType.GuildText,
        parent: staffCategory.id,
        permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: [
                PermissionFlagsBits.ViewChannel,
              ],
            },
            {
              id: guildSettings.staff_role_id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              id: client.user!.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageChannels,
              ],
            },
          ],
        });

    let content =
      `${msgServer.newVerificationRequest}\n\n` +
      `**${msgServer.memberLabel}:** <@${member.id}>\n` +
      `**${msgServer.tagLabel}:** ${member.user.tag}\n` +
      `**${msgServer.accountCreatedOnLabel}:** <t:${createdTimestamp}:F>\n` +
      `**${msgServer.accountAgeLabel}:** ${accountAgeText}\n\n`;

      for (const question of questions) {
        if (
          question.question_type === "text_short" ||
          question.question_type === "text_paragraph"
        ) {
          const answer = interaction.fields.getTextInputValue(question.question_key).trim();
          content += `**${question.question_label}:** ${answer}\n`;
          continue;
        }

        if (question.question_type === "file_image") {
          const files = interaction.fields.getUploadedFiles(
            question.question_key,
            question.required === 1
          );

          const file = files?.first();

          if (file) {
            content += `**${question.question_label}:** ${file.url}\n`;
          } else {
            content += `**${question.question_label}:** ${msgServer.noFileProvided}\n`;
          }
        }
      }

      
      content += `\n${msgServer.verificationWaiting(guildSettings.staff_role_id)}`;

      await (verificationChannel as TextChannel).send({
        content,
        components: [buildDecisionButtonsRow(member.id, msgServer)],
      });

      await interaction.reply({
        content: msgIn.verificationRequestSent,
        flags: MessageFlags.Ephemeral,
      });

      return;
    }
  } catch (error) {
    console.error("❌ Erreur interaction :", error);
    const msgIn = getMessagesUser(interaction);

    if (interaction.isRepliable()) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: msgIn.errorOccurred,
          flags: MessageFlags.Ephemeral,
        }).catch(() => null);
      } else {
        await interaction.reply({
          content: msgIn.errorOccurred,
          flags: MessageFlags.Ephemeral,
        }).catch(() => null);
      }
    }
  }
});

// =========================
// LOGIN
// =========================
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const guildAllowed = getSetupPermissionByGuildStmt.get(member.guild.id);

    if (!guildAllowed) return;

    // =========================
    // 1️⃣ BLACKLIST (PRIORITAIRE)
    // =========================
    const blacklistedUser = getBlacklistedUserStmt.get(
      member.guild.id,
      member.id
    ) as BlacklistedUserRow | undefined;

    if (blacklistedUser) {
      const locale = member.guild.preferredLocale;

      const msgOut = getMessagesOut(locale);
      const msgInternal = getMessagesInternal(locale);

      try {
        await member.send(msgOut.MsgBlacklisted(member.guild.name));
      } catch {}

      if (member.kickable) {
        await member.kick(msgInternal.kickReasonAuto);
      }

      return; // ⚠️ STOP ici
    }

    // =========================
    // 2️⃣ TIMEOUT VERIFICATION
    // =========================
    const guildSettings = getGuildVerificationSettingsStmt.get(member.guild.id) as
      | GuildVerificationSettingsRow
      | undefined;

    if (!guildSettings) return;

    // 0 = désactivé
    if (guildSettings.verification_timeout_hours === 0) return;

    const joinedAt = new Date();
    const expiresAt = new Date(
      joinedAt.getTime() +
        guildSettings.verification_timeout_hours * 60 * 60 * 1000
    );

    insertPendingVerificationSubmissionStmt.run(
      member.guild.id,
      member.id,
      joinedAt.toISOString(),
      expiresAt.toISOString()
    );

  } catch (error) {
    console.error(
      `Error while handling GuildMemberAdd for ${member.id}:`,
      error
    );
  }
});

client.on(Events.GuildMemberRemove, async (member) => {
  try {
    deletePendingVerificationSubmissionStmt.run(
      member.guild.id,
      member.id
    );
  } catch (error) {
    console.error(
      `Error while cleaning pending verification for ${member.id}:`,
      error
    );
  }
});

client.on(Events.MessageCreate, async (message) => {
  try {
    await spamAlertService.handleMessage(message);
  } catch (error) {
    console.error("❌ Erreur spam detection :", error);
  }
});

setInterval(async () => {
  try {
    const nowIso = new Date().toISOString();

    const expiredRows = getExpiredPendingVerificationSubmissionsStmt.all(nowIso) as Array<{
      guild_id: string;
      user_id: string;
      joined_at: string;
      expires_at: string;
    }>;

    for (const row of expiredRows) {
      try {
        const guild = await client.guilds.fetch(row.guild_id).catch(() => null);
        if (!guild) {
          deletePendingVerificationSubmissionStmt.run(row.guild_id, row.user_id);
          continue;
        }

        const member = await guild.members.fetch(row.user_id).catch(() => null);
        if (!member) {
          deletePendingVerificationSubmissionStmt.run(row.guild_id, row.user_id);
          continue;
        }

        const locale = guild.preferredLocale ?? "en";
        const msgOut = getMessagesOut(locale);
        const msgInternal = getMessagesInternal(locale);

        try {
          await member.send(
            msgOut.verificationTimeoutDM(guild.name)
          );
        } catch {
          // DMs fermés
        }

        if (member.kickable) {
          await member.kick(msgInternal.verificationTimeoutKickReason);
        }

        deletePendingVerificationSubmissionStmt.run(row.guild_id, row.user_id);
      } catch (error) {
        console.error(
          `Error while processing expired verification for ${row.user_id} in guild ${row.guild_id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error while checking expired pending verifications:", error);
  }
}, 60_000);

client.login(TOKEN);