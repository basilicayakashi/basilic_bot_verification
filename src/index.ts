import dotenv from "dotenv";
dotenv.config();

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
  Locale,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

import { SpamAlertService } from "./moderation/spam-alert.js";

import {
  getVerifiedUserStmt,
  insertVerifiedUserStmt,
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
  getGuildWelcomeMessagesAllStmt,
  upsertGuildWelcomeMessageStmt,
  deleteGuildWelcomeMessageStmt,
  getFreeGamesSettingsStmt,
  insertFreeGamePublicationStmt,
  getEnabledFreeGamesSettingsStmt,
  upsertFreeGamesSettingsStmt,
  getPublishedFreeGameIdsForGuildStmt,
  getAllFreeGamesStmt,
  getExpiredFreeGamePublicationsStmt,
  deleteFreeGamePublicationStmt,
  getGuildRoleMessageDeleteSettingsStmt,
  upsertGuildRoleMessageDeleteSettingsStmt,
  GuildRoleMessageDeleteSettingsRow,
  getReactionRoleEntriesStmt,
  ReactionRoleEntryRow,
  getReactionRolePanelByCategoryStmt,
  insertReactionRolePanelStmt,
  ReactionRoleCategoryRow,
  ReactionRolePanelRow,
  getReactionRoleCategoriesStmt,
  getReactionRoleCategoryStmt,
  updateReactionRoleCategoryStmt,
  insertReactionRoleCategoryStmt,
  updateReactionRoleEntryStmt,
  insertReactionRoleEntryStmt,
  deleteReactionRoleEntryStmt,
  getReactionRolePanelByMessageIdStmt,
  deleteReactionRoleCategoryStmt,
  deleteReactionRolePanelStmt,
  getBannedGuildStmt,
  getAllFreeGamesSettingsStmt,
  getFreeGamePublicationByMessageIdStmt
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

import {
  publishOrUpdatePanel,
  handleReactionAdd,
  handleReactionRemove,
}
  from "./reaction-roles/role-panels.js";

import { handleVerificationButtons, handleVerificationModals } from "./moderation/verification-flow.js";

//les messages envoyés à la personne qui fait appel au bot
import { getMessagesUser, getMessagesOut, getMessagesServer, getMessagesInternal } from "./langues/index.js";

// =========================
// CONFIG
// =========================
const TOKEN = process.env.DISCORD_TOKEN!;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const isProduction = process.env.BOT_EN_PRODUCTION === "1";

const STEAM_FREE_CHECK_INTERVAL_MINUTES = Number(
  process.env.STEAM_FREE_CHECK_INTERVAL_MINUTES ?? "60"
);

// =========================
// CLIENT
// =========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
});

const spamAlertService = new SpamAlertService({
  getGuildSpamSettings: (guildId: string) =>
    getGuildSpamSettingsStmt.get(guildId) as GuildSpamSettingsRow | undefined,
});

// =========================
// COMMANDES SLASH
// =========================

