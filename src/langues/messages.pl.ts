const pl_in = {
  helpMessage: `
# 🤖 Przewodnik konfiguracji bota

Bot zapewnia funkcje **weryfikacji użytkowników**, **wykrywania spamu**, **analizy użytkowników** oraz **powiadomień o darmowych grach** dla serwera Discord.

---

## 🔐 Weryfikacja członków

### Włączanie weryfikacji

Użyj:

\`/setup-verification\`

aby skonfigurować weryfikację nowych członków.

Możesz określić:

- rolę zweryfikowanego użytkownika
- rolę moderacji
- kategorię moderacji
- limit czasu weryfikacji

### Zarządzanie pytaniami

Po aktywacji możesz dostosować pytania:

- \`/add-verification-question\` → dodaj pytanie
- \`/edit-verification-question\` → edytuj pytanie
- \`/delete-verification-question\` → usuń pytanie

Wszystkie skonfigurowane pytania można wyświetlić za pomocą:

\`/view-settings\`

### Jak działa weryfikacja

1. Bot publikuje przycisk weryfikacji.
2. Nowy użytkownik odpowiada na pytania.
3. Tworzony jest kanał moderacyjny.
4. Moderacja może:
   - zaakceptować zgłoszenie weryfikacyjne
   - odrzucić zgłoszenie weryfikacyjne
   - dodać użytkownika do czarnej listy
   - otworzyć prywatny kanał rozmowy z użytkownikiem w celu uzyskania dodatkowych informacji

5. Po akceptacji użytkownik otrzymuje odpowiednią rolę.

---

## 🛡️ Wykrywanie spamu

Bot może wykrywać podejrzaną aktywność.

Użyj:

\`/setup-spam-detection\`

aby skonfigurować:

- aktywację wykrywania
- kanał alertów
- oznaczanie roli moderacji
- progi wykrywania

W przypadku wykrycia podejrzanej aktywności moderatorzy otrzymają alert.

---

## 👤 Ręczna weryfikacja użytkownika

Możesz ręcznie zweryfikować użytkownika, niezależnie od tego, czy jest już na serwerze.

Użyj:

\`/verify-member\`

z identyfikatorem Discord użytkownika.

Bot:

- natychmiast przyzna rolę, jeśli użytkownik jest obecny
- automatycznie zweryfikuje go po dołączeniu później

---

## 🔎 Analiza użytkownika

Użyj:

\`/check-member\`

aby przeanalizować konto Discord.

Ta komenda pozwala:

* sprawdzić, na których serwerach znajduje się użytkownik (wyłącznie serwery, na których zainstalowano bota)
* ustalić, czy użytkownik został wpisany na czarną listę
* wyświetlić powody umieszczenia na czarnej liście zapisane na poszczególnych serwerach
* pomóc moderatorom identyfikować potencjalnie problematycznych użytkowników w wielu społecznościach

---

## 🎮 Darmowe gry

Bot może automatycznie publikować promocje darmowych gier z:

- Steam
- Epic Games

Możesz skonfigurować:

- włączanie lub wyłączanie powiadomień
- kanał publikacji
- aktywację platform

Gry są automatycznie:

- publikowane
- sortowane według końca promocji
- usuwane po zakończeniu promocji

---

## ⚙️ Przegląd ustawień serwera

Użyj:

\`/view-settings\`

aby wyświetlić pełną konfigurację bota dla serwera, w tym:

- ustawienia weryfikacji
- pytania weryfikacyjne
- ustawienia darmowych gier

Ta komenda zapewnia scentralizowany widok wszystkich ustawień serwera zarządzanych przez bota.

---

## 🔒 Uprawnienia

Większość komend konfiguracyjnych wymaga uprawnień **Administratora**.
`,
  commandMustBeUsedInServer: "Ta komenda musi być użyta na serwerze.",
  actionMustBeUsedInServer: "Ta akcja musi być użyta na serwerze.",
  commandMustBeUsedInTextChannel: "Ta komenda musi być użyta na kanale tekstowym",
  onlyStaffCanUseCommand: "Tylko administracja może używać tej komendy.",
  onlyStaffCanUseButtons: "Tylko administracja może używać tych przycisków.",
  verificationNotConfigured: "Weryfikacja nie jest skonfigurowana na tym serwerze.",
  verificationSettingsSaved: "Ustawienia weryfikacji zapisane.",
  verificationSettingsSavedAndPanelPosted:
    "Ustawienia zapisane i panel opublikowany.",
  verificationRequestSent:
    "Twoje zgłoszenie weryfikacyjne zostało wysłane do administracji.",
  configuredStaffCategoryNotFound:
    "Nie znaleziono skonfigurowanej kategorii administracji.",
  configuredPanelChannelInvalid:
    "Ten kanał nie jest poprawnym kanałem tekstowym dla panelu.",
  notAllowedConfigureVerification:
    "Nie masz uprawnień do konfiguracji weryfikacji.",
  notAllowedManageQuestions:
    "Nie masz uprawnień do zarządzania pytaniami.",
  noVerificationQuestions:
    "Brak pytań weryfikacyjnych dla tego serwera.",
  tooManyVerificationQuestions:
    "Za dużo pytań (maksymalnie 5).",
  blacklistedCannotAccess:
    "Jesteś na blacklist i nie masz dostępu do serwera.",
  alreadyVerifiedRoleRestored:
    "Byłeś już wcześniej zweryfikowany. Rola została przywrócona.",
  targetMemberNoLongerInServer:
    "Użytkownik nie znajduje się już na serwerze.",
  imageRequired: "Wymagany jest obraz.",
  errorOccurred: "Wystąpił błąd.",
  noQuestionFound: (index: number) => `Nie znaleziono pytania o indeksie ${index}.`,
  questionUpdatedSuccessfully: (index: number) => `Pytanie ${index} zaktualizowane.`,
  questionDeletedSuccessfully: (index: number) => `Pytanie ${index} usunięte.`,
  alreadyBeenVerifiedBefore:
    "Byłeś już wcześniej zweryfikowany. Rola została przywrócona",
  userUnknownToTheBot: (id: string) => `Użytkownik ${id} nieznany botowi.`,
  NoAuthorizedServerFoundInSetupVerificationPermissions:
    "Brak autoryzowanych serwerów.",
  CommandReservedByBasilic:
    "Ta komenda jest zarezerwowana dla @basilicayakashifr",
  YouCannotConfigureMoreThanFiveQuestions:
    "Nie możesz dodać więcej niż 5 pytań.",
  QuestionAddedAtIndex: (index: number) => `Dodano pytanie na pozycji ${index}.`,
  YouAreNotAllowedToViewVerificationQuestionsOnThisServer:
    "Nie masz uprawnień do przeglądania pytań.",
  YouAreNotAllowedtoEditVerificationQuestionsOnThisServer:
    "Nie masz uprawnień do edycji pytań.",
  VerifiedUserFound: (user_id: string, username: string, verified_at: string, verified_by: string) => `
**Znaleziono zweryfikowanego użytkownika**

**ID:** ${user_id}
**Nazwa:** ${username}
**Zweryfikowany:** ${verified_at}
**Przez:** ${verified_by}
`,
  globalKickHeader: (userId: string) =>
    `**Globalne wyrzucenie dla** \`${userId}\``,
  permissionAdded: (guildId: string) =>
    `Uprawnienie dodane.\n\n**Guild ID:** ${guildId}`,
  verificationQuestionsTitle: "**Pytania weryfikacyjne**",
  typeLabel: "Typ",
  requiredLabel: "Wymagane",
  yes: "tak",
  no: "nie",
  setupVerificationDescription: "Skonfiguruj weryfikację",
  checkVerifiedDescription: "Sprawdź status weryfikacji, czarnej listy i wspólne serwery użytkownika",
  globalKickDescription: "Wyrzuć użytkownika globalnie",
  allowSetupVerificationDescription: "Nadaj dostęp do konfiguracji",
  addVerificationQuestionDescription: "Dodaj pytanie",
  listVerificationQuestionsDescription: "Lista pytań",
  editVerificationQuestionDescription: "Edytuj pytanie",
  deleteVerificationQuestionDescription: "Usuń pytanie",
  botHelpDescription: "Wyświetl przewodnik konfiguracji bota i przydatne komendy",
  verifiedRoleIdDescription: "Rola przyznawana po zatwierdzeniu",
  staffCategoryIdDescription: "ID kategorii",
  staffRoleIdDescription: "Rola administracji do powiadomienia",
  userIdLookupDescription: "ID użytkownika",
  userIdKickDescription: "ID do wyrzucenia",
  guildIdDescription: "ID serwera",
  questionLabelDescription: "Treść pytania",
  questionTypeDescription: "Typ pytania",
  questionRequiredDescription: "Czy wymagane",
  questionIndexDescription: "Indeks pytania",
  newQuestionLabelDescription: "Nowa treść",
  newQuestionTypeDescription: "Nowy typ",
  newQuestionRequiredDescription: "Czy wymagane",
  choiceShortText: "Krótki tekst",
  choiceParagraph: "Paragraf",
  choiceImageUpload: "Obraz",
  guildNotFound: (id: string) => `❌ ${id} — serwer nie znaleziony`,
  userNotPresent: (name: string, id: string) => `ℹ️ ${name} (${id}) — brak`,
  userNotKickable: (name: string, id: string) => `❌ ${name} (${id}) — nie można wyrzucić`,
  userKicked: (name: string, id: string) => `✅ ${name} (${id}) — wyrzucony`,
  unexpectedError: (id: string) => `❌ ${id} — błąd`,
  
	BlacklistedUserFound: (
	  userId: string,
	  username: string,
	  blacklistedAt: string,
	  blacklistedBy: string,
	  reason: string
	) => `⚠️ Użytkownik znaleziony na czarnej liście

	ID użytkownika: ${userId}
	Nazwa użytkownika: ${username}
	Dodany na czarną listę: ${blacklistedAt}
	Dodany przez: ${blacklistedBy}
	Powód: ${reason}`,

	noReasonProvided: "Nie podano powodu",
	
  blacklistReasonDescription: "Dodaj powód (opcjonalne)",
  blacklistMemberDescription: "Dodać użytkownika do czarnej listy na tym serwerze",
	unblacklistMemberDescription: "Usuń użytkownika z czarnej listy i odbanuj go",
	userNotBlacklisted: (userId: string) => `ℹ️ ${userId} — użytkownik nie jest na czarnej liście`,
	userRemovedFromBlacklist: (userId: string) => `✅ ${userId} — usunięty z czarnej listy i odbanowany`,
	blacklistReasonSaved: "Powód zapisany pomyślnie",
	refusalReasonSaved: "Powód zapisany pomyślnie",
	setupSpamDetectionDescription: "Skonfiguruj wykrywanie alertów spamowych dla tego serwera",
	spamDetectionEnabledOptionDescription: "Włącz lub wyłącz wykrywanie spamu",
	spamAlertChannelDescription: "Kanał, na który będą wysyłane alerty moderacyjne",
	spamStaffRoleDescription: "Rola administracji oznaczana w alertach spamowych",
	spamAlertChannelRequired: "Musisz podać kanał alertów, aby włączyć wykrywanie spamu.",
	spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Wykrywanie spamu włączone.\nKanał alertów: <#${channelId}>${
		staffRoleId ? `\nRola administracji: <@&${staffRoleId}>` : ""
	  }`,
	spamDetectionDisabled: "✅ Wykrywanie spamu wyłączone.",
	memberPresentOnServers: (servers: string) => `📡 Użytkownik znajduje się na następujących serwerach:\n${servers}`,
	memberBlacklistedOnServers: (servers: string) => `⚠️ Użytkownik znajduje się na czarnej liście na następujących serwerach:\n${servers}`,
	blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) został dodany do blacklisty, ale nie udało się go wyrzucić z serwera.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) został dodany do czarnej listy i wyrzucony z serwera.`,
  spamInfoNombre : "Liczba wiadomości, po której przekroczeniu uruchamiane jest powiadomienie",
  spamInfoDuree : "Czas trwania okna wykrywania w sekundach",
  DelaiDescriptionCommande : "Czas w godzinach na przesłanie odpowiedzi weryfikacyjnych",
  ViewSettings: (
    questionsText : string,
    verifiedRoleDisplay: string,
    staffRoleDisplay: string,
    verificationTimeoutHours: number,
    freeGamesEnabled: boolean,
    freeGamesChannel: string,
    includeSteam: boolean,
    includeEpicGames: boolean
  ) => `**Aktualna konfiguracja bota**

## Weryfikacja

1) Zweryfikowana rola: ${verifiedRoleDisplay}
2) Rola moderacji: ${staffRoleDisplay}
3) Limit czasu weryfikacji: ${verificationTimeoutHours} godz.

${questionsText}
  
## Darmowe gry

1) Włączone: ${freeGamesEnabled ? "tak" : "nie"}
2) Kanał publikacji: ${freeGamesChannel}
3) Steam: ${includeSteam ? "tak" : "nie"}
4) Epic Games: ${includeEpicGames ? "tak" : "nie"}`,
NotAuthorizedServer: "Serwer nie został autoryzowany, nie można używać żadnej komendy",
ManualVerificationProcessed: (
  targetUserId: string,
  existingVerification: boolean,
  targetMember: boolean,
  roleAdded: boolean
) =>
  `✅ Ręczna weryfikacja została przetworzona dla \`${targetUserId}\`.\n` +
  `- Usunięcie oczekującej weryfikacji: zakończone\n` +
  `- Wpis w verified_users: ${
    existingVerification ? "już istniał" : "dodany"
  }\n` +
  `- Zweryfikowana rola: ${
    targetMember
      ? roleAdded
        ? "dodana"
        : "już obecna"
      : "nie dodano, członek nie jest obecny na serwerze"
  }`,

  NoMembersFoundWithRoleCount: (count: number) => `Nie znaleziono członków posiadających dokładnie ${count} rol(i).`,
  MembersWithRoleCountTitle: (count: number) => `**Członkowie posiadający dokładnie ${count} rol(i)**`,
  freeGamesManualPublishSettingsDeleted : "Ustawienia publikacji zostały usunięte",
  freeGamesManualPublishSettingsSaved : "Ustawienia publikacji zostały zapisane",
  none: "Brak",
  SuppressionAutomatiqueMessageMentionRoleActivee: (rolesDisplay : string) => `✅ Usuwanie wiadomości zawierających wzmiankę o następujących rolach zostało włączone: ${rolesDisplay}`,
  SuppressionAutomatiqueMessageMentionRoleDesctivee: `✅ Usuwanie wiadomości zostało wyłączone`,
};

