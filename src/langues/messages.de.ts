import type { MessagesIn, MessagesOut, MessagesServer, MessagesInternal } from "./messages.types.js";

const de_in: MessagesIn = {
  helpMessage: `
# 🤖 Bot-Einrichtungsanleitung

Dieser Bot bietet **Mitgliederverifizierung**, **Spam-Erkennung**, **Mitgliederanalyse** und **Benachrichtigungen über kostenlose Spiele** für deinen Discord-Server.

---

## 🔐 Mitgliederverifizierung

### Verifizierung aktivieren

Verwende:

\`/setup-verification\`

um die Verifizierung neuer Mitglieder einzurichten.

Du kannst festlegen:

- die verifizierte Rolle
- die Moderationsrolle
- die Moderationskategorie
- das Verifizierungszeitlimit

### Verifizierungsfragen verwalten

Nach der Aktivierung kannst du die Fragen anpassen:

- \`/add-verification-question\` → Frage hinzufügen
- \`/edit-verification-question\` → Frage bearbeiten
- \`/delete-verification-question\` → Frage löschen

Alle konfigurierten Fragen können mit folgendem Befehl angezeigt werden:

\`/view-settings\`

### So funktioniert die Verifizierung

1. Der Bot veröffentlicht einen Verifizierungsbutton.
2. Ein neues Mitglied beantwortet die Fragen.
3. Ein Moderationskanal wird automatisch erstellt.
4. Das Moderationsteam kann:
   - die Verifizierungsanfrage genehmigen
   - die Verifizierungsanfrage ablehnen
   - das Mitglied auf die Blacklist setzen
   - einen privaten Gesprächskanal mit dem Mitglied eröffnen, um zusätzliche Informationen anzufordern

5. Bei Genehmigung wird die verifizierte Rolle automatisch vergeben.

---

## 🛡️ Spam-Erkennung

Der Bot kann verdächtige Aktivitäten überwachen.

Verwende:

\`/setup-spam-detection\`

um Folgendes zu konfigurieren:

- Aktivierung der Erkennung
- Alarmkanal
- Moderationsrollen-Erwähnung
- Erkennungsschwellenwerte

Bei verdächtigem Verhalten werden automatisch Warnungen gesendet.

---

## 👤 Manuelle Mitgliederverifizierung

Ein Mitglied kann manuell verifiziert werden, unabhängig davon, ob es sich bereits auf dem Server befindet.

Verwende:

\`/verify-member\`

mit der Discord-ID des Mitglieds.

Der Bot:

- weist sofort die verifizierte Rolle zu
- verifiziert Mitglieder automatisch bei späterem Beitritt

---

## 🔎 Mitgliederanalyse

Verwende:

\`/check-member\`

um ein Discord-Konto zu analysieren.

Mit diesem Befehl kannst du:

* sehen, auf welchen Servern das Mitglied vorhanden ist (nur Server, auf denen der Bot installiert ist)
* feststellen, ob das Mitglied auf einer Blacklist steht
* die auf jedem Server gespeicherten Blacklist-Gründe anzeigen
* Moderatoren dabei unterstützen, problematische Benutzer über mehrere Communities hinweg zu identifizieren

---

# 🎭 Reaction Roles — Benutzerhandbuch

## 📂 Schritt 1 — Eine Kategorie erstellen

Bevor du Rollen hinzufügst, musst du eine Kategorie erstellen, die sie gruppiert.

\`\`\`
/role-category action:create name:tier
\`\`\`

Eine Kategorie stellt eine thematische Gruppe von Rollen dar (z.B. Tiere, Sprachen, Interessen...).

## ➕ Schritt 2 — Rollen zur Kategorie hinzufügen

Für jede Rolle, die du den Mitgliedern anbieten möchtest, verwende:

\`\`\`
/role-manage action:add categorie:tier role:@fuchs description:Fuchs emoji:🦊
/role-manage action:add categorie:tier role:@hund description:Hund emoji:🐕
/role-manage action:add categorie:tier role:@katze description:Katze emoji:🐈
\`\`\`

> **Hinweis:** Benutzerdefinierte Server-Emojis werden ebenfalls unterstützt. Kopiere ihre ID aus Discord im Format \`<:emojiname:123456789>\`.

## 📢 Schritt 3 — Das Panel veröffentlichen

Sobald deine Rollen konfiguriert sind, veröffentliche das Panel im gewünschten Kanal:

\`\`\`
/role-create categorie:tier channel:#rollen
\`\`\`

Der Bot wird dann:

1. Eine Embed-Nachricht im angegebenen Kanal erstellen
2. Die konfigurierten Rollen mit ihren Emojis und Beschreibungen auflisten
3. Die entsprechenden Reaktionen automatisch unter der Nachricht hinzufügen

Das Ergebnis sieht so aus:

> **Rollen — tier**
> 🦊 — Fuchs
> 🐕 — Hund
> 🐈 — Katze

Die Mitglieder klicken einfach auf eine Reaktion, um die zugehörige Rolle zu erhalten, und klicken erneut, um sie zu entfernen.

## ✏️ Eine bestehende Rolle bearbeiten

Um die Beschreibung oder das Emoji einer bereits konfigurierten Rolle zu ändern:

\`\`\`
/role-manage action:update categorie:tier role:@fuchs description:Polarfuchs emoji:🦊
\`\`\`

Um eine Rolle durch eine andere zu ersetzen:

\`\`\`
/role-manage action:update categorie:tier role:@alterole new_role:@neurole
\`\`\`

Das veröffentlichte Panel wird automatisch aktualisiert.

## 🗑️ Eine Rolle aus dem Panel entfernen

\`\`\`
/role-manage action:delete categorie:tier role:@hund
\`\`\`

Das Panel wird automatisch aktualisiert. War es die letzte Rolle der Kategorie, wird die Nachricht gelöscht.

## 📋 Eine Kategorie umbenennen

\`\`\`
/role-category action:update name:tier new_name:tiere
\`\`\`

## ❌ Eine Kategorie löschen

\`\`\`
/role-category action:delete name:tier
\`\`\`

Dies löscht die Kategorie, alle ihre konfigurierten Rollen und die veröffentlichte Panel-Nachricht.

## 🔍 Bestehende Kategorien anzeigen

\`\`\`
/role-category-list
\`\`\`

Zeigt alle Serverkategorien, die darin enthaltenen Rollen und ob ihr Panel veröffentlicht ist.

---

## 🎮 Kostenlose Spiele

Der Bot kann automatisch kostenlose Spielaktionen veröffentlichen von:

- Steam
- Epic Games

Die Konfiguration erlaubt:

- Aktivierung oder Deaktivierung
- Auswahl des Veröffentlichungskanals
- Aktivierung oder Deaktivierung von Plattformen

Spiele werden automatisch:

- veröffentlicht
- nach Ablaufdatum sortiert
- entfernt, wenn Aktionen enden

---

## ⚙️ Übersicht der Servereinstellungen

Verwende:

\`/view-settings\`

um die vollständige Bot-Konfiguration für den Server anzuzeigen, einschließlich:

- Verifizierungseinstellungen
- Verifizierungsfragen
- Einstellungen für kostenlose Spiele

Dieser Befehl bietet eine zentrale Übersicht über alle serverspezifischen Einstellungen, die vom Bot verwaltet werden.

---

\`/role-used-msg-delete\` — Löscht automatisch jede neue Nachricht, die eine der konfigurierten Rollen erwähnt. Nur der Serverinhaber ist ausgenommen. Nützlich, um den Missbrauch von Massenerwähnungen wie @everyone zu verhindern.

---

## 🔒 Berechtigungen

Die meisten Konfigurationsbefehle benötigen **Administratorrechte**.
`,

  helpAbout: `
# 🤖 Über den Bot

Dieser Bot bietet Funktionen zur **Mitgliederverifizierung**, **Spam-Erkennung**, **Mitgliederanalyse** und **Benachrichtigungen über kostenlose Spiele** für deinen Discord-Server.

---

## ⚙️ Übersicht der Servereinstellungen

Verwende:

\`/view-settings\`

um die vollständige Konfiguration des Bots auf dem Server anzuzeigen, einschließlich:

* der Verifizierungseinstellungen
* der Verifizierungsfragen
* der Einstellungen für kostenlose Spiele

Dieser Befehl bietet eine zentrale Übersicht über alle serverspezifischen Einstellungen.

---

\`/role-used-msg-delete\` — Löscht automatisch jede neue Nachricht, die eine der konfigurierten Rollen erwähnt. Der Serverbesitzer ist von dieser Regel ausgenommen. Dies ist nützlich, um Missbrauch durch Massen-Erwähnungen wie @everyone zu verhindern.
`,

  helpVerification: `
## 🔐 Mitgliederverifizierung

### Verifizierung aktivieren

Verwende:

\`/setup-verification\`

um die Verifizierung neuer Mitglieder einzurichten.

Du kannst Folgendes festlegen:

* die verifizierte Rolle, die nach der Genehmigung vergeben wird
* die Moderationsrolle
* die Moderationskategorie
* die maximale Verifizierungsdauer

### Verifizierungsfragen verwalten

Nach der Aktivierung der Verifizierung kannst du die Fragen anpassen, die neuen Mitgliedern angezeigt werden:

* \`/add-verification-question\` → eine Frage hinzufügen
* \`/edit-verification-question\` → eine bestehende Frage bearbeiten
* \`/delete-verification-question\` → eine Frage löschen

Alle konfigurierten Fragen können mit folgendem Befehl angezeigt werden:

\`/view-settings\`

### So funktioniert die Verifizierung

1. Der Bot veröffentlicht einen Verifizierungsbutton im konfigurierten Kanal.
2. Ein neues Mitglied klickt auf den Button und beantwortet die konfigurierten Fragen.
3. Ein Verifizierungskanal für das Moderationsteam wird automatisch erstellt.
4. Das Moderationsteam kann:
   * die Verifizierungsanfrage genehmigen
   * die Verifizierungsanfrage ablehnen
   * das Mitglied auf die Blacklist setzen
   * einen privaten Gesprächskanal mit dem Mitglied eröffnen, um zusätzliche Informationen zu erhalten
5. Wird die Anfrage genehmigt, wird die verifizierte Rolle automatisch vergeben.

---

## 👤 Manuelle Mitgliederverifizierung

Du kannst ein Mitglied manuell verifizieren, unabhängig davon, ob es sich bereits auf dem Server befindet oder nicht.

Verwende:

\`/verify-member\`

mit der Discord-ID des Mitglieds.

Der Bot:

* weist die verifizierte Rolle sofort zu, wenn das Mitglied bereits auf dem Server ist
* verifiziert das Mitglied automatisch, wenn es später dem Server beitritt

---

## 🔎 Mitgliederanalyse

Verwende:

\`/check-member\`

um ein Discord-Konto zu analysieren.

Dieser Befehl ermöglicht es:

* zu sehen, auf welchen Servern das Mitglied vorhanden ist (nur Server, auf denen der Bot installiert ist)
* festzustellen, ob das Mitglied auf einer Blacklist steht
* die auf jedem Server gespeicherten Blacklist-Gründe einzusehen
* Moderatoren dabei zu helfen, potenziell problematische Nutzer in mehreren Communities zu identifizieren
`,

  helpSpam: `
## 🛡️ Spam-Erkennung

Der Bot kann verdächtige Aktivitäten überwachen.

Verwende:

\`/setup-spam-detection\`

um Folgendes zu konfigurieren:

* die Aktivierung oder Deaktivierung der Erkennung
* den Alarmkanal
* die Erwähnung der Moderationsrolle
* die Erkennungsschwellenwerte

Wenn verdächtige Aktivitäten erkannt werden, werden automatisch Warnmeldungen an das Moderationsteam gesendet.
`,

  helpFreeGames: `
## 🎮 Benachrichtigungen über kostenlose Spiele

Der Bot kann automatisch Angebote für kostenlose Spiele veröffentlichen von:

* Steam
* Epic Games

Mit den entsprechenden Befehlen kannst du:

* Benachrichtigungen aktivieren oder deaktivieren
* einen Veröffentlichungskanal auswählen
* Plattformen aktivieren oder deaktivieren

Die Spiele werden automatisch:

* im konfigurierten Kanal veröffentlicht
* nach dem Ende des Angebots sortiert
* entfernt, sobald das Angebot abläuft
`,

  helpPermissions: `
## 🔒 Berechtigungen

Die meisten Konfigurationsbefehle erfordern **Administrator**-Berechtigungen.
`,

  helpReactionRoles: `
# 🎭 Reaction Roles — Benutzerhandbuch

Reaction Roles ermöglichen es deinen Mitgliedern, sich selbst Rollen zuzuweisen oder zu entfernen, indem sie auf eine Emoji-Reaktion unter einer Nachricht klicken.

---

## 📂 Schritt 1 — Eine Kategorie erstellen

Bevor Rollen hinzugefügt werden können, muss eine Kategorie erstellt werden, die diese zusammenfasst.

\`\`\`
/role-category action:create name:animal
\`\`\`

Eine Kategorie stellt eine thematische Gruppe von Rollen dar (z. B. Tiere, Sprachen oder Interessen).

---

## ➕ Schritt 2 — Rollen zur Kategorie hinzufügen

Verwende für jede Rolle, die du den Mitgliedern anbieten möchtest:

\`\`\`
/role-manage action:add category:animal role:@fuchs description:Fuchs emoji:🦊
/role-manage action:add category:animal role:@hund description:Hund emoji:🐕
/role-manage action:add category:animal role:@katze description:Katze emoji:🐈
\`\`\`

> **Hinweis:** Benutzerdefinierte Server-Emojis werden ebenfalls unterstützt. Kopiere ihre Kennung aus Discord im Format \`<:emojiname:123456789>\`.

---

## 📢 Schritt 3 — Das Panel veröffentlichen

Sobald die Rollen konfiguriert sind, veröffentliche das Panel im gewünschten Kanal:

\`\`\`
/role-create category:animal channel:#rollen
\`\`\`

Der Bot wird dann:

1. Eine Embed-Nachricht im angegebenen Kanal erstellen
2. Die konfigurierten Rollen mit ihren Emojis und Beschreibungen auflisten
3. Die entsprechenden Reaktionen automatisch unter der Nachricht hinzufügen

Das Ergebnis sieht etwa so aus:

> **Rollen — animal**
> 🦊 — Fuchs
> 🐕 — Hund
> 🐈 — Katze

Die Mitglieder müssen lediglich auf eine Reaktion klicken, um die entsprechende Rolle zu erhalten, und erneut darauf klicken, um sie zu entfernen.

---

## ✏️ Eine bestehende Rolle bearbeiten

Um die Beschreibung oder das Emoji einer bereits konfigurierten Rolle zu ändern:

\`\`\`
/role-manage action:update category:animal role:@fuchs description:Polarfuchs emoji:🦊
\`\`\`

Um eine Rolle durch eine andere zu ersetzen:

\`\`\`
/role-manage action:update category:animal role:@alterolle new_role:@neuerolle
\`\`\`

Das veröffentlichte Panel wird automatisch aktualisiert.

---

## 🗑️ Eine Rolle aus dem Panel entfernen

\`\`\`
/role-manage action:delete category:animal role:@hund
\`\`\`

Das Panel wird automatisch aktualisiert. Falls es die letzte Rolle der Kategorie war, wird die Nachricht gelöscht.

---

## 📋 Eine Kategorie umbenennen

\`\`\`
/role-category action:update name:animal new_name:tiere
\`\`\`

---

## ❌ Eine Kategorie löschen

\`\`\`
/role-category action:delete name:animal
\`\`\`

Dadurch werden die Kategorie, alle konfigurierten Rollen und die veröffentlichte Panel-Nachricht gelöscht.

---

## 🔍 Vorhandene Kategorien anzeigen

\`\`\`
/role-category-list
\`\`\`

Zeigt alle Kategorien des Servers, die darin enthaltenen Rollen und ob ihr Panel veröffentlicht wurde.
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
  alreadyBeenVerifiedBefore: "Du wurdest bereits zuvor verifiziert. Die Rolle @verified wurde automatisch wiederhergestellt.",
  userUnknownToTheBot: (targetUserId: string) => `Der Benutzer ${targetUserId} ist dem Bot unbekannt.`,
  NoAuthorizedServerFoundInSetupVerificationPermissions: "Keine autorisierten Server wurden in setup_verification_permissions gefunden.",
  CommandReservedByBasilic: "Dieser Befehl kann nur von \@basilicayakashifr verwendet werden.",
  YouCannotConfigureMoreThanFiveQuestions: "Du kannst nicht mehr als 5 Verifizierungsfragen konfigurieren, da Discord-Modals auf 5 Komponenten begrenzt sind.",
  QuestionAddedAtIndex: (index: number) => `Frage am Index ${index} hinzugefügt.`,
  YouAreNotAllowedToViewVerificationQuestionsOnThisServer: "Du bist nicht berechtigt, die Verifizierungsfragen auf diesem Server anzusehen.",
  YouAreNotAllowedtoEditVerificationQuestionsOnThisServer: "Du bist nicht berechtigt, die Verifizierungsfragen auf diesem Server zu bearbeiten",
  VerifiedUserFound: (user_id: string, username: string, verified_at: string, verified_by: string) => `
        **Verifizierter Benutzer gefunden**

        **Benutzer-ID:** ${user_id}
        **Benutzername:** ${username}
        **Verifiziert am:** ${verified_at}
        **Verifiziert von:** ${verified_by}
        `,
  globalKickHeader: (userId: string) => `**Globale Kick-Ergebnisse für** \`${userId}\``,
  permissionAdded: (guildId: string) => `Berechtigung hinzugefügt.\n\n**Server-ID:** ${guildId}`,
  verificationQuestionsTitle: "**Verifizierungsfragen für diesen Server**",
  typeLabel: "Typ",
  requiredLabel: "Erforderlich",
  yes: "ja",
  no: "nein",
  setupVerificationDescription: "Die Verifizierung für diesen Server konfigurieren",
  checkVerifiedDescription: "Verifizierungsstatus, Blacklist-Status und gemeinsame Server eines Benutzers prüfen",
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
  questionIndexDescription: "Frageindex, der von /view-settings angezeigt wird",
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
  spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Spam-Erkennung aktiviert.\nAlarmkanal: <#${channelId}>${staffRoleId ? `\nStaff-Rolle: <@&${staffRoleId}>` : ""
    }`,
  spamDetectionDisabled: "✅ Spam-Erkennung deaktiviert.",
  memberPresentOnServers: (servers: string) => `📡 Mitglied ist auf folgenden Servern vorhanden:\n${servers}`,
  memberBlacklistedOnServers: (servers: string) => `⚠️ Mitglied ist auf folgenden Servern auf der Blacklist:\n${servers}`,
  blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) wurde auf die Blacklist gesetzt, konnte aber nicht vom Server gekickt werden.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) wurde auf die schwarze Liste gesetzt und vom Server entfernt.`,
  spamInfoNombre: "Anzahl der Nachrichten, ab der eine Warnung ausgelöst wird",
  spamInfoDuree: "Dauer des Erkennungszeitfensters in Sekunden",
  DelaiDescriptionCommande: "Zeitlimit in Stunden zum Einreichen der Verifizierungsantworten",
  ViewSettings: (
    questionsText: string,
    verifiedRoleDisplay: string,
    staffRoleDisplay: string,
    verificationTimeoutHours: number,
    freeGamesEnabled: boolean,
    freeGamesChannel: string,
    includeSteam: boolean,
    includeEpicGames: boolean,
    roleMsgDeleteText: string
  ) => `**Aktuelle Bot-Konfiguration**

## Verifizierung

1) Verifizierte Rolle: ${verifiedRoleDisplay}
2) Moderationsrolle: ${staffRoleDisplay}
3) Verifizierungszeitlimit: ${verificationTimeoutHours} Stunde(n)

${questionsText}

${roleMsgDeleteText}

## Kostenlose Spiele

1) Aktiviert: ${freeGamesEnabled ? "ja" : "nein"}
2) Veröffentlichungskanal: ${freeGamesChannel}
3) Steam: ${includeSteam ? "ja" : "nein"}
4) Epic Games: ${includeEpicGames ? "ja" : "nein"}`,
  NotAuthorizedServer: "Der Server wurde nicht autorisiert, es ist nicht möglich, irgendeinen Befehl zu verwenden",
  ManualVerificationProcessed: (
    targetUserId: string,
    existingVerification: boolean,
    targetMember: boolean,
    roleAdded: boolean
  ) =>
    `✅ Manuelle Verifizierung verarbeitet für \`${targetUserId}\`.\n` +
    `- Ausstehende Verifizierung entfernt: abgeschlossen\n` +
    `- verified_users-Eintrag: ${existingVerification ? "bereits vorhanden" : "hinzugefügt"
    }\n` +
    `- Verifizierte Rolle: ${targetMember
      ? roleAdded
        ? "hinzugefügt"
        : "bereits vorhanden"
      : "nicht hinzugefügt, Mitglied nicht auf dem Server"
    }`,

  NoMembersFoundWithRoleCount: (count: number) => `Keine Mitglieder mit genau ${count} Rolle(n) gefunden.`,
  MembersWithRoleCountTitle: (count: number) => `**Mitglieder mit genau ${count} Rolle(n)**`,
  freeGamesManualPublishSettingsDeleted: "Veröffentlichungseinstellungen gelöscht",
  freeGamesManualPublishSettingsSaved: "Veröffentlichungseinstellungen gespeichert",
  none: "Keine",
  SuppressionAutomatiqueMessageMentionRoleActivee: (rolesDisplay: string) => `✅ Löschung für Nachrichten aktiviert, die folgende Rollen erwähnen: ${rolesDisplay}`,
  SuppressionAutomatiqueMessageMentionRoleDesctivee: `✅ Löschung deaktiviert`,
  FournirAuMoinsUnRole: "Sie müssen mindestens eine Rolle angeben, um sie zu erwähnen und die automatische Löschung zu aktivieren.",
  AucunRole: "Keine Rolle",
  RoleIntrouvable: (roleDisplay: string) => `Rolle nicht gefunden (\`${roleDisplay}\`)`,
  AffichageParametrageSuppressionMessageRolesUtilises: (enabled: boolean, rolesDisplay: string) => `## 🚫 Löschen von Nachrichten nach Rolle
      
      **Aktiviert   :** ${enabled ? "ja" : "nein"}
      **Überwachte Rollen :** ${rolesDisplay}
      `,
  unknownServer: "Unbekannter Server",
  by: "Von",
  reason: "Grund",
  verificationAlreadyInProgress: "⏳ Deine Verifizierung wird bereits vom Staff bearbeitet.",
  allowManageQuestionsDescription: "Einem Benutzer erlauben, die Verifizierungsfragen für einen bestimmten Server zu verwalten",
  choiceLongText: "Langer Text",
  verificationTimeoutHoursDescription: "Zeitlimit in Stunden für die Einreichung der Verifizierungsantworten",
  spamDetectionDisabledOptionDescription: "Spam-Erkennung deaktivieren",
  spamAlertRoleDescription: "Staff-Rolle, die in Spam-Warnungen erwähnt werden soll",
  questionAdded: "Frage hinzugefügt.",
  questionDeleted: "Frage gelöscht.",
  questionUpdated: "Frage aktualisiert.",
  noQuestionsToDelete: "Keine Fragen zum Löschen vorhanden.",
  noQuestionsToEdit: "Keine Fragen zum Bearbeiten vorhanden.",
  invalidQuestionIndex: "Ungültiger Frageindex.",
  verificationSettingsNotConfigured: "Die Verifizierungseinstellungen sind nicht konfiguriert.",
  blacklistReasonRequired: "Ein Grund für die Blacklist ist erforderlich.",
  memberNotFound: "Mitglied nicht gefunden.",
  memberAlreadyBlacklisted: "Dieses Mitglied steht bereits auf der Blacklist.",
  memberBlacklistRemoved: "Mitglied von der Blacklist entfernt.",
  memberNotBlacklisted: "Dieses Mitglied steht nicht auf der Blacklist.",
  spamDetectionSaved: "Spam-Erkennungseinstellungen gespeichert.",
  reactionRoleCategoryAlreadyExists: (name: string) => `Die Kategorie **${name}** existiert bereits.`,
  reactionRoleCategoryCreated: (name: string) => `Kategorie **${name}** erstellt.`,
  reactionRoleCategoryNotFound: (name: string) => `Kategorie **${name}** nicht gefunden.`,
  reactionRoleNewNameRequired: "Der Parameter `new_name` ist für update erforderlich.",
  reactionRoleCategoryRenamed: (oldName: string, newName: string) => `Kategorie umbenannt **${oldName}** → **${newName}**.`,
  reactionRoleCategoryDeleted: (name: string) => `Kategorie **${name}** und alle ihre Rollen wurden gelöscht.`,
  reactionRoleDescriptionAndEmojiRequired: "`description` und `emoji` sind für add erforderlich.",
  reactionRoleAlreadyInCategory: (role: string, category: string) => `Die Rolle ${role} ist bereits in der Kategorie **${category}**. Verwende \`action:update\`, um sie zu ändern.`,
  reactionRoleAdded: (role: string, category: string, emoji: string) => `Rolle ${role} wurde zu **${category}** mit dem Emoji ${emoji} hinzugefügt.`,
  reactionRoleUpdated: (role: string, category: string) => `Rolle ${role} wurde in **${category}** aktualisiert.`,
  reactionRoleRemoved: (role: string, category: string) => `Rolle ${role} wurde aus **${category}** entfernt.`,
  reactionRolePanelPublished: (category: string, channel: string) => `Panel **${category}** wurde in ${channel} veröffentlicht.`,
  reactionRoleNoCategoryConfigured: "Auf diesem Server ist keine Kategorie konfiguriert.",
  reactionRoleCategoriesTitle: "Reaction-Role-Kategorien",
  reactionRoleNoRole: "*Keine Rolle*",
  reactionRolePanelPublishedIn: (channelId: string) => `\n📌 Panel veröffentlicht in <#${channelId}>`,
  reactionRolePanelNotPublished: "*(Panel nicht veröffentlicht)*",
  welcomeMessageSaved: "✅ Willkommensnachricht gespeichert.",
  welcomeMessageDeleted: "✅ Willkommensnachricht gelöscht.",
  welcomeMessageNoneConfigured: "❌ Keine Willkommensnachricht für diesen Server konfiguriert.",  
  welcomeMessageNotFound: "❌ Nachricht nicht gefunden. Überprüft, ob die Nachrichten-ID korrekt ist und der Bot Zugang zum Raum hat",
};

const de_out: MessagesOut = {
  YourVerifiedStatusRestored: (guild_name: string) => `Hallo, dein verifizierter Status auf **${guild_name}** wurde automatisch wiederhergestellt.`,
  YourVerifiedStatusAccepted: (guild_name: string) => `Hallo, deine Verifizierung auf **${guild_name}** wurde akzeptiert. Die Rolle @verified wurde dir zugewiesen.`,
  YourVerifiedStatusDenied: (guild_name: string) => `Hallo, deine Verifizierungsanfrage auf **${guild_name}** wurde abgelehnt.`,
  YourVerifiedStatusDeniedAndBlackedListed: (guild_name: string) => `Hallo, deine Verifizierungsanfrage auf **${guild_name}** wurde abgelehnt und dein Konto wurde auf die Blacklist gesetzt.`,
  MsgBlacklisted: (guild_name: string) => `Hallo, du bist auf der Blacklist und kannst **${guild_name}** nicht beitreten.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Deine Verifizierungsanfrage für ${guildName} wurde abgelehnt und du wurdest auf die Blacklist gesetzt.\nGrund: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Deine Verifizierungsanfrage für ${guildName} wurde abgelehnt.\nGrund: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Du wurdest von **${guildName}** entfernt, da du die Verifizierung nicht rechtzeitig abgeschlossen hast.`,
};

const de_server: MessagesServer = {
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
  verificationDeniedBy: (staffId: string, targetId: string) => `❌ Verifizierung von <@${staffId}> für <@${targetId}> abgelehnt.`,
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
  checkMemberBlacklistedOn: (lines: string) => `⛔ Benutzer auf folgenden Servern gesperrt:\n\n${lines}`,
  by: "Von",
  reason: "Grund",
  reactionRolePanelTitle: (category: string) => `Rollen — ${category}`,
  reactionRolePanelEmpty: "Für diese Kategorie wurden keine Rollen konfiguriert.",
};

const de_internal: MessagesInternal = {
  kickReasonBlacklistedStart: "Gesperrter Benutzer hat versucht, die Verifizierung zu starten",
  kickReasonAuto: "Gesperrter Benutzer beim Beitritt automatisch gekickt",
  kickReasonDenied: "Verifizierung vom Team abgelehnt",
  kickReasonBlacklisted: "Während der Verifizierung auf die Blacklist gesetzt",
  memberAlreadyVerifiedPreviously: "Mitglied wurde bereits zuvor verifiziert",
  blacklistedDuringVerification: "Während der Verifizierung auf die Blacklist gesetzt",
  verifiedBy: (staffTag: string) => `Verifiziert von ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) => `Globaler Kick angefordert von ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Während der Verifizierung auf die Blacklist gesetzt: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Verifizierung abgelehnt: ${reason}`,
  verificationTimeoutKickReason: "Zeitlimit für die Verifizierung überschritten",
  verificationChannelClosed: "Verifizierungsentscheidung abgeschlossen",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Auf die Blacklist gesetzt von ${moderatorTag}${reason ? ` | Grund: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam bestätigt von ${moderatorTag}`,
};

export default { de_in, de_out, de_server, de_internal };