export const commands = [
  new SlashCommandBuilder()
    .setName("setup-verification")
    .setDescription("Configure verification for this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Configurer la vérification pour ce serveur",
      [Locale.SpanishES]: "Configurar la verificación para este servidor",
      [Locale.German]: "Die Verifizierung für diesen Server konfigurieren",
      [Locale.Polish]: "Skonfiguruj weryfikację",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName("verified_role")
        .setDescription("Role to grant after approval")
        .setDescriptionLocalizations({
          [Locale.French]: "Rôle à attribuer après approbation",
          [Locale.SpanishES]: "Rol que se asignará tras la aprobación",
          [Locale.German]: "Rolle, die nach der Genehmigung vergeben wird",
          [Locale.Polish]: "Rola przyznawana po zatwierdzeniu",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("staff_category_id")
        .setDescription("Category ID where staff channels will be created")
        .setDescriptionLocalizations({
          [Locale.French]: "ID de la catégorie dans laquelle les salons du staff seront créés",
          [Locale.SpanishES]: "ID de la categoría donde se crearán los canales del staff",
          [Locale.German]: "Kategorie-ID, in der die Staff-Kanäle erstellt werden",
          [Locale.Polish]: "ID kategorii, w której tworzone będą kanały personelu",
        })
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("staff_role")
        .setDescription("Staff role to notify")
        .setDescriptionLocalizations({
          [Locale.French]: "Rôle du staff à notifier",
          [Locale.SpanishES]: "Rol del staff a notificar",
          [Locale.German]: "Staff-Rolle, die benachrichtigt werden soll",
          [Locale.Polish]: "Rola administracji do powiadomienia",
        })
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("verification_timeout_hours")
        .setDescription("Time limit in hours to submit verification responses")
        .setDescriptionLocalizations({
          [Locale.French]: "Délai en heures pour soumettre les réponses de vérification",
          [Locale.SpanishES]: "Tiempo en horas para enviar las respuestas de verificación",
          [Locale.German]: "Zeitlimit in Stunden zum Einreichen der Verifizierungsantworten",
          [Locale.Polish]: "Czas w godzinach na przesłanie odpowiedzi weryfikacyjnych",
        })
        .setRequired(false)
        .setMinValue(0)
    ),

  new SlashCommandBuilder()
    .setName("check-member")
    .setDescription("Check a user's verification, blacklist status, and shared servers")
    .setDescriptionLocalizations({
      [Locale.French]: "Vérification, liste noire et serveurs communs d'un utilisateur",
      [Locale.SpanishES]: "Verificación, lista negra y servidores compartidos de un usuario",
      [Locale.German]: "Verifizierung, Sperrliste und gemeinsame Server eines Nutzers",
      [Locale.Polish]: "Weryfikacja, czarna lista i wspólne serwery użytkownika",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The user ID to look up")
        .setDescriptionLocalizations({
          [Locale.French]: "ID de l'utilisateur à rechercher",
          [Locale.SpanishES]: "ID del usuario que se debe buscar",
          [Locale.German]: "Die Benutzer-ID, nach der gesucht werden soll",
          [Locale.Polish]: "ID użytkownika",
        })
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("blacklist-member")
    .setDescription("Blacklist a user on this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Mettre un utilisateur sur liste noire sur ce serveur",
      [Locale.SpanishES]: "Poner un usuario en la lista negra en este servidor",
      [Locale.German]: "Einen Benutzer auf diesem Server auf die schwarze Liste setzen",
      [Locale.Polish]: "Dodać użytkownika do czarnej listy na tym serwerze",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The user ID to look up")
        .setDescriptionLocalizations({
          [Locale.French]: "ID de l'utilisateur à rechercher",
          [Locale.SpanishES]: "ID del usuario que se debe buscar",
          [Locale.German]: "Die Benutzer-ID, nach der gesucht werden soll",
          [Locale.Polish]: "ID użytkownika",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Add a reason")
        .setDescriptionLocalizations({
          [Locale.French]: "Ajouter une raison",
          [Locale.SpanishES]: "Agregar una razón",
          [Locale.German]: "Grund hinzufügen",
          [Locale.Polish]: "Dodaj powód",
        })
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("verify-member")
    .setDescription("Manually verify a member")
    .setDescriptionLocalizations({
      [Locale.French]: "Vérifier manuellement un membre",
      [Locale.SpanishES]: "Verificar manualmente a un miembro",
      [Locale.German]: "Ein Mitglied manuell verifizieren",
      [Locale.Polish]: "Ręcznie zweryfikuj członka",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("Discord ID of the member to verify")
        .setDescriptionLocalizations({
          [Locale.French]: "ID Discord du membre à vérifier",
          [Locale.SpanishES]: "ID de Discord del miembro a verificar",
          [Locale.German]: "Discord-ID des zu verifizierenden Mitglieds",
          [Locale.Polish]: "ID Discord członka do zweryfikowania",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("add-verification-question")
    .setDescription("Add a verification question for this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Ajouter une question de vérification pour ce serveur",
      [Locale.SpanishES]: "Agregar una pregunta de verificación para este servidor",
      [Locale.German]: "Eine Verifikationsfrage für diesen Server hinzufügen",
      [Locale.Polish]: "Dodaj pytanie weryfikacyjne dla tego serwera",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("label")
        .setDescription("Question label shown to the user")
        .setDescriptionLocalizations({
          [Locale.French]: "Libellé de la question affiché à l'utilisateur",
          [Locale.SpanishES]: "Etiqueta de la pregunta mostrada al usuario",
          [Locale.German]: "Fragebeschriftung, die dem Benutzer angezeigt wird",
          [Locale.Polish]: "Etykieta pytania wyświetlana użytkownikowi",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Question type")
        .setDescriptionLocalizations({
          [Locale.French]: "Type de question",
          [Locale.SpanishES]: "Tipo de pregunta",
          [Locale.German]: "Fragetyp",
          [Locale.Polish]: "Typ pytania",
        })
        .setRequired(true)
        .addChoices(
          {
            name: "Short text",
            value: "text_short",
            name_localizations: {
              [Locale.French]: "Texte court",
              [Locale.SpanishES]: "Texto corto",
              [Locale.German]: "Kurzer Text",
              [Locale.Polish]: "Krótki tekst",
            },
          },
          {
            name: "Paragraph",
            value: "text_paragraph",
            name_localizations: {
              [Locale.French]: "Paragraphe",
              [Locale.SpanishES]: "Párrafo",
              [Locale.German]: "Absatz",
              [Locale.Polish]: "Paragraf",
            },
          },
          {
            name: "Image upload",
            value: "file_image",
            name_localizations: {
              [Locale.French]: "Téléchargement d'image",
              [Locale.SpanishES]: "Carga de imagen",
              [Locale.German]: "Bild hochladen",
              [Locale.Polish]: "Przesłanie obrazu",
            },
          }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("required")
        .setDescription("Whether the question is required")
        .setDescriptionLocalizations({
          [Locale.French]: "Indique si la question est obligatoire",
          [Locale.SpanishES]: "Indica si la pregunta es obligatoria",
          [Locale.German]: "Gibt an, ob die Frage erforderlich ist",
          [Locale.Polish]: "Czy pytanie jest wymagane",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("edit-verification-question")
    .setDescription("Edit a verification question by its index")
    .setDescriptionLocalizations({
      [Locale.French]: "Modifier une question de vérification par son index",
      [Locale.SpanishES]: "Editar una pregunta de verificación por su índice",
      [Locale.German]: "Eine Verifizierungsfrage anhand ihres Index bearbeiten",
      [Locale.Polish]: "Edytuj pytanie weryfikacyjne według indeksu",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("Question index shown by /view-settings")
        .setDescriptionLocalizations({
          [Locale.French]: "Index de la question affiché par /view-settings",
          [Locale.SpanishES]: "Índice de la pregunta mostrado por /view-settings",
          [Locale.German]: "Frageindex, der von /view-settings angezeigt wird",
          [Locale.Polish]: "Indeks pytania wyświetlany przez /view-settings",
        })
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption((option) =>
      option
        .setName("label")
        .setDescription("New question label")
        .setDescriptionLocalizations({
          [Locale.French]: "Nouveau libellé de la question",
          [Locale.SpanishES]: "Nueva etiqueta de la pregunta",
          [Locale.German]: "Neuer Fragetext",
          [Locale.Polish]: "Nowa treść pytania",
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("New question type")
        .setDescriptionLocalizations({
          [Locale.French]: "Nouveau type de question",
          [Locale.SpanishES]: "Nuevo tipo de pregunta",
          [Locale.German]: "Neuer Fragetyp",
          [Locale.Polish]: "Nowy typ",
        })
        .setRequired(false)
        .addChoices(
          {
            name: "Short text",
            value: "text_short",
            name_localizations: {
              [Locale.French]: "Texte court",
              [Locale.SpanishES]: "Texto corto",
              [Locale.German]: "Kurzer Text",
              [Locale.Polish]: "Krótki tekst",
            },
          },
          {
            name: "Paragraph",
            value: "text_paragraph",
            name_localizations: {
              [Locale.French]: "Paragraphe",
              [Locale.SpanishES]: "Párrafo",
              [Locale.German]: "Absatz",
              [Locale.Polish]: "Paragraf",
            },
          },
          {
            name: "Image upload",
            value: "file_image",
            name_localizations: {
              [Locale.French]: "Téléversement d'image",
              [Locale.SpanishES]: "Subida de imagen",
              [Locale.German]: "Bild hochladen",
              [Locale.Polish]: "Obraz",
            },
          }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("required")
        .setDescription("Whether the question is required")
        .setDescriptionLocalizations({
          [Locale.French]: "Indique si la question est obligatoire",
          [Locale.SpanishES]: "Indica si la pregunta es obligatoria",
          [Locale.German]: "Gibt an, ob die Frage erforderlich ist",
          [Locale.Polish]: "Określa, czy pytanie jest wymagane",
        })
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("delete-verification-question")
    .setDescription("Delete a verification question by its index")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprimer une question de vérification par son index",
      [Locale.SpanishES]: "Eliminar una pregunta de verificación por su índice",
      [Locale.German]: "Eine Verifizierungsfrage anhand ihres Index löschen",
      [Locale.Polish]: "Usuwa pytanie weryfikacyjne według jego indeksu",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("Question index shown by /view-settings")
        .setDescriptionLocalizations({
          [Locale.French]: "Index de la question affiché par /view-settings",
          [Locale.SpanishES]: "Índice de la pregunta mostrado por /view-settings",
          [Locale.German]: "Frageindex, der durch /view-settings angezeigt wird",
          [Locale.Polish]: "Indeks pytania wyświetlany przez /view-settings",
        })
        .setRequired(true)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Display the bot documentation for a given section")
    .setDescriptionLocalizations({
      [Locale.French]: "Afficher la documentation du bot pour une section donnée",
      [Locale.SpanishES]: "Mostrar la documentación del bot para una sección",
      [Locale.German]: "Bot-Dokumentation für einen Abschnitt anzeigen",
      [Locale.Polish]: "Wyświetl dokumentację bota dla wybranej sekcji",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) =>
      o
        .setName("section")
        .setDescription("Section to display")
        .setDescriptionLocalizations({
          [Locale.French]: "Section à afficher",
          [Locale.SpanishES]: "Sección a mostrar",
          [Locale.German]: "Anzuzeigender Abschnitt",
          [Locale.Polish]: "Sekcja do wyświetlenia",
        })
        .setRequired(true)
        .addChoices(
          { name: "about", value: "about" },
          { name: "verification", value: "verification" },
          { name: "spam", value: "spam" },
          { name: "reaction-roles", value: "reaction-roles" },
          { name: "free-games", value: "free-games" },
          { name: "permissions", value: "permissions" },
        )
    ),

  new SlashCommandBuilder()
    .setName("unblacklist-member")
    .setDescription("Remove a user from the blacklist for this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprimer un utilisateur de la liste noire pour ce serveur",
      [Locale.SpanishES]: "Eliminar un usuario de la lista negra para este servidor",
      [Locale.German]: "Einen Benutzer aus der schwarzen Liste für diesen Server entfernen",
      [Locale.Polish]: "Usuń użytkownika z listy zablokowanych dla tego serwera",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The user ID to look up")
        .setDescriptionLocalizations({
          [Locale.French]: "L'ID de l'utilisateur à rechercher",
          [Locale.SpanishES]: "El ID del usuario a buscar",
          [Locale.German]: "Die Benutzer-ID, die gesucht werden soll",
          [Locale.Polish]: "ID użytkownika do wyszukania",
        })
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("setup-spam-detection")
    .setDescription("Configure spam alert detection for this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Configurer la détection d'alertes de spam pour ce serveur",
      [Locale.SpanishES]: "Configurar la detección de alertas de spam para este servidor",
      [Locale.German]: "Spam-Alarmdetektion für diesen Server konfigurieren",
      [Locale.Polish]: "Skonfiguruj wykrywanie alertów spamu dla tego serwera",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable spam detection")
        .setDescriptionLocalizations({
          [Locale.French]: "Activer ou désactiver la détection de spam",
          [Locale.SpanishES]: "Habilitar o deshabilitar la detección de spam",
          [Locale.German]: "Spam-Erkennung aktivieren oder deaktivieren",
          [Locale.Polish]: "Włącz lub wyłącz wykrywanie spamu",
        })
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("alert_channel")
        .setDescription("Channel where moderation alerts will be sent")
        .setDescriptionLocalizations({
          [Locale.French]: "Canal où les alertes de modération seront envoyées",
          [Locale.SpanishES]: "Canal donde se enviarán las alertas de moderación",
          [Locale.German]: "Kanal, in dem Moderationswarnungen gesendet werden",
          [Locale.Polish]: "Kanał, gdzie będą wysyłane alerty moderacyjne",
        })
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("staff_role")
        .setDescription("Staff role to mention in spam alerts")
        .setDescriptionLocalizations({
          [Locale.French]: "Rôle du personnel à mentionner dans les alertes de spam",
          [Locale.SpanishES]: "Rol del personal a mencionar en las alertas de spam",
          [Locale.German]: "Mitarbeiter-Rolle, die in Spam-Warnungen erwähnt wird",
          [Locale.Polish]: "Rola personelu do wspomnienia w alertach spamu",
        })
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Number of messages required to trigger an alert")
        .setDescriptionLocalizations({
          [Locale.French]: "Nombre de messages requis pour déclencher une alerte",
          [Locale.SpanishES]: "Número de mensajes requeridos para activar una alerta",
          [Locale.German]: "Anzahl der Nachrichten, die erforderlich sind, um eine Warnung auslösen",
          [Locale.Polish]: "Liczba wiadomości wymaganych do wyzwolenia alarmu",
        })
        .setRequired(false)
        .setMinValue(2)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in seconds of the detection window")
        .setDescriptionLocalizations({
          [Locale.French]: "Durée en secondes de la fenêtre de détection",
          [Locale.SpanishES]: "Duración en segundos de la ventana de detección",
          [Locale.German]: "Dauer in Sekunden des Erkennungsfensters",
          [Locale.Polish]: "Czas trwania w sekundach okna wykrywania",
        })
        .setRequired(false)
        .setMinValue(5)
    ),
  new SlashCommandBuilder()
    .setName("view-settings")
    .setDescription("Display the current settings for this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Affiche les paramètres actuels de ce serveur",
      [Locale.SpanishES]: "Muestra los parámetros actuales de este servidor",
      [Locale.German]: "Zeigt die aktuellen Einstellungen dieses Servers an",
      [Locale.Polish]: "Wyświetl bieżące ustawienia bota dla tego serwera",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName("list-members-by-role-count")
    .setDescription("List members having exactly N roles")
    .setDescriptionLocalizations({
      [Locale.French]: "Lister les membres ayant exactement N rôles",
      [Locale.SpanishES]: "Listar miembros con exactamente N roles",
      [Locale.German]: "Mitglieder mit genau N Rollen auflisten",
      [Locale.Polish]: "Wyświetl członków posiadających dokładnie N ról",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Exact number of roles")
        .setDescriptionLocalizations({
          [Locale.French]: "Nombre exact de rôles",
          [Locale.SpanishES]: "Número exacto de roles",
          [Locale.German]: "Exakte Anzahl von Rollen",
          [Locale.Polish]: "Dokładna liczba ról",
        })
        .setRequired(true)
        .setMinValue(1)
    ),
  new SlashCommandBuilder()
    .setName("freegames-publish")
    .setDescription("Publish notifications for new free games (if enabled)")
    .setDescriptionLocalizations({
      [Locale.French]: "Publier les notifications de jeux gratuits (si activé)",
      [Locale.SpanishES]: "Publicar notificaciones de juegos gratuitos (si activado)",
      [Locale.German]: "Benachrichtigungen für kostenlose Spiele veröffentlichen",
      [Locale.Polish]: "Publikuj powiadomienia o darmowych grach (jeśli włączone)",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to publish notifications (leave empty to skip)")
        .setDescriptionLocalizations({
          [Locale.French]: "Salon pour publier les notifications (vide = ignorer)",
          [Locale.SpanishES]: "Canal para publicar notificaciones (vacío = omitir)",
          [Locale.German]: "Kanal für Benachrichtigungen (leer lassen = überspringen)",
          [Locale.Polish]: "Kanał do publikowania powiadomień (puste = pomiń)",
        })
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("from_steam")
        .setDescription("Publish Steam free games notifications")
        .setDescriptionLocalizations({
          [Locale.French]: "Publier les notifications de jeux gratuits Steam",
          [Locale.SpanishES]: "Publicar notificaciones de juegos gratuitos de Steam",
          [Locale.German]: "Steam-Benachrichtigungen für kostenlose Spiele veröffentlichen",
          [Locale.Polish]: "Publikuj powiadomienia o darmowych grach Steam",
        })
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("from_epic_games")
        .setDescription("Publish Epic Games free games notifications")
        .setDescriptionLocalizations({
          [Locale.French]: "Publier les notifications de jeux gratuits Epic Games",
          [Locale.SpanishES]: "Publicar notificaciones de juegos gratuitos de Epic Games",
          [Locale.German]: "Epic Games-Benachrichtigungen für kostenlose Spiele veröffentlichen",
          [Locale.Polish]: "Publikuj powiadomienia o darmowych grach Epic Games",
        })
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("donation")
    .setDescription("Support the bot development")
    .setDescriptionLocalizations({
      [Locale.French]: "Soutenir le développement du bot",
      [Locale.SpanishES]: "Apoyar el desarrollo del bot",
      [Locale.German]: "Die Entwicklung des Bots unterstützen",
      [Locale.Polish]: "Wesprzyj rozwój bota",
    }),
  new SlashCommandBuilder()
    .setName("role-used-msg-delete")
    .setDescription("Delete new messages mentioning a configured role")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprimer les nouveaux messages mentionnant un rôle configuré",
      [Locale.SpanishES]: "Eliminar los nuevos mensajes que mencionan un rol configurado",
      [Locale.German]: "Neue Nachrichten löschen, die einen konfigurierten Rollen erwähnen",
      [Locale.Polish]: "Usuń nowe wiadomości wspominające skonfigurowaną rolę",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable message deletion")
        .setDescriptionLocalizations({
          [Locale.French]: "Activer ou désactiver la suppression des messages",
          [Locale.SpanishES]: "Habilitar o deshabilitar la eliminación de mensajes",
          [Locale.German]: "Löschen von Nachrichten aktivieren oder deaktivieren",
          [Locale.Polish]: "Włącz lub wyłącz usuwanie wiadomości",
        })
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role_1")
        .setDescription("First role that will trigger message deletion")
        .setDescriptionLocalizations({
          [Locale.French]: "Premier rôle qui déclenchera la suppression du message",
          [Locale.SpanishES]: "Primer rol que activará la eliminación del mensaje",
          [Locale.German]: "Erste Rolle, die das Löschen der Nachricht auslöst",
          [Locale.Polish]: "Pierwsza rola, która uruchomi usunięcie wiadomości",
        })
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role_2")
        .setDescription("Second role that will trigger message deletion")
        .setDescriptionLocalizations({
          [Locale.French]: "Deuxième rôle qui déclenchera la suppression du message",
          [Locale.SpanishES]: "Segundo rol que activará la eliminación del mensaje",
          [Locale.German]: "Zweite Rolle, die das Löschen der Nachricht auslöst",
          [Locale.Polish]: "Druga rola, która uruchomi usunięcie wiadomości",
        })
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role_3")
        .setDescription("Third role that will trigger message deletion")
        .setDescriptionLocalizations({
          [Locale.French]: "Troisième rôle qui déclenchera la suppression du message",
          [Locale.SpanishES]: "Tercer rol que activará la eliminación del mensaje",
          [Locale.German]: "Dritte Rolle, die das Löschen der Nachricht auslöst",
          [Locale.Polish]: "Trzecia rola, która uruchomi usunięcie wiadomości",
        })
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role_4")
        .setDescription("Fourth role that will trigger message deletion")
        .setDescriptionLocalizations({
          [Locale.French]: "Quatrième rôle qui déclenchera la suppression du message",
          [Locale.SpanishES]: "Cuarto rol que activará la eliminación del mensaje",
          [Locale.German]: "Vierte Rolle, die das Löschen der Nachricht auslöst",
          [Locale.Polish]: "Czwarta rola, która uruchomi usunięcie wiadomości",
        })
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role_5")
        .setDescription("Fifth role that will trigger message deletion")
        .setDescriptionLocalizations({
          [Locale.French]: "Cinquième rôle qui déclenchera la suppression du message",
          [Locale.SpanishES]: "Quinto rol que activará la eliminación del mensaje",
          [Locale.German]: "Fünfte Rolle, die das Löschen der Nachricht auslöst",
          [Locale.Polish]: "Piąta rola, która uruchomi usunięcie wiadomości",
        })
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("role-category")
    .setDescription("Manage reaction role categories")
    .setDescriptionLocalizations({
      [Locale.French]: "Gérer les catégories de reaction roles",
      [Locale.SpanishES]: "Gestionar las categorías de reaction roles",
      [Locale.German]: "Reaction-Role-Kategorien verwalten",
      [Locale.Polish]: "Zarządzaj kategoriami ról reakcji",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) =>
      o
        .setName("action")
        .setDescription("Action to perform")
        .setDescriptionLocalizations({
          [Locale.French]: "Action à effectuer",
          [Locale.SpanishES]: "Acción a realizar",
          [Locale.German]: "Auszuführende Aktion",
          [Locale.Polish]: "Akcja do wykonania",
        })
        .setRequired(true)
        .addChoices(
          {
            name: "create",
            value: "create",
            name_localizations: {
              [Locale.French]: "créer",
              [Locale.SpanishES]: "crear",
              [Locale.German]: "erstellen",
              [Locale.Polish]: "utwórz",
            },
          },
          {
            name: "update",
            value: "update",
            name_localizations: {
              [Locale.French]: "modifier",
              [Locale.SpanishES]: "actualizar",
              [Locale.German]: "aktualisieren",
              [Locale.Polish]: "zaktualizuj",
            },
          },
          {
            name: "delete",
            value: "delete",
            name_localizations: {
              [Locale.French]: "supprimer",
              [Locale.SpanishES]: "eliminar",
              [Locale.German]: "löschen",
              [Locale.Polish]: "usuń",
            }
          }
        )
    )
    .addStringOption((o) =>
      o
        .setName("name")
        .setDescription("Category name")
        .setDescriptionLocalizations({
          [Locale.French]: "Nom de la catégorie",
          [Locale.SpanishES]: "Nombre de la categoría",
          [Locale.German]: "Name der Kategorie",
          [Locale.Polish]: "Nazwa kategorii",
        })
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((o) =>
      o
        .setName("new_name")
        .setDescription("New name (for update action)")
        .setDescriptionLocalizations({
          [Locale.French]: "Nouveau nom (pour action update)",
          [Locale.SpanishES]: "Nuevo nombre (para la acción de actualización)",
          [Locale.German]: "Neuer Name (für die Aktualisierungsaktion)",
          [Locale.Polish]: "Nowa nazwa (dla akcji aktualizacji)",
        })
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("role-manage")
    .setDescription("Manage roles within a reaction role category")
    .setDescriptionLocalizations({
      [Locale.French]: "Gérer les rôles d'une catégorie de reaction roles",
      [Locale.SpanishES]: "Gestionar los roles de una categoría de reaction roles",
      [Locale.German]: "Rollen einer Reaction-Role-Kategorie verwalten",
      [Locale.Polish]: "Zarządzaj rolami w kategorii ról reakcji",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) =>
      o
        .setName("action")
        .setDescription("Action à effectuer")
        .setRequired(true)
        .addChoices(
          {
            name: "add",
            value: "add",
            name_localizations: {
              [Locale.French]: "ajouter",
              [Locale.SpanishES]: "agregar",
              [Locale.German]: "hinzufügen",
              [Locale.Polish]: "dodaj",
            },
          },
          {
            name: "update",
            value: "update",
            name_localizations: {
              [Locale.French]: "modifier",
              [Locale.SpanishES]: "actualizar",
              [Locale.German]: "aktualisieren",
              [Locale.Polish]: "zaktualizuj",
            }
          },
          {
            name: "delete",
            value: "delete",
            name_localizations: {
              [Locale.French]: "supprimer",
              [Locale.SpanishES]: "eliminar",
              [Locale.German]: "löschen",
              [Locale.Polish]: "usuń",
            }
          }
        )
    )
    .addStringOption((o) =>
      o
        .setName("category")
        .setDescription("Category name")
        .setDescriptionLocalizations({
          [Locale.French]: "Nom de la catégorie",
          [Locale.SpanishES]: "Nombre de la categoría",
          [Locale.German]: "Name der Kategorie",
          [Locale.Polish]: "Nazwa kategorii",
        })
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addRoleOption((o) =>
      o
        .setName("role")
        .setDescription("Role concerned")
        .setDescriptionLocalizations({
          [Locale.French]: "Rôle concerné",
          [Locale.SpanishES]: "Rol correspondiente",
          [Locale.German]: "Betroffene Rolle",
          [Locale.Polish]: "Rola, której dotyczy",
        })
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("description")
        .setDescription("Description shown to members")
        .setDescriptionLocalizations({
          [Locale.French]: "Description affichée aux membres",
          [Locale.SpanishES]: "Descripción mostrada a los miembros",
          [Locale.German]: "Beschreibung, die den Mitgliedern angezeigt wird",
          [Locale.Polish]: "Opis wyświetlany członkom",
        })
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("emoji")
        .setDescription("Emoji associé")
        .setDescriptionLocalizations({
          [Locale.French]: "Emoji associé",
          [Locale.SpanishES]: "Emoji asociado",
          [Locale.German]: "Assoziierter Emoji",
          [Locale.Polish]: "Powiązany emoji",
        })
        .setRequired(false)
    )
    .addRoleOption((o) =>
      o
        .setName("new_role")
        .setDescription("New role (for update action)")
        .setDescriptionLocalizations({
          [Locale.French]: "Nouveau rôle (pour action update)",
          [Locale.SpanishES]: "Nuevo rol (para la acción update)",
          [Locale.German]: "Neue Rolle (für Aktion update)",
          [Locale.Polish]: "Nowa rola (dla akcji update)",
        })
        .setRequired(false)
    ),

  // /role-create
  new SlashCommandBuilder()
    .setName("role-create")
    .setDescription("Publish the reaction role panel for a category")
    .setDescriptionLocalizations({
      [Locale.French]: "Publier le panel de reaction roles d'une catégorie",
      [Locale.SpanishES]: "Publicar el panel de reaction roles de una categoría",
      [Locale.German]: "Das Reaction-Role-Panel einer Kategorie veröffentlichen",
      [Locale.Polish]: "Opublikuj panel ról reakcji dla kategorii",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) =>
      o
        .setName("category")
        .setDescription("Category name")
        .setDescriptionLocalizations({
          [Locale.French]: "Nom de la catégorie",
          [Locale.SpanishES]: "Nombre de la categoría",
          [Locale.German]: "Name der Kategorie",
          [Locale.Polish]: "Nazwa kategorii",
        })
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("Channel to publish the panel in")
        .setDescriptionLocalizations({
          [Locale.French]: "Salon où publier le panel",
          [Locale.SpanishES]: "Canal donde publicar el panel",
          [Locale.German]: "Kanal, in dem das Panel veröffentlicht werden soll",
          [Locale.Polish]: "Kanał, na którym opublikować panel",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("role-category-list")
    .setDescription("List reaction role categories and their roles")
    .setDescriptionLocalizations({
      [Locale.French]: "Lister les catégories de reaction roles et leurs rôles",
      [Locale.SpanishES]: "Listar las categorías de reaction roles y sus roles",
      [Locale.German]: "Reaction-Role-Kategorien und ihre Rollen auflisten",
      [Locale.Polish]: "Wyświetl kategorie ról reakcji i ich role",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName("set-welcome-message")
    .setDescription("Set the welcome message sent in DM to new members")
    .setDescriptionLocalizations({
      [Locale.French]: "Définir le message de bienvenue envoyé en DM aux nouveaux membres",
      [Locale.German]: "Willkommensnachricht festlegen, die neuen Mitgliedern als DM gesendet wird",
      [Locale.SpanishES]: "Establecer el mensaje de bienvenida enviado por DM a los nuevos miembros",
      [Locale.Polish]: "Ustaw wiadomość powitalną wysyłaną w DM do nowych członków",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((opt) =>
      opt
        .setName("message")
        .setDescription("The message to send. Use {{mention}} to mention the new member.")
        .setDescriptionLocalizations({
          [Locale.French]: "Le message à envoyer. Utilise {{mention}} pour mentionner le nouveau membre.",
          [Locale.German]: "Die zu sendende Nachricht. Verwende {{mention}}, um das neue Mitglied zu erwähnen.",
          [Locale.SpanishES]: "El mensaje a enviar. Usa {{mention}} para mencionar al nuevo miembro.",
          [Locale.Polish]: "Wiadomość do wysłania. Użyj {{mention}}, aby wspomnieć nowego członka.",
        })
        .setRequired(true)
        .setMaxLength(2000)
    ),

  new SlashCommandBuilder()
    .setName("delete-welcome-message")
    .setDescription("Delete the welcome message for this server")
    .setDescriptionLocalizations({
      [Locale.French]: "Supprimer le message de bienvenue du serveur",
      [Locale.German]: "Die Willkommensnachricht für diesen Server löschen",
      [Locale.SpanishES]: "Eliminar el mensaje de bienvenida de este servidor",
      [Locale.Polish]: "Usuń wiadomość powitalną z tego serwera",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder() 
    .setName("view-welcome-message")
    .setDescription("View the configured welcome message")
    .setDescriptionLocalizations({
      [Locale.French]: "Afficher le message de bienvenue configuré",
      [Locale.German]: "Die konfigurierte Willkommensnachricht anzeigen",
      [Locale.SpanishES]: "Ver el mensaje de bienvenida configurado",
      [Locale.Polish]: "Wyświetl skonfigurowaną wiadomość powitalną",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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

function normalizeSupportedLocale(locale: string | null | undefined): "fr" | "en" | "es" | "de" | "pl" {
  const value = (locale ?? "en").toLowerCase();

  if (value.startsWith("fr")) return "fr";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("de")) return "de";
  if (value.startsWith("pl")) return "pl";
  return "en";
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

//recherche dans quels serveurs le membre est présent
async function findUserGuilds(targetUserId: string): Promise<string[]> {
  const foundGuilds: string[] = [];

  for (const [guildId, guild] of client.guilds.cache) {
    try {
      const member = await guild.members.fetch(targetUserId).catch(() => null);
      if (!member) continue;
      foundGuilds.push(`${guild.name} (${guildId})`);
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

function buildDecisionButtonsRow(userId: string, msgServer: any) {
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
  /*
  if (isBasilic(interaction)) return true;

  return isAuthorizedServer(interaction) && isGuildOwner(interaction);
  */

  return isGuildOwner(interaction);
}

function isAuthorizedServer(interaction: any): boolean {

  return !getBannedGuildStmt.get(interaction.guild.id);
}

//si c'est moi
function isBasilic(interaction: any): boolean {
  /*
  const BASILIC_IDS: string[] = [
    "260716512711540736", // compte principal
    "1482664456998621325", // compte secondaire
    "165957640281784320", // sparkydapikachu
  ];
  
  return BASILIC_IDS.includes(interaction.user.id);
  */

  return false;
}

function isUsedOnAServer(
  interaction: BaseInteraction<CacheType>
): interaction is BaseInteraction<"cached"> & { guild: NonNullable<BaseInteraction<CacheType>["guild"]> } {
  return interaction.inGuild() && interaction.guild != null;
}

function isAdministrator(member: any, interaction: any): boolean {
  //return member.permissions.has(PermissionFlagsBits.Administrator) || isBasilic(interaction);
  return member.permissions.has(PermissionFlagsBits.Administrator) || isGuildOwner(interaction);
}

type FreeGameRow = {
  id: number;
  image_url: string | null;
  provider_code: string;
  title: string;
  promo_url: string;
  expires_at: string;
  promo_type: string;
};

function discordTimestamp(dateIso: string, style: "F" | "R" = "F"): string {
  const unix = Math.floor(new Date(dateIso).getTime() / 1000);
  return `<t:${unix}:${style}>`;
}

function providerLabel(providerCode: string): string {
  switch (providerCode) {
    case "STEAM":
      return "Steam";
    case "EPICGAMES":
      return "Epic Games";
    case "ITCHIO":
      return "itch.io";
    case "GOG":
      return "GOG";
    default:
      return providerCode;
  }
}

function promoTypeLabel(promoType: string): string {
  switch (promoType) {
    case "FREE_TO_KEEP":
      return "Free to keep";
    case "PLAY_FOR_FREE":
      return "Play for free";
    default:
      return promoType;
  }
}

function formatQuestionType(type: string, msgIn: any): string {
  switch (type) {
    case "text_short":
      return msgIn.choiceShortText;
    case "text_paragraph":
      return msgIn.choiceParagraph;
    case "file_image":
      return msgIn.choiceImageUpload;
    default:
      return type;
  }
}

function buildFreeGameEmbed(game: FreeGameRow): EmbedBuilder {
  const isFreeToKeep = game.promo_type === "FREE_TO_KEEP";

  const embed = new EmbedBuilder()
    .setTitle(
      isFreeToKeep
        ? `🎁 ${game.title}`
        : `🕹️ ${game.title}`
    )
    .setURL(game.promo_url)
    .setDescription(
      isFreeToKeep
        ? `Available for free until ${discordTimestamp(game.expires_at, "F")}.\nEnds ${discordTimestamp(game.expires_at, "R")}.`
        : `Playable for free until ${discordTimestamp(game.expires_at, "F")}.\nEnds ${discordTimestamp(game.expires_at, "R")}.`
    )
    .addFields(
      {
        name: "Platform",
        value: providerLabel(game.provider_code),
        inline: true
      },
      {
        name: "Promotion type",
        value: promoTypeLabel(game.promo_type),
        inline: true
      }
    )
    .setTimestamp(new Date());

  if (game.image_url && /^https?:\/\//i.test(game.image_url)) {
    embed.setImage(game.image_url);
  }

  return embed;
}

async function publishFreeGamesForGuild(guildId: string): Promise<void> {
  const settings = getFreeGamesSettingsStmt.get(guildId) as any;

  console.log(`[FREEGAMES] settings for ${guildId}:`, settings);

  if (!settings || settings.enabled !== 1) return;

  const channel = await client.channels.fetch(settings.channel_id).catch((error) => {
    console.error(`[FREEGAMES] cannot fetch channel ${settings.channel_id}:`, error);
    return null;
  });

  if (!channel || !("send" in channel)) {
    console.warn(`[FREEGAMES] invalid channel for guild ${guildId}`);
    return;
  }

  const allGames = getAllFreeGamesStmt.all() as FreeGameRow[];
  console.log(`[FREEGAMES] games in db: ${allGames.length}`);

  const publishedIds = (
    getPublishedFreeGameIdsForGuildStmt.all(guildId) as { free_game_id: number }[]
  ).map(r => r.free_game_id);

  console.log(`[FREEGAMES] already published for ${guildId}: ${publishedIds.length}`);

  const games = allGames.filter(game => {
    if (publishedIds.includes(game.id)) return false;
    if (game.provider_code === "STEAM" && !settings.include_steam) return false;
    if (game.provider_code === "EPICGAMES" && !settings.include_epicgames) return false;
    if (game.provider_code === "ITCHIO" && !settings.include_itchio) return false;
    if (game.provider_code === "GOG" && !settings.include_gog) return false;
    return true;
  });

  console.log(`[FREEGAMES] games to publish for ${guildId}: ${games.length}`);

  for (const game of games) {
    console.log(`[FREEGAMES] publishing ${game.title} to ${settings.channel_id}`);

    const sentMessage = await channel.send({
      embeds: [buildFreeGameEmbed(game)]
    });

    insertFreeGamePublicationStmt.run(
      guildId,
      game.id,
      settings.channel_id,
      sentMessage.id
    );
  }
}

async function publishFreeGamesForAllGuilds(): Promise<void> {
  const settingsRows = getEnabledFreeGamesSettingsStmt.all() as any[];

  console.log(`[FREEGAMES] enabled guilds: ${settingsRows.length}`);

  for (const settings of settingsRows) {
    console.log(`[FREEGAMES] checking guild ${settings.guild_id}`);
    await publishFreeGamesForGuild(settings.guild_id);
  }
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

async function cleanupExpiredFreeGameMessages(): Promise<void> {
  const rows = getExpiredFreeGamePublicationsStmt.all() as {
    guild_id: string;
    free_game_id: number;
    channel_id: string;
    message_id: string;
  }[];

  for (const row of rows) {
    const channel = await client.channels.fetch(row.channel_id).catch(() => null);

    if (!channel || !("messages" in channel)) continue;

    const message = await channel.messages.fetch(row.message_id).catch(() => null);

    if (message) {
      await message.delete().catch(() => null);
    }

    deleteFreeGamePublicationStmt.run(row.guild_id, row.free_game_id);
  }
}

async function cleanupOrphanFreeGameMessages(): Promise<void> {
  // Récupère tous les salons configurés (un par guild)
  const settings = getAllFreeGamesSettingsStmt.all() as { guild_id: string; channel_id: string }[];

  for (const { guild_id, channel_id } of settings) {
    const channel = await client.channels.fetch(channel_id).catch(() => null);
    if (!channel || !("messages" in channel)) continue;

    // Récupère les 100 derniers messages du salon
    const messages = await channel.messages.fetch({ limit: 100 }).catch(() => null);
    if (!messages) continue;

    for (const [messageId, message] of messages) {
      // Ignore les messages qui ne viennent pas du bot
      if (message.author.id !== client.user?.id) continue;

      // Vérifie si ce message_id est dans free_games_publications pour ce guild
      const publication = getFreeGamePublicationByMessageIdStmt.get(guild_id, messageId);
      if (!publication) {
        await message.delete().catch(() => null);
      }
    }
  }
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

  await cleanupExpiredFreeGameMessages();
  await cleanupOrphanFreeGameMessages();
  await publishFreeGamesForAllGuilds();

  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MINUTE;

  // tâche réccurrente pour publier les jeux gratuits et nettoyer les anciens messages
  setInterval(async () => {
    try {
      await cleanupExpiredFreeGameMessages();
      await cleanupOrphanFreeGameMessages();
      await publishFreeGamesForAllGuilds();
    } catch (error) {
      console.error("❌ Erreur dnas la tâche réccurrente :", error);
    }
  }, 20 * ONE_MINUTE);
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
      getBlacklistedUsersEverywhereStmt,
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
          content: interaction.message.content + "\n\n" + msgServer.spamFalsePositiveConfirmed,
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
    if (interaction.isAutocomplete()) {
      const focusedOption = interaction.options.getFocused(true);

      if (focusedOption.name === "category" || focusedOption.name === "name") {
        const guildId = interaction.guildId!;
        const categories = getReactionRoleCategoriesStmt.all(guildId) as ReactionRoleCategoryRow[];

        const filtered = categories.filter((c) =>
          c.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())
        );

        await interaction.respond(
          filtered.slice(0, 25).map((c) => ({ name: c.name, value: c.name }))
        );
      }

      return;
    }

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
        const context = await requireStaffOnConfiguredGuild(interaction, msgIn);
        if (!context) return;

        const targetUserId = interaction.options.getString("user_id", true);

        const blacklistedEverywhere = getBlacklistedUsersEverywhereStmt.all(
          targetUserId
        ) as BlacklistedUserRow[];
        const foundGuilds = await findUserGuilds(targetUserId);

        const blacklistLines = await Promise.all(
          blacklistedEverywhere.map(async (entry) => {
            const guild = await client.guilds.fetch(entry.guild_id).catch(() => null);

            const moderator = entry.blacklisted_by
              ? await client.users.fetch(entry.blacklisted_by).catch(() => null)
              : null;

            const guildDisplay = guild
              ? `${guild.name} (${entry.guild_id})`
              : `${msgIn.unknownServer} (${entry.guild_id})`;

            const moderatorDisplay = moderator
              ? `@${moderator.username}`
              : entry.blacklisted_by ?? msgIn.noReasonProvided;

            const timestamp = Math.floor(new Date(entry.blacklisted_at).getTime() / 1000);

            return [
              `• ${guildDisplay}`,
              `  <t:${timestamp}:f>`,
              `  ${msgIn.by} : ${moderatorDisplay}`,
              `  ${msgIn.reason} : ${entry.reason ?? msgIn.noReasonProvided}
              `,
            ].join("\n");
          })
        );

        const blacklistText =
          blacklistLines.length > 0
            ? blacklistLines.join("\n")
            : msgIn.none;

        const presentText =
          foundGuilds.length > 0
            ? foundGuilds.map((line) => `• ${line}`).join("\n")
            : msgIn.none;

        const content =
          msgIn.memberBlacklistedOnServers(blacklistText) +
          "\n\n" +
          msgIn.memberPresentOnServers(presentText);

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
        const context = await requireStaffOnConfiguredGuild(interaction, msgIn);
        if (!context) return;

        const targetUserId = interaction.options.getString("user_id", true);
        const reason = interaction.options.getString("reason", true);

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

      if (interaction.commandName === "verify-member") {
        const commandInteraction = interaction as ChatInputCommandInteraction;

        if (!isUsedOnAServer(commandInteraction)) {
          await commandInteraction.reply({
            content: msgIn.commandMustBeUsedInServer,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const guild = commandInteraction.guild!;
        const targetUserId = commandInteraction.options.getString("user_id", true);

        const guildSettings = getGuildVerificationSettingsStmt.get(
          guild.id
        ) as GuildVerificationSettingsRow | undefined;

        if (!guildSettings) {
          await commandInteraction.reply({
            content: msgIn.verificationNotConfigured,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const staffMember = commandInteraction.member;

        if (
          !staffMember ||
          !("roles" in staffMember) ||
          !staffMember.roles.cache.has(guildSettings.staff_role_id)
        ) {
          await commandInteraction.reply({
            content: msgIn.onlyStaffCanUseCommand,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        // 1) Supprimer de pending_verification_submissions
        deletePendingVerificationSubmissionStmt.run(guild.id, targetUserId);

        // 2) Ajouter dans verified_users seulement si absent
        const existingVerification = getVerifiedUserStmt.get(
          guild.id,
          targetUserId
        ) as VerifiedUserRow | undefined;

        const targetMember = await guild.members.fetch(targetUserId).catch(() => null);

        let username = targetUserId;

        if (targetMember) {
          username = targetMember.user.tag;
        } else {
          const user = await client.users.fetch(targetUserId).catch(() => null);
          if (user) username = user.tag;
        }

        if (!existingVerification) {
          insertVerifiedUserStmt.run(
            guild.id,
            targetUserId,
            username,
            new Date().toISOString(),
            `${commandInteraction.user.tag} (${commandInteraction.user.id})`
          );
        }

        // 3) Ajouter le rôle si le membre est présent sur le serveur
        let roleAdded = false;

        if (targetMember) {
          if (!targetMember.roles.cache.has(guildSettings.verified_role_id)) {
            await targetMember.roles.add(
              guildSettings.verified_role_id,
              msgInternal.verifiedBy(commandInteraction.user.tag)
            );
            roleAdded = true;
          }
        }

        await commandInteraction.reply({
          content: msgIn.ManualVerificationProcessed(
            targetUserId,
            !!existingVerification,
            !!targetMember,
            roleAdded
          ),
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "add-verification-question") {
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
        if (!isBasilicOrAuthorizedGuildOwner(interaction)) {
          await interaction.reply({
            content: msgIn.YouAreNotAllowedtoEditVerificationQuestionsOnThisServer,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

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

      /*
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
        */

      if (interaction.commandName === "help") {
        const section = interaction.options.getString("section", true);

        const sectionMap: Record<string, string> = {
          "about": msgIn.helpAbout,
          "verification": msgIn.helpVerification,
          "spam": msgIn.helpSpam,
          "reaction-roles": msgIn.helpReactionRoles,
          "free-games": msgIn.helpFreeGames,
          "permissions": msgIn.helpPermissions,
        };

        const content = sectionMap[section];
        if (!content) {
          await replyEphemeral(interaction, msgIn.errorOccurred);
          return;
        }

        const chunks = splitMessage(content);
        await replyEphemeral(interaction, chunks[0]);

        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({ content: chunks[i], flags: MessageFlags.Ephemeral });
        }

        return;
      }

      if (interaction.commandName === "unblacklist-member") {
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
            ? `✅ Spam detection enabled.\nAlert channel: <#${alertChannelId}>${staffRoleId ? `\nStaff role: <@&${staffRoleId}>` : ""
            }`
            : "✅ Spam detection disabled.",
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "view-settings") {
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
        const SettingsMsgDeletedFromRoles = getGuildRoleMessageDeleteSettingsStmt.get(interaction.guild!.id) as GuildRoleMessageDeleteSettingsRow | undefined;

        const verifiedRoleDisplay = verifiedRole
          ? `<@&${settings.verified_role_id}>`
          : msgIn.RoleIntrouvable(settings.verified_role_id);

        const staffRoleDisplay = staffRole
          ? `<@&${settings.staff_role_id}>`
          : msgIn.RoleIntrouvable(settings.staff_role_id);

        const freeGamesSettings =
          getFreeGamesSettingsStmt.get(
            interaction.guild.id
          ) as any | undefined;

        const freeGamesChannel =
          freeGamesSettings?.channel_id
            ? `<#${freeGamesSettings.channel_id}>`
            : "—";

        const questions =
          getGuildVerificationQuestionsStmt.all(
            interaction.guild.id
          ) as GuildVerificationQuestionRow[];

        const questionsText =
          questions.length === 0
            ? msgIn.noVerificationQuestions
            : `## ${msgIn.verificationQuestionsTitle}\n\n` +
            questions
              .map(
                (q, index) =>
                  `**${index + 1}.** ${q.question_label}
      ${msgIn.typeLabel}: \`${formatQuestionType(q.question_type, msgIn)}\` | ${msgIn.requiredLabel}: \`${q.required === 1 ? msgIn.yes : msgIn.no}\``
              )
              .join("\n\n");

        let roleMsgDeleteText = "";

        if (SettingsMsgDeletedFromRoles) {
          const enabled = SettingsMsgDeletedFromRoles.enabled === 1;

          const roleIds = [
            SettingsMsgDeletedFromRoles.role_id1,
            SettingsMsgDeletedFromRoles.role_id2,
            SettingsMsgDeletedFromRoles.role_id3,
            SettingsMsgDeletedFromRoles.role_id4,
            SettingsMsgDeletedFromRoles.role_id5,
          ].filter((id): id is string => id !== null);

          const roleDisplays = roleIds.map((id) => {
            // @everyone a le même ID que le guild
            if (id === interaction.guild!.id) return "`@everyone`";
            const role = interaction.guild!.roles.cache.get(id);

            return role ? `<@&${id}>` : msgIn.RoleIntrouvable(id);
          });

          const rolesLine =
            roleDisplays.length > 0
              ? roleDisplays.join(", ")
              : msgIn.AucunRole;

          roleMsgDeleteText = msgIn.AffichageParametrageSuppressionMessageRolesUtilises(enabled, rolesLine);
        }

        await interaction.reply({
          content: msgIn.ViewSettings(questionsText,
            verifiedRoleDisplay,
            staffRoleDisplay,
            settings.verification_timeout_hours,
            freeGamesSettings?.enabled === 1,
            freeGamesChannel,
            freeGamesSettings?.include_steam === 1,
            freeGamesSettings?.include_epicgames === 1,
            roleMsgDeleteText),
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "set-welcome-message") {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const message = interaction.options.getString("message", true);

        if (!isAdministrator(member, interaction)) {
          await interaction.reply({
            content: msgIn.onlyStaffCanUseCommand,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        upsertGuildWelcomeMessageStmt.run(interaction.guildId, message, new Date().toISOString());
        return interaction.reply({
          content: msgIn.welcomeMessageSaved,
          flags: MessageFlags.Ephemeral,
        });
      }

      if (interaction.commandName === "delete-welcome-message") {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!isAdministrator(member, interaction)) {
          await interaction.reply({
            content: msgIn.onlyStaffCanUseCommand,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        deleteGuildWelcomeMessageStmt.run(interaction.guild.id);

        await interaction.reply({
          content: msgIn.welcomeMessageDeleted,
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "test-welcome-message") {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!isAdministrator(member, interaction)) {
          await interaction.reply({
            content: msgIn.onlyStaffCanUseCommand,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const welcomeRow = getGuildWelcomeMessageStmt.get(interaction.guild.id) as GuildWelcomeMessageRow | undefined;
        if (!welcomeRow) {
          return interaction.reply({ content: msgIn.welcomeMessageNoneConfigured, flags: MessageFlags.Ephemeral });
        }
        const preview = welcomeRow.dm_message.replace("{{mention}}", `<@${interaction.user.id}>`);
        return interaction.reply({
          content: preview,
          flags: MessageFlags.Ephemeral
        });
      }

      if (interaction.commandName === "list-members-by-role-count") {
        const commandInteraction = interaction as ChatInputCommandInteraction;

        if (!isUsedOnAServer(commandInteraction)) {
          await commandInteraction.reply({
            content: msgIn.commandMustBeUsedInServer,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const roleCount = commandInteraction.options.getInteger(
          "number",
          true
        );

        await commandInteraction.deferReply({
          flags: MessageFlags.Ephemeral,
        });

        await interaction.guild!.members.fetch();

        const matchingMembers = interaction.guild!.members.cache.filter(
          (member) => !member.user.bot &&
            member.roles.cache.size - 1 === roleCount
        );

        if (matchingMembers.size === 0) {
          await commandInteraction.editReply(
            msgIn.NoMembersFoundWithRoleCount(roleCount)
          );
          return;
        }

        const locale = interaction.locale ?? "fr";

        const lines = matchingMembers.map((member) => {
          const joinedDate = member.joinedAt
            ? member.joinedAt.toLocaleString(locale)
            : "??????";

          return `- ${member.user.tag} (${member.id}) — ${joinedDate}`;
        });

        const chunks = splitMessage(
          `${msgIn.MembersWithRoleCountTitle(roleCount)}\n\n${lines.join("\n")}`
        );

        await commandInteraction.editReply(chunks[0]);

        for (let i = 1; i < chunks.length; i++) {
          await commandInteraction.followUp({
            content: chunks[i],
            flags: MessageFlags.Ephemeral,
          });
        }

        return;
      }

      if (interaction.commandName === "freegames-publish") {
        if (!isUsedOnAServer(interaction)) {
          await replyEphemeral(interaction, msgIn.commandMustBeUsedInServer);
          return;
        }

        const channel = interaction.options.getChannel("channel");
        const fromSteam = interaction.options.getBoolean("from_steam") ?? true;
        const fromEpicGames = interaction.options.getBoolean("from_epic_games") ?? true;

        if (!channel) {
          upsertFreeGamesSettingsStmt.run(
            interaction.guild.id,
            "",    // channel_id vide
            0,     // enabled = false
            fromSteam ? 1 : 0,
            fromEpicGames ? 1 : 0,
            0,     // itchio
            0      // gog
          );
          await replyEphemeral(interaction, msgIn.freeGamesManualPublishSettingsDeleted);
          return;
        }

        upsertFreeGamesSettingsStmt.run(
          interaction.guild.id,
          channel.id,
          1,     // enabled = true
          fromSteam ? 1 : 0,
          fromEpicGames ? 1 : 0,
          0,     // itchio
          0      // gog
        );

        await replyEphemeral(interaction, msgIn.freeGamesManualPublishSettingsSaved);

        try {
          await publishFreeGamesForAllGuilds();
        } catch (error) {
          console.error("❌ Erreur dnas la commande freegames-publish :", error);
        }

        return;
      }

      if (interaction.commandName === "donation") {

        const v_paypal = "https://www.paypal.com/paypalme/Basilic64";
        const v_kofi = "https://ko-fi.com/basilic64";

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("PayPal")
            .setStyle(ButtonStyle.Link)
            .setURL(v_paypal),

          new ButtonBuilder()
            .setLabel("Ko-fi")
            .setStyle(ButtonStyle.Link)
            .setURL(v_kofi)
        );

        await interaction.reply({
          content: "**Support the bot**\n\nThank you for supporting the project ❤️",
          components: [row],
          flags: MessageFlags.Ephemeral,
        });

        return;
      }

      if (interaction.commandName === "role-used-msg-delete") {
        const member = await interaction.guild!.members.fetch(interaction.user.id);

        if (!isAdministrator(member, interaction)) {
          await replyEphemeral(interaction, msgIn.onlyStaffCanUseCommand);
          return;
        }

        const enabled = interaction.options.getBoolean("enabled", true);

        const roles = [
          interaction.options.getRole("role_1"),
          interaction.options.getRole("role_2"),
          interaction.options.getRole("role_3"),
          interaction.options.getRole("role_4"),
          interaction.options.getRole("role_5"),
        ].filter((role): role is NonNullable<typeof role> => role !== null);

        if (enabled && roles.length === 0) {
          await replyEphemeral(
            interaction,
            msgIn.FournirAuMoinsUnRole
          );
          return;
        }

        const roleIds = roles.map((role) => role.id);

        upsertGuildRoleMessageDeleteSettingsStmt.run(
          interaction.guild!.id,
          enabled ? 1 : 0,
          roleIds[0] ?? null,
          roleIds[1] ?? null,
          roleIds[2] ?? null,
          roleIds[3] ?? null,
          roleIds[4] ?? null,
          interaction.user.id,
          new Date().toISOString()
        );

        const rolesDisplay =
          roleIds.length > 0
            ? roleIds.map((roleId) => `<@&${roleId}>`).join(", ")
            : msgIn.AucunRole;

        await replyEphemeral(
          interaction,
          enabled
            ? msgIn.SuppressionAutomatiqueMessageMentionRoleActivee(rolesDisplay)
            : msgIn.SuppressionAutomatiqueMessageMentionRoleDesctivee
        );

        return;
      }

      if (interaction.commandName === "role-category") {
        const action = interaction.options.getString("action", true);
        const name = interaction.options.getString("name", true);
        const guildId = interaction.guildId!;

        if (action === "create") {
          const existing = getReactionRoleCategoryStmt.get(guildId, name);
          if (existing) {
            await interaction.reply({ content: msgIn.reactionRoleCategoryAlreadyExists(name), ephemeral: true });
            return;
          }
          insertReactionRoleCategoryStmt.run(guildId, name);
          await interaction.reply({ content: msgIn.reactionRoleCategoryCreated(name), ephemeral: true });

        } else if (action === "update") {
          const newName = interaction.options.getString("new_name");
          if (!newName) {
            await interaction.reply({ content: msgIn.reactionRoleNewNameRequired, ephemeral: true });
            return;
          }
          const result = updateReactionRoleCategoryStmt.run(newName, guildId, name);
          if (result.changes === 0) {
            await interaction.reply({ content: msgIn.reactionRoleCategoryNotFound(name), ephemeral: true });
            return;
          }
          await interaction.reply({ content: msgIn.reactionRoleCategoryRenamed(name, newName), ephemeral: true });

        } else if (action === "delete") {
          const category = getReactionRoleCategoryStmt.get(guildId, name) as ReactionRoleCategoryRow | undefined;
          if (!category) {
            await interaction.reply({ content: `Catégorie **${name}** introuvable.`, ephemeral: true });
            return;
          }

          // Supprimer le message de panel si existant
          const panel = getReactionRolePanelByCategoryStmt.get(category.id) as ReactionRolePanelRow | undefined;
          if (panel) {
            try {
              const channel = await interaction.guild!.channels.fetch(panel.channel_id) as TextChannel | null;
              const message = channel ? await channel.messages.fetch(panel.message_id) : null;
              if (message) await message.delete();
            } catch { /* message déjà supprimé */ }
          }

          // Supprime la catégorie (CASCADE supprime entries + panel en DB)
          deleteReactionRoleCategoryStmt.run(guildId, name);
          await interaction.reply({ content: msgIn.reactionRoleCategoryDeleted(name), ephemeral: true });
        }
      }

      if (interaction.commandName === "role-manage") {
        const action = interaction.options.getString("action", true);
        const categoryName = interaction.options.getString("category", true);
        const role = interaction.options.getRole("role", true);
        const guildId = interaction.guildId!;

        const category = getReactionRoleCategoryStmt.get(guildId, categoryName) as ReactionRoleCategoryRow | undefined;
        if (!category) {
          await interaction.reply({ content: msgIn.reactionRoleCategoryNotFound(categoryName), ephemeral: true });
          return;
        }

        if (action === "add") {
          const description = interaction.options.getString("description");
          const emoji = interaction.options.getString("emoji");
          if (!description || !emoji) {
            await interaction.reply({ content: msgIn.reactionRoleDescriptionAndEmojiRequired, ephemeral: true });
            return;
          }
          // Guard doublon
          const existing = getReactionRoleEntriesStmt.all(category.id) as ReactionRoleEntryRow[];
          if (existing.some(e => e.role_id === role.id)) {
            await interaction.reply({ content: msgIn.reactionRoleAlreadyInCategory(role.name, categoryName), ephemeral: true });
            return;
          }

          insertReactionRoleEntryStmt.run(category.id, role.id, description, emoji);

          // Mettre à jour le panel existant si publié
          const panel = getReactionRolePanelByCategoryStmt.get(category.id) as ReactionRolePanelRow | undefined;
          if (panel) {
            const entries = getReactionRoleEntriesStmt.all(category.id) as ReactionRoleEntryRow[];
            const channel = await interaction.guild!.channels.fetch(panel.channel_id) as TextChannel | null;
            if (channel) await publishOrUpdatePanel(interaction.guild!, category, entries, channel, msgServer);
          }

          await interaction.reply({ content: msgIn.reactionRoleAdded(role.name, categoryName, emoji), ephemeral: true });

        } else if (action === "update") {
          const description = interaction.options.getString("description");
          const emoji = interaction.options.getString("emoji");
          const newRole = interaction.options.getRole("new_role");
          updateReactionRoleEntryStmt.run(description ?? null, emoji ?? null, newRole?.id ?? null, category.id, role.id);

          // Mettre à jour le panel si publié
          const panel = getReactionRolePanelByCategoryStmt.get(category.id) as ReactionRolePanelRow | undefined;
          if (panel) {
            const entries = getReactionRoleEntriesStmt.all(category.id) as ReactionRoleEntryRow[];
            const channel = await interaction.guild!.channels.fetch(panel.channel_id) as TextChannel | null;
            if (channel) await publishOrUpdatePanel(interaction.guild!, category, entries, channel, msgServer);
          }

          await interaction.reply({ content: msgIn.reactionRoleUpdated(role.name, categoryName), ephemeral: true });

        } else if (action === "delete") {
          deleteReactionRoleEntryStmt.run(category.id, role.id);

          // Mettre à jour le panel si publié
          const panel = getReactionRolePanelByCategoryStmt.get(category.id) as ReactionRolePanelRow | undefined;
          if (panel) {
            const entries = getReactionRoleEntriesStmt.all(category.id) as ReactionRoleEntryRow[];
            const channel = await interaction.guild!.channels.fetch(panel.channel_id) as TextChannel | null;
            if (channel) {
              if (entries.length === 0) {
                // Panel vide → supprimer le message directement
                try {
                  const msg = await channel.messages.fetch(panel.message_id);
                  await msg.delete();
                } catch { }
                deleteReactionRolePanelStmt.run(category.id); // à importer depuis sql.ts
              } else {
                await publishOrUpdatePanel(interaction.guild!, category, entries, channel, msgServer);
              }
            }
          }

          await interaction.reply({ content: msgIn.reactionRoleRemoved(role.name, categoryName), ephemeral: true });
        }
      }

      if (interaction.commandName === "role-create") {
        const categoryName = interaction.options.getString("category", true);
        const channel = interaction.options.getChannel("channel", true) as TextChannel;
        const guildId = interaction.guildId!;

        const category = getReactionRoleCategoryStmt.get(guildId, categoryName) as ReactionRoleCategoryRow | undefined;
        if (!category) {
          await interaction.reply({ content: msgIn.reactionRoleCategoryNotFound(categoryName), ephemeral: true });
          return;
        }

        const entries = getReactionRoleEntriesStmt.all(category.id) as ReactionRoleEntryRow[];
        await interaction.deferReply({ ephemeral: true });

        await publishOrUpdatePanel(interaction.guild!, category, entries, channel, msgServer);
        await interaction.editReply({ content: msgIn.reactionRolePanelPublished(categoryName, channel.id) });
      }

      if (interaction.commandName === "role-category-list") {
        const guildId = interaction.guildId!;
        const categories = getReactionRoleCategoriesStmt.all(guildId) as ReactionRoleCategoryRow[];

        if (categories.length === 0) {
          await interaction.reply({ content: "Aucune catégorie configurée sur ce serveur.", ephemeral: true });
          return;
        }

        const embed = new EmbedBuilder().setTitle("Catégories de reaction roles");

        for (const category of categories) {
          const entries = getReactionRoleEntriesStmt.all(category.id) as ReactionRoleEntryRow[];
          const panel = getReactionRolePanelByCategoryStmt.get(category.id) as ReactionRolePanelRow | undefined;

          const rolesText = entries.length > 0
            ? entries.map((e) => `${e.emoji} <@&${e.role_id}> — ${e.description}`).join("\n")
            : "*Aucun rôle*";

          const panelText = panel
            ? `\n📌 Panel publié dans <#${panel.channel_id}>`
            : "\n*(panel non publié)*";

          embed.addFields({
            name: `📂 ${category.name}`,
            value: rolesText + panelText,
          });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    // =========================================
    // 3) SOUMISSION DU MODAL
    // =========================================  
    if (interaction.isModalSubmit()) {
      if (!isUsedOnAServer(interaction)) {
        await replyEphemeral(interaction, msgIn.commandMustBeUsedInServer);
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
              PermissionFlagsBits.MentionEveryone,
            ],
          },
          {
            id: client.user!.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.MentionEveryone,
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

      // On retire la mention du contenu principal
      await (verificationChannel as TextChannel).send({
        content,
        components: [buildDecisionButtonsRow(member.id, msgServer)],
      });

      // La mention est envoyée dans un message séparé → déclenche la notification
      await (verificationChannel as TextChannel).send({
        content: msgServer.verificationWaiting(guildSettings.staff_role_id),
        allowedMentions: { roles: [guildSettings.staff_role_id] },
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
    //est-ce que le serveur est blacklisté? 
    const guildBanned = getBannedGuildStmt.get(member.guild.id);

    //si blacklisté, on ne fait rien
    if (guildBanned) return;

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
      } catch { }

      if (member.kickable) {
        await member.kick(msgInternal.kickReasonAuto);
      }

      return; // ⚠️ STOP ici
    }

    // =========================
    // 2️⃣ WELCOME DM
    // =========================
    const welcomeRow = getGuildWelcomeMessageStmt.get(member.guild.id) as GuildWelcomeMessageRow | undefined;
    if (welcomeRow) {
      const msg = welcomeRow.dm_message.replace("{{mention}}", `<@${member.id}>`);
      try {
        await member.send(msg);
      } catch {
        // DMs fermés
      }
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

    // Ne pas enregistrer les bots dans le timeout de vérification
    if (member.user.bot) return;

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

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild || message.author.bot) return;

  // Le propriétaire du serveur est exempté
  if (message.author.id === message.guild.ownerId) return;

  const settings = getGuildRoleMessageDeleteSettingsStmt.get(
    message.guild.id
  ) as {
    enabled: number;
    role_id1: string | null;
    role_id2: string | null;
    role_id3: string | null;
    role_id4: string | null;
    role_id5: string | null;
  } | undefined;

  if (!settings || settings.enabled !== 1) return;

  const roleIds = [
    settings.role_id1,
    settings.role_id2,
    settings.role_id3,
    settings.role_id4,
    settings.role_id5,
  ].filter(Boolean) as string[];

  if (roleIds.length === 0) return;

  const mentionsTarget = roleIds.some((roleId) => {
    const isEveryoneOrHere =
      roleId === message.guild!.id ||
      roleId === "everyone";

    return isEveryoneOrHere
      ? message.mentions.everyone
      : message.mentions.roles.has(roleId);
  });

  console.log("[role-block] mentions.everyone:", message.mentions.everyone);
  console.log("[role-block] mentions.roles:", [...message.mentions.roles.keys()]);
  console.log("[role-block] roles surveillés:", roleIds);
  console.log("[role-block] mentionsTarget:", mentionsTarget);

  if (!mentionsTarget) return;

  if (!message.deletable) {
    console.log(
      "[role-block] Message non supprimable — vérifie la permission Gérer les messages."
    );
    return;
  }

  try {
    await message.delete();
    console.log("[role-block] Message supprimé :", message.id);
  } catch (error) {
    console.error("[role-block] Erreur suppression :", error);
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (!reaction.message.guildId) return;

  const panel = getReactionRolePanelByMessageIdStmt.get(reaction.message.id) as ReactionRolePanelRow | undefined;
  if (!panel) return;

  const emoji = reaction.emoji.id
    ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` // emoji custom
    : reaction.emoji.name!;                             // emoji unicode

  const guild = reaction.message.guild!;
  const member = await guild.members.fetch(user.id);
  await handleReactionAdd(panel, emoji, member);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (!reaction.message.guildId) return;

  const panel = getReactionRolePanelByMessageIdStmt.get(reaction.message.id) as ReactionRolePanelRow | undefined;
  if (!panel) return;

  const emoji = reaction.emoji.id
    ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    : reaction.emoji.name!;

  const guild = reaction.message.guild!;
  const member = await guild.members.fetch(user.id);
  await handleReactionRemove(panel, emoji, member);
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