const pl_out = {
  YourVerifiedStatusRestored: (g: string) => `Twoja weryfikacja na **${g}** została przywrócona.`,
  YourVerifiedStatusAccepted: (g: string) => `Twoja weryfikacja na **${g}** została zaakceptowana.`,
  YourVerifiedStatusDenied: (g: string) => `Twoja weryfikacja na **${g}** została odrzucona.`,
  YourVerifiedStatusDeniedAndBlackedListed: (g: string) => `Twoja weryfikacja na **${g}** została odrzucona i zostałeś zbanowany.`,
  MsgBlacklisted: (g: string) => `Jesteś na blacklist i nie możesz dołączyć do **${g}**.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Twoja prośba o weryfikację na serwerze ${guildName} została odrzucona i zostałeś dodany do czarnej listy.\nPowód: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Twoja prośba o weryfikację na serwerze ${guildName} została odrzucona.\nPowód: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Zostałeś wyrzucony z serwera **${guildName}**, ponieważ nie ukończyłeś weryfikacji na czas.`,
};

const pl_server = {
  startVerificationButton: "Rozpocznij weryfikację",
  startVerificationMessage: "Kliknij, aby rozpocząć.",
  approveButton: "Zatwierdź",
  rejectButton: "Odrzuć",
  blacklistButton: "Czarna lista",
  approvedDoneButton: "Zatwierdzono",
  rejectedDoneButton: "Odrzucono",
  blacklistedDoneButton: "Zablokowany",
  verificationModalTitle: "Weryfikacja",
  answerPlaceholder: "Wpisz odpowiedź",
  uploadOneImage: "Wyślij obraz",
  noFileProvided: "Brak pliku",
  newVerificationRequest: "Nowe zgłoszenie",
  memberLabel: "Użytkownik",
  tagLabel: "Tag",
  accountCreatedOnLabel: "Utworzono",
  accountAgeLabel: "Wiek konta",
  verificationWaiting: (id: string) => `<@&${id}> oczekuje weryfikacja.`,
  verificationAcceptedBy: (s: string, t: string) => `✅ Zatwierdzono przez <@${s}> dla <@${t}>.`,
  verificationDeniedBy: (s: string, t: string) => `❌ Odrzucono przez <@${s}> dla <@${t}>.`,
  userBlacklistedBy: (s: string, t: string) => `⛔ <@${t}> zablokowany przez <@${s}>.`,
  lessThanOneDay: "mniej niż 1 dzień",
  oneDay: "1 dzień",
  days: (n: number) => `${n} dni`,
  oneMonth: "1 miesiąc",
  months: (n: number) => `${n} miesięcy`,
  oneYear: "1 rok",
  years: (n: number) => `${n} lat`,
  
	rejectModalTitle: "Odrzuć wniosek o weryfikację",
	rejectReasonLabel: "Powód odrzucenia",
	rejectReasonPlaceholder: "Opcjonalnie: wyjaśnij, dlaczego wniosek został odrzucony",
	reasonLabel: "Powód",
	noReasonProvided: "Nie podano powodu",
	
  blacklistModalTitle: "Dodaj użytkownika do czarnej listy",
  blacklistReasonLabel: "Powód dodania do czarnej listy",
  blacklistReasonPlaceholder: "Wyjaśnij, dlaczego ten użytkownik trafia na czarną listę",
  spamDuplicateText: "Wykryto powtarzające się wiadomości",
  spamChannelsTouched: "Dotknięte kanały",
  spamDuplicateFile: (n: number) => `Ten sam plik/obraz wysłany ${n} razy`,
  spamHighVolume: (n: number) => `Duża aktywność: ${n} wiadomości`,
  spamAlertTitle: "⚠️ Podejrzenie spamu",
  spamNoContent: "(brak treści, prawdopodobnie załącznik)",
  spamFalsePositive: "Fałszywy alarm",
  spamBan: "Zbanuj",
  spamUserLabel: "Użytkownik",
  spamScoreLabel: "Wynik",
  spamOccurrencesLabel: "Wystąpienia",
  spamChannelsLabel: "Dotknięte kanały",
  spamReasonsLabel: "Wskaźniki",
  spamSampleLabel: "Przykład",
  spamLinksLabel: "Linki do wiadomości",
  spamUnknown: "nieznane",
  spamModerationFallback: "Moderacja",
  spamAlertMessage: "wykryto podejrzaną aktywność, zalecana ręczna weryfikacja.",
  discussMemberButton: "Rozmawiaj z użytkownikiem",
  discussionChannelIntro: (targetId: string) => `Ten prywatny kanał umożliwia administracji kontakt z <@${targetId}> w sprawie jego wniosku o weryfikację.`,
  discussionChannelAlreadyExists: (channelId: string) => `Kanał dyskusji już istnieje: <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Utworzono kanał dyskusji: <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Przekroczono czas na weryfikację",
  verificationTimeoutDM: (guildName: string) => `Zostałeś wyrzucony z serwera **${guildName}**, ponieważ nie ukończyłeś weryfikacji na czas.`,
  verificationTimeoutDisabled: "Brak ustawionego czasu weryfikacji",
  verificationTimeoutSet: (hours: number) => `Czas weryfikacji ustawiony na ${hours} godz.`,
  spamFalsePositiveConfirmed: "✅ Fałszywy alarm potwierdzony.",
  spamUserBanned: "🔨 Użytkownik zbanowany.",
};

const pl_internal = {
  kickReasonBlacklistedStart: "Zablokowany użytkownik próbował weryfikacji",
  kickReasonAuto: "Auto kick (blacklist)",
  kickReasonDenied: "Odrzucony przez admina",
  kickReasonBlacklisted: "Zablokowany przez admina",
  memberAlreadyVerifiedPreviously: "Już wcześniej zweryfikowany",
  blacklistedDuringVerification: "Zablokowany podczas weryfikacji",
  verifiedBy: (tag: string) => `Zweryfikowany przez ${tag}`,
  globalKickRequestedBy: (tag: string) => `Global kick przez ${tag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Dodano do czarnej listy podczas weryfikacji: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Weryfikacja odrzucona: ${reason}`,
  verificationTimeoutKickReason: "Przekroczono czas na weryfikację",
  verificationChannelClosed: "Decyzja weryfikacyjna została zakończona",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Dodany do czarnej listy przez ${moderatorTag}${reason ? ` | Powód: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam potwierdzony przez ${moderatorTag}`,
};

export default { pl_in, pl_out, pl_server, pl_internal };