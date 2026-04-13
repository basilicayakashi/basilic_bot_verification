const de_in = {
  helpMessage: `
**Bot-Einrichtungsanleitung**

**Erste Schritte**
1. Bitte zuerst **basilic** um die Erlaubnis, den Bot auf deinem Server zu nutzen.
2. Gib dabei die **Server-ID** an, auf dem der Bot verwendet wird.
3. Nach der Freigabe kann der **Serverbesitzer** den Befehl \`/setup-verification\` verwenden, um die Verifizierung neuer Mitglieder zu aktivieren.

**Verifizierung konfigurieren**
Nach der Aktivierung mit \`/setup-verification\` kann der Serverbesitzer die Fragen anpassen:

- \`/add-verification-question\` → Frage hinzufügen
- \`/edit-verification-question\` → Frage bearbeiten
- \`/delete-verification-question\` → Frage löschen
- \`/list-verification-questions\` → alle Fragen anzeigen

**Ablauf für neue Mitglieder**
1. Der Bot sendet einen Verifizierungs-Button im gewählten Kanal.
2. Ein neues Mitglied klickt darauf und beantwortet die Fragen.
3. Der Bot erstellt einen Verifizierungs-Channel für das Team.
4. Das Team kann den Nutzer annehmen, ablehnen oder blacklisten.
5. Bei Annahme wird die entsprechende Rolle automatisch vergeben.

**Spam-Erkennung**
Der Bot kann auch verdächtige Aktivitäten erkennen mit:

- \`/setup-spam-detection\` → aktiviert und konfiguriert die Spam-Erkennung

Diese Funktion benachrichtigt das Team, wenn ein Nutzer viele Nachrichten in kurzer Zeit sendet.
`,

    commandMustBeUsedInServer: "Dieser Befehl muss innerhalb eines Servers verwendet werden.",
    actionMustBeUsedInServer: "Diese Aktion muss innerhalb eines Servers verwendet werden.",
    commandMustBeUsedInTextChannel: "Dieser Befehl muss in einem Textkanal verwendet werden",
    onlyStaffCanUseCommand: "Nur Staff-Mitglieder können diesen Befehl verwenden.",
    onlyStaffCanUseButtons: "Nur Staff-Mitglieder können diese Buttons verwenden.",
    verificationNotConfigured: "Die Verifizierung ist für diesen Server nicht konfiguriert.",
    verificationSettingsSaved: "Die Verifizierungseinstellungen wurden für diesen Server gespeichert.",
    verificationSettingsSavedAndPanelPosted:
      "Die Verifizierungseinstellungen wurden gespeichert und das Panel wurde erfolgreich veröffentlicht.",
    verificationRequestSent:
      "Deine Verifizierungsanfrage wurde an das Staff-Team gesendet.",
    configuredStaffCategoryNotFound:
      "Die konfigurierte Staff-Kategorie wurde nicht gefunden.",
    configuredPanelChannelInvalid:
      "Der aktuelle Kanal ist kein gültiger Textkanal für das Verifizierungspanel.",
    notAllowedConfigureVerification:
      "Du bist nicht berechtigt, die Verifizierung auf diesem Server zu konfigurieren.",
    notAllowedManageQuestions:
      "Du bist nicht berechtigt, die Verifizierungsfragen auf diesem Server zu verwalten.",
    noVerificationQuestions:
      "Für diesen Server sind keine Verifizierungsfragen konfiguriert.",
    tooManyVerificationQuestions:
      "Für diesen Server sind zu viele Verifizierungsfragen konfiguriert. Discord-Modals unterstützen maximal 5 Komponenten.",
    blacklistedCannotAccess:
      "Du stehst auf der Blacklist und kannst auf diesen Server nicht zugreifen.",
    alreadyVerifiedRoleRestored:
      "Du wurdest bereits früher verifiziert. Die Verifiziert-Rolle wurde automatisch wiederhergestellt.",
    targetMemberNoLongerInServer:
      "Das betroffene Mitglied ist nicht mehr auf dem Server.",
    imageRequired: "Ein Bild ist erforderlich.",
    errorOccurred: "Es ist ein Fehler aufgetreten.",
    noQuestionFound: (index: number) => `Keine Frage mit dem Index ${index} gefunden.`,
    questionUpdatedSuccessfully: (index: number) => `Frage ${index} wurde erfolgreich aktualisiert.`,
    questionDeletedSuccessfully: (index: number) => `Frage ${index} wurde erfolgreich gelöscht.`,
    alreadyBeenVerifiedBefore : "Du wurdest bereits zuvor verifiziert. Die Rolle @verified wurde automatisch wiederhergestellt.",
    userUnknownToTheBot : (targetUserId: string) => `Der Benutzer ${targetUserId} ist dem Bot unbekannt.`,
    NoAuthorizedServerFoundInSetupVerificationPermissions : "Keine autorisierten Server wurden in setup_verification_permissions gefunden.",
    CommandReservedByBasilic : "Dieser Befehl kann nur von \@basilicayakashifr verwendet werden.",
    YouCannotConfigureMoreThanFiveQuestions : "Du kannst nicht mehr als 5 Verifizierungsfragen konfigurieren, da Discord-Modals auf 5 Komponenten begrenzt sind.",
    QuestionAddedAtIndex : (index: number) => `Frage am Index ${index} hinzugefügt.`,
    YouAreNotAllowedToViewVerificationQuestionsOnThisServer : "Du bist nicht berechtigt, die Verifizierungsfragen auf diesem Server anzusehen.",
    YouAreNotAllowedtoEditVerificationQuestionsOnThisServer : "Du bist nicht berechtigt, die Verifizierungsfragen auf diesem Server zu bearbeiten",
    VerifiedUserFound: (user_id:string, username : string, verified_at : string, verified_by : string) => `
        **Verifizierter Benutzer gefunden**

        **Benutzer-ID:** ${user_id}
        **Benutzername:** ${username}
        **Verifiziert am:** ${verified_at}
        **Verifiziert von:** ${verified_by}
        `,
    globalKickHeader: (userId: string) =>`**Globale Kick-Ergebnisse für** \`${userId}\``,
    permissionAdded: (guildId: string) => `Berechtigung hinzugefügt.\n\n**Server-ID:** ${guildId}`,
    verificationQuestionsTitle: "**Verifizierungsfragen für diesen Server**",
    typeLabel: "Typ",
    requiredLabel: "Erforderlich",
    yes: "ja",
    no: "nein",
	  setupVerificationDescription: "Die Verifizierung für diesen Server konfigurieren",
    checkVerifiedDescription: "Prüfen, ob ein Benutzer in der Tabelle verified_users gespeichert ist",
    globalKickDescription: "Einen Benutzer von allen für den Bot autorisierten Servern kicken",
    allowSetupVerificationDescription: "Einem Benutzer erlauben, die Verifizierung für einen bestimmten Server zu konfigurieren",
    addVerificationQuestionDescription: "Eine Verifizierungsfrage für diesen Server hinzufügen",
    listVerificationQuestionsDescription: "Die Verifizierungsfragen für diesen Server auflisten",
    editVerificationQuestionDescription: "Eine Verifizierungsfrage anhand ihres Index bearbeiten",
    deleteVerificationQuestionDescription: "Eine Verifizierungsfrage anhand ihres Index löschen",
    botHelpDescription: "Bot-Einrichtungsanleitung und nützliche Befehle anzeigen",
	  verifiedRoleIdDescription: "Rolle, die nach der Genehmigung vergeben wird",
    staffCategoryIdDescription: "Kategorie-ID, in der die Staff-Kanäle erstellt werden",
    staffRoleIdDescription: "Staff-Rolle, die benachrichtigt werden soll",
    userIdLookupDescription: "Die Benutzer-ID, nach der gesucht werden soll",
    userIdKickDescription: "Die Discord-Benutzer-ID, die gekickt werden soll",
    guildIdDescription: "Discord-Server-ID, auf dem der Befehl erlaubt ist",
    questionLabelDescription: "Fragetext, der dem Benutzer angezeigt wird",
    questionTypeDescription: "Fragetyp",
    questionRequiredDescription: "Gibt an, ob die Frage erforderlich ist",
    questionIndexDescription: "Frageindex, der von /list-verification-questions angezeigt wird",
    newQuestionLabelDescription: "Neuer Fragetext",
    newQuestionTypeDescription: "Neuer Fragetyp",
    newQuestionRequiredDescription: "Gibt an, ob die Frage erforderlich ist",
	  choiceShortText: "Kurzer Text",
    choiceParagraph: "Absatz",
    choiceImageUpload: "Bild hochladen",
    guildNotFound: (guildId: string) => `❌ ${guildId} — Server nicht gefunden oder Bot nicht vorhanden`,
    userNotPresent: (name: string, id: string) => `ℹ️ ${name} (${id}) — Benutzer nicht vorhanden`,
    userNotKickable: (name: string, id: string) => `❌ ${name} (${id}) — Benutzer kann nicht gekickt werden`,
    userKicked: (name: string, id: string) => `✅ ${name} (${id}) — gekickt`,
    unexpectedError: (guildId: string) => `❌ ${guildId} — unerwarteter Fehler`,
	
    BlacklistedUserFound: (
      userId: string,
      username: string,
      blacklistedAt: string,
      blacklistedBy: string,
      reason: string
    ) => `⚠️ Benutzer auf der Blacklist gefunden

	Benutzer-ID: ${userId}
	Benutzername: ${username}
	Auf die Blacklist gesetzt am: ${blacklistedAt}
	Hinzugefügt von: ${blacklistedBy}
	Grund: ${reason}`,

	noReasonProvided: "Kein Grund angegeben",
	
  blacklistReasonDescription: "Einen Grund hinzufügen (optional)",
  blacklistMemberDescription: "Einen Benutzer auf diesem Server auf die schwarze Liste setzen",
	unblacklistMemberDescription: "Einen Benutzer von der Blacklist entfernen und entbannen",
	userNotBlacklisted: (userId: string) => `ℹ️ ${userId} — Benutzer ist nicht auf der Blacklist`,
	userRemovedFromBlacklist: (userId: string) => `✅ ${userId} — von der Blacklist entfernt und entbannt`,
	blacklistReasonSaved: "Grund für die Blacklist erfolgreich gespeichert",
	refusalReasonSaved: "Grund erfolgreich gespeichert",
	setupSpamDetectionDescription: "Spam-Warnungserkennung für diesen Server konfigurieren",
	spamDetectionEnabledOptionDescription: "Spam-Erkennung aktivieren oder deaktivieren",
	spamAlertChannelDescription: "Kanal, in den Moderationswarnungen gesendet werden",
	spamStaffRoleDescription: "Staff-Rolle, die in Spam-Warnungen erwähnt werden soll",
	spamAlertChannelRequired: "Beim Aktivieren der Spam-Erkennung musst du einen Alarmkanal angeben.",
	spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Spam-Erkennung aktiviert.\nAlarmkanal: <#${channelId}>${
	staffRoleId ? `\nStaff-Rolle: <@&${staffRoleId}>` : ""
	}`,
	spamDetectionDisabled: "✅ Spam-Erkennung deaktiviert.",
	memberPresentOnServers: (servers: string) => `📡 Mitglied ist auf folgenden Servern vorhanden:\n${servers}`,
	memberBlacklistedOnServers: (servers: string) => `⚠️ Mitglied ist auf folgenden Servern auf der Blacklist:\n${servers}`,
	blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) wurde auf die Blacklist gesetzt, konnte aber nicht vom Server gekickt werden.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) wurde auf die schwarze Liste gesetzt und vom Server entfernt.`,
  spamInfoNombre : "Anzahl der Nachrichten, ab der eine Warnung ausgelöst wird",
  spamInfoDuree : "Dauer des Erkennungszeitfensters in Sekunden",
  DelaiDescriptionCommande : "Zeitlimit in Stunden zum Einreichen der Verifizierungsantworten",
  ViewVeriicationsetup: (verifiedRoleDisplay : string, staffRoleDisplay : string, verification_timeout_hours : number) =>  `**Aktuelle Verifizierungskonfiguration**

1) Rolle zur Verifizierung von Mitgliedern : ${verifiedRoleDisplay}
2) Rolle zur Benachrichtigung des Moderationsteams : ${staffRoleDisplay}
3) Maximale Zeit, um die Verifizierung zu starten : ${verification_timeout_hours} Stunde(n)`,
};

const de_out = {
  YourVerifiedStatusRestored: (guild_name : string) => `Hallo, dein verifizierter Status auf **${guild_name}** wurde automatisch wiederhergestellt.`,
  YourVerifiedStatusAccepted : (guild_name : string) => `Hallo, deine Verifizierung auf **${guild_name}** wurde akzeptiert. Die Rolle @verified wurde dir zugewiesen.`,
  YourVerifiedStatusDenied : (guild_name : string) => `Hallo, deine Verifizierungsanfrage auf **${guild_name}** wurde abgelehnt.`,
  YourVerifiedStatusDeniedAndBlackedListed : (guild_name : string) => `Hallo, deine Verifizierungsanfrage auf **${guild_name}** wurde abgelehnt und dein Konto wurde auf die Blacklist gesetzt.`,
  MsgBlacklisted : (guild_name : string) => `Hallo, du bist auf der Blacklist und kannst **${guild_name}** nicht beitreten.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Deine Verifizierungsanfrage für ${guildName} wurde abgelehnt und du wurdest auf die Blacklist gesetzt.\nGrund: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Deine Verifizierungsanfrage für ${guildName} wurde abgelehnt.\nGrund: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Du wurdest von **${guildName}** entfernt, da du die Verifizierung nicht rechtzeitig abgeschlossen hast.`,
};

const de_server = {
  startVerificationButton: "Verifizierung starten",
  startVerificationMessage: "Klicke auf den Button unten, um deine Verifizierung zu starten.",

  approveButton: "Genehmigen",
  rejectButton: "Ablehnen",
  blacklistButton: "Blacklist setzen",

  approvedDoneButton: "Genehmigt",
  rejectedDoneButton: "Abgelehnt",
  blacklistedDoneButton: "Auf Blacklist",

  verificationModalTitle: "Verifizierung",
  answerPlaceholder: "Gib hier deine Antwort ein",
  uploadOneImage: "Ein Bild hochladen",
  noFileProvided: "Keine Datei angegeben",

  newVerificationRequest: "Neue Verifizierungsanfrage.",
  memberLabel: "Mitglied",
  tagLabel: "Tag",
  accountCreatedOnLabel: "Konto erstellt am",
  accountAgeLabel: "Kontodauer",

  verificationWaiting: (staffRoleId: string) => `<@&${staffRoleId}> eine Verifizierungsanfrage wartet auf Bearbeitung.`,
  verificationAcceptedBy: (staffId: string, targetId: string) => `✅ Verifizierung von <@${staffId}> für <@${targetId}> akzeptiert.`,
  verificationDeniedBy: (staffId: string, targetId: string) =>`❌ Verifizierung von <@${staffId}> für <@${targetId}> abgelehnt.`,
  userBlacklistedBy: (staffId: string, targetId: string) => `⛔ Benutzer <@${targetId}> wurde von <@${staffId}> auf die Blacklist gesetzt.`,
  
  lessThanOneDay: "weniger als 1 Tag",
  oneDay: "1 Tag",
  days: (n: number) => `${n} Tage`,
  oneMonth: "1 Monat",
  months: (n: number) => `${n} Monate`,
  oneYear: "1 Jahr",
  years: (n: number) => `${n} Jahre`,
  
	rejectModalTitle: "Verifizierungsanfrage ablehnen",
	rejectReasonLabel: "Grund der Ablehnung",
	rejectReasonPlaceholder: "Optional: Warum wird die Anfrage abgelehnt?",
	reasonLabel: "Grund",
	noReasonProvided: "Kein Grund angegeben",
	
  blacklistModalTitle: "Mitglied auf die Blacklist setzen",
  blacklistReasonLabel: "Grund für die Blacklist",
  blacklistReasonPlaceholder: "Erkläre, warum dieses Mitglied auf die Blacklist gesetzt wird",
  spamDuplicateText: "Wiederholte Nachrichten erkannt",
  spamChannelsTouched: "Betroffene Kanäle",
  spamAlertTitle: "⚠️ Spam-Verdacht",
  spamNoContent: "(kein Text, wahrscheinlich Anhang)",
  spamFalsePositive: "Kein Spam",
  spamBan: "Bannen",
  spamDuplicateFile: (n: number) => `Gleiche Datei/Bild ${n}-mal gepostet`,
  spamHighVolume: (n: number) => `Hohe Aktivität: ${n} Nachrichten im Zeitraum`,
  spamUserLabel: "Benutzer",
  spamScoreLabel: "Score",
  spamOccurrencesLabel: "Vorkommnisse",
  spamChannelsLabel: "Betroffene Kanäle",
  spamReasonsLabel: "Hinweise",
  spamSampleLabel: "Beispiel",
  spamLinksLabel: "Nachrichtenlinks",
  spamUnknown: "unbekannt",
  spamModerationFallback: "Moderation",
  spamAlertMessage: "verdächtige Aktivität erkannt, manuelle Überprüfung empfohlen.",
  discussMemberButton: "Mit dem Mitglied sprechen",
  discussionChannelIntro: (targetId: string) => `Dieser private Kanal ermöglicht es dem Team, mit <@${targetId}> über seine Verifizierungsanfrage zu sprechen.`,
  discussionChannelAlreadyExists: (channelId: string) => `Ein Diskussionskanal existiert bereits: <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Diskussionskanal erstellt: <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Zeitlimit für die Verifizierung überschritten",
  verificationTimeoutDM: (guildName: string) => `Du wurdest von **${guildName}** entfernt, da du die Verifizierung nicht rechtzeitig abgeschlossen hast.`,
  verificationTimeoutDisabled: "Kein Verifizierungszeitlimit festgelegt",
  verificationTimeoutSet: (hours: number) => `Verifizierungszeitlimit auf ${hours} Stunde(n) gesetzt.`,
  spamFalsePositiveConfirmed: "✅ Fehlalarm bestätigt.",
  spamUserBanned: "🔨 Benutzer gebannt.",
};

const de_internal = {
  kickReasonBlacklistedStart : "Gesperrter Benutzer hat versucht, die Verifizierung zu starten",
  kickReasonAuto: "Gesperrter Benutzer beim Beitritt automatisch gekickt",
  kickReasonDenied: "Verifizierung vom Team abgelehnt",
  kickReasonBlacklisted: "Während der Verifizierung auf die Blacklist gesetzt",
  memberAlreadyVerifiedPreviously:"Mitglied wurde bereits zuvor verifiziert",
  blacklistedDuringVerification:"Während der Verifizierung auf die Blacklist gesetzt",
  verifiedBy: (staffTag: string) =>`Verifiziert von ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) =>`Globaler Kick angefordert von ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Während der Verifizierung auf die Blacklist gesetzt: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Verifizierung abgelehnt: ${reason}`,
  verificationTimeoutKickReason: "Zeitlimit für die Verifizierung überschritten",
  verificationChannelClosed: "Verifizierungsentscheidung abgeschlossen",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Auf die Blacklist gesetzt von ${moderatorTag}${reason ? ` | Grund: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam bestätigt von ${moderatorTag}`,
};

export default {de_in, de_out, de_server, de_internal};