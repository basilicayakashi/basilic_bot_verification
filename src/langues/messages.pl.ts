import type { MessagesIn, MessagesOut, MessagesServer, MessagesInternal } from "./messages.types.js";

const pl_in: MessagesIn = {
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

# 🎭 Reaction Roles — Przewodnik użytkownika

## 📂 Krok 1 — Utwórz kategorię

Przed dodaniem ról należy utworzyć kategorię, która je grupuje.

\`\`\`
/role-category action:create name:zwierzę
\`\`\`

Kategoria reprezentuje tematyczną grupę ról (np. zwierzęta, języki, zainteresowania...).

## ➕ Krok 2 — Dodaj role do kategorii

Dla każdej roli, którą chcesz zaproponować członkom, użyj:

\`\`\`
/role-manage action:add categorie:zwierzę role:@lis description:Lis emoji:🦊
/role-manage action:add categorie:zwierzę role:@pies description:Pies emoji:🐕
/role-manage action:add categorie:zwierzę role:@kot description:Kot emoji:🐈
\`\`\`

> **Uwaga:** Obsługiwane są również niestandardowe emoji serwera. Skopiuj ich identyfikator z Discorda w formacie \`<:nazwaemoji:123456789>\`.

## 📢 Krok 3 — Opublikuj panel

Po skonfigurowaniu ról opublikuj panel w wybranym kanale:

\`\`\`
/role-create categorie:zwierzę channel:#role
\`\`\`

Bot wykona następujące czynności:

1. Utworzy wiadomość embed we wskazanym kanale
2. Wyświetli skonfigurowane role z ich emoji i opisami
3. Automatycznie doda odpowiednie reakcje pod wiadomością

Wynik będzie wyglądał następująco:

> **Role — zwierzę**
> 🦊 — Lis
> 🐕 — Pies
> 🐈 — Kot

Członkowie mogą kliknąć reakcję, aby otrzymać przypisaną rolę, i kliknąć ponownie, aby ją usunąć.

## ✏️ Edytuj istniejącą rolę

Aby zmienić opis lub emoji już skonfigurowanej roli:

\`\`\`
/role-manage action:update categorie:zwierzę role:@lis description:Lis polarny emoji:🦊
\`\`\`

Aby zastąpić rolę inną:

\`\`\`
/role-manage action:update categorie:zwierzę role:@stararola new_role:@nowarola
\`\`\`

Opublikowany panel jest automatycznie aktualizowany.

## 🗑️ Usuń rolę z panelu

\`\`\`
/role-manage action:delete categorie:zwierzę role:@pies
\`\`\`

Panel jest automatycznie aktualizowany. Jeśli była to ostatnia rola w kategorii, wiadomość zostaje usunięta.

## 📋 Zmień nazwę kategorii

\`\`\`
/role-category action:update name:zwierzę new_name:zwierzęta
\`\`\`

## ❌ Usuń kategorię

\`\`\`
/role-category action:delete name:zwierzę
\`\`\`

Usuwa kategorię, wszystkie jej skonfigurowane role oraz opublikowaną wiadomość panelu.

## 🔍 Wyświetl istniejące kategorie

\`\`\`
/role-category-list
\`\`\`

Wyświetla wszystkie kategorie serwera, zawarte w nich role oraz informację o tym, czy ich panel jest opublikowany.

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

\`/role-used-msg-delete\` — Automatycznie usuwa każdą nową wiadomość, która wspomina jedną ze skonfigurowanych ról. Tylko właściciel serwera jest zwolniony z tej reguły. Przydatne do zapobiegania nadużywaniu masowych wzmianek, takich jak @everyone.

---

## 🔒 Uprawnienia

Większość komend konfiguracyjnych wymaga uprawnień **Administratora**.
`,

  helpAbout: `
# 🤖 Informacje o bocie

Ten bot oferuje funkcje **weryfikacji użytkowników**, **wykrywania spamu**, **analizy użytkowników** oraz **powiadomień o darmowych grach** dla Twojego serwera Discord.

---

## ⚙️ Przegląd ustawień serwera

Użyj:

\`/view-settings\`

aby wyświetlić pełną konfigurację bota na serwerze, w tym:

* ustawienia weryfikacji
* pytania weryfikacyjne
* ustawienia darmowych gier

Ta komenda zapewnia scentralizowany podgląd wszystkich ustawień specyficznych dla serwera.

---

\`/role-used-msg-delete\` — Automatycznie usuwa każdą nową wiadomość zawierającą wzmiankę o jednej ze skonfigurowanych ról. Właściciel serwera nie podlega temu ograniczeniu. Funkcja ta jest przydatna do zapobiegania nadużyciom związanym z masowymi wzmiankami, takimi jak @everyone.
`,

  helpVerification: `
## 🔐 Weryfikacja użytkowników

### Włączanie weryfikacji

Użyj:

\`/setup-verification\`

aby skonfigurować weryfikację nowych użytkowników.

Możesz określić:

* rolę zweryfikowanego użytkownika przyznawaną po zatwierdzeniu
* rolę moderacji
* kategorię moderacji
* maksymalny czas weryfikacji

### Zarządzanie pytaniami weryfikacyjnymi

Po włączeniu weryfikacji możesz dostosować pytania wyświetlane nowym użytkownikom:

* \`/add-verification-question\` → dodaj pytanie
* \`/edit-verification-question\` → edytuj istniejące pytanie
* \`/delete-verification-question\` → usuń pytanie

Wszystkie skonfigurowane pytania można wyświetlić za pomocą:

\`/view-settings\`

### Jak działa weryfikacja

1. Bot publikuje przycisk weryfikacji w skonfigurowanym kanale.
2. Nowy użytkownik klika przycisk i odpowiada na skonfigurowane pytania.
3. Automatycznie tworzony jest kanał weryfikacyjny przeznaczony dla moderacji.
4. Zespół moderacyjny może:
   * zatwierdzić prośbę o weryfikację
   * odrzucić prośbę o weryfikację
   * dodać użytkownika do czarnej listy
   * otworzyć prywatny kanał rozmowy z użytkownikiem w celu uzyskania dodatkowych informacji
5. Jeśli prośba zostanie zatwierdzona, rola zweryfikowanego użytkownika zostanie przyznana automatycznie.

---

## 👤 Ręczna weryfikacja użytkownika

Możesz ręcznie zweryfikować użytkownika, niezależnie od tego, czy znajduje się już na serwerze.

Użyj:

\`/verify-member\`

podając identyfikator Discord użytkownika.

Bot:

* natychmiast przyzna rolę zweryfikowanego użytkownika, jeśli użytkownik jest już obecny na serwerze
* automatycznie zweryfikuje użytkownika po jego późniejszym dołączeniu do serwera

---

## 🔎 Analiza użytkownika

Użyj:

\`/check-member\`

aby przeanalizować konto Discord.

Ta komenda pozwala:

* sprawdzić, na których serwerach znajduje się użytkownik (wyłącznie na serwerach, na których zainstalowano bota)
* ustalić, czy użytkownik został dodany do czarnej listy
* wyświetlić powody umieszczenia na czarnej liście zapisane na poszczególnych serwerach
* pomóc moderatorom identyfikować potencjalnie problematycznych użytkowników w wielu społecznościach
`,

  helpSpam: `
## 🛡️ Wykrywanie spamu

Bot może monitorować podejrzaną aktywność.

Użyj:

\`/setup-spam-detection\`

aby skonfigurować:

* włączanie lub wyłączanie wykrywania spamu
* kanał alertów
* oznaczanie roli moderacji
* progi wykrywania

Gdy zostanie wykryta podejrzana aktywność, alerty są automatycznie wysyłane do zespołu moderacyjnego.
`,

  helpFreeGames: `
## 🎮 Powiadomienia o darmowych grach

Bot może automatycznie publikować informacje o promocjach darmowych gier z:

* Steam
* Epic Games

Dedykowane komendy umożliwiają:

* włączanie lub wyłączanie powiadomień
* wybór kanału publikacji
* włączanie lub wyłączanie poszczególnych platform

Gry są automatycznie:

* publikowane na skonfigurowanym kanale
* sortowane według daty zakończenia promocji
* usuwane po wygaśnięciu promocji
`,

  helpPermissions: `
## 🔒 Uprawnienia

Większość komend konfiguracyjnych wymaga uprawnień **Administratora**.
`,

  helpReactionRoles: `
# 🎭 Reaction Roles — Instrukcja użytkowania

Reaction Roles pozwalają użytkownikom samodzielnie nadawać lub usuwać role poprzez kliknięcie reakcji emoji pod wiadomością.

---

## 📂 Krok 1 — Utwórz kategorię

Przed dodaniem ról należy utworzyć kategorię, która będzie je grupować.

\`\`\`
/role-category action:create name:animal
\`\`\`

Kategoria reprezentuje tematyczną grupę ról (np. zwierzęta, języki lub zainteresowania).

---

## ➕ Krok 2 — Dodawanie ról do kategorii

Dla każdej roli, którą chcesz udostępnić użytkownikom, użyj:

\`\`\`
/role-manage action:add category:animal role:@lis description:Lis emoji:🦊
/role-manage action:add category:animal role:@pies description:Pies emoji:🐕
/role-manage action:add category:animal role:@kot description:Kot emoji:🐈
\`\`\`

> **Uwaga:** Obsługiwane są również niestandardowe emoji serwera. Skopiuj ich identyfikator z Discorda w formacie \`<:nazwaemoji:123456789>\`.

---

## 📢 Krok 3 — Opublikuj panel

Po skonfigurowaniu ról opublikuj panel na wybranym kanale:

\`\`\`
/role-create category:animal channel:#role
\`\`\`

Bot wykona następujące czynności:

1. Utworzy wiadomość embed na wskazanym kanale
2. Wyświetli skonfigurowane role wraz z emoji i opisami
3. Automatycznie doda odpowiednie reakcje pod wiadomością

Efekt będzie wyglądał następująco:

> **Role — animal**
> 🦊 — Lis
> 🐕 — Pies
> 🐈 — Kot

Użytkownicy muszą jedynie kliknąć reakcję, aby otrzymać powiązaną rolę, a następnie kliknąć ją ponownie, aby ją usunąć.

---

## ✏️ Edytowanie istniejącej roli

Aby zmienić opis lub emoji już skonfigurowanej roli:

\`\`\`
/role-manage action:update category:animal role:@lis description:Lis polarny emoji:🦊
\`\`\`

Aby zastąpić jedną rolę inną:

\`\`\`
/role-manage action:update category:animal role:@stararola new_role:@nowarola
\`\`\`

Opublikowany panel jest automatycznie aktualizowany.

---

## 🗑️ Usuwanie roli z panelu

\`\`\`
/role-manage action:delete category:animal role:@pies
\`\`\`

Panel jest automatycznie aktualizowany. Jeśli była to ostatnia rola w kategorii, wiadomość zostanie usunięta.

---

## 📋 Zmiana nazwy kategorii

\`\`\`
/role-category action:update name:animal new_name:zwierzeta
\`\`\`

---

## ❌ Usuwanie kategorii

\`\`\`
/role-category action:delete name:animal
\`\`\`

Spowoduje to usunięcie kategorii, wszystkich skonfigurowanych ról oraz opublikowanej wiadomości panelu.

---

## 🔍 Wyświetlanie istniejących kategorii

\`\`\`
/role-category-list
\`\`\`

Wyświetla wszystkie kategorie na serwerze, role, które zawierają, oraz informację, czy ich panel został opublikowany.
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
  spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Wykrywanie spamu włączone.\nKanał alertów: <#${channelId}>${staffRoleId ? `\nRola administracji: <@&${staffRoleId}>` : ""
    }`,
  spamDetectionDisabled: "✅ Wykrywanie spamu wyłączone.",
  memberPresentOnServers: (servers: string) => `📡 Użytkownik znajduje się na następujących serwerach:\n${servers}`,
  memberBlacklistedOnServers: (servers: string) => `⚠️ Użytkownik znajduje się na czarnej liście na następujących serwerach:\n${servers}`,
  blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) został dodany do blacklisty, ale nie udało się go wyrzucić z serwera.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) został dodany do czarnej listy i wyrzucony z serwera.`,
  spamInfoNombre: "Liczba wiadomości, po której przekroczeniu uruchamiane jest powiadomienie",
  spamInfoDuree: "Czas trwania okna wykrywania w sekundach",
  DelaiDescriptionCommande: "Czas w godzinach na przesłanie odpowiedzi weryfikacyjnych",
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
  ) => `**Aktualna konfiguracja bota**

## Weryfikacja

1) Zweryfikowana rola: ${verifiedRoleDisplay}
2) Rola moderacji: ${staffRoleDisplay}
3) Limit czasu weryfikacji: ${verificationTimeoutHours} godz.

${questionsText}

${roleMsgDeleteText}
  
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
    `- Wpis w verified_users: ${existingVerification ? "już istniał" : "dodany"
    }\n` +
    `- Zweryfikowana rola: ${targetMember
      ? roleAdded
        ? "dodana"
        : "już obecna"
      : "nie dodano, członek nie jest obecny na serwerze"
    }`,

  NoMembersFoundWithRoleCount: (count: number) => `Nie znaleziono członków posiadających dokładnie ${count} rol(i).`,
  MembersWithRoleCountTitle: (count: number) => `**Członkowie posiadający dokładnie ${count} rol(i)**`,
  freeGamesManualPublishSettingsDeleted: "Ustawienia publikacji zostały usunięte",
  freeGamesManualPublishSettingsSaved: "Ustawienia publikacji zostały zapisane",
  none: "Brak",
  SuppressionAutomatiqueMessageMentionRoleActivee: (rolesDisplay: string) => `✅ Usuwanie wiadomości zawierających wzmiankę o następujących rolach zostało włączone: ${rolesDisplay}`,
  SuppressionAutomatiqueMessageMentionRoleDesctivee: `✅ Usuwanie wiadomości zostało wyłączone`,
  FournirAuMoinsUnRole: "Musisz podać co najmniej jedną rolę, jeśli usunięcie jest włączone.",
  AucunRole: "Brak roli",
  RoleIntrouvable: (roleDisplay: string) => `Rola nie została znaleziona (\`${roleDisplay}\`)`,
  AffichageParametrageSuppressionMessageRolesUtilises: (enabled: boolean, rolesDisplay: string) => `## 🚫 Usuwanie wiadomości według roli
      
      **Aktywowany :** ${enabled ? "tak" : "nie"}
      **Monitorowane role :** ${rolesDisplay}
      `,
  unknownServer: "Nieznany serwer",
  by: "Przez",
  reason: "Powód",
  verificationAlreadyInProgress: "⏳ Twoja weryfikacja jest już przetwarzana przez staff.",
  allowManageQuestionsDescription: "Zezwól użytkownikowi na zarządzanie pytaniami weryfikacyjnymi dla danego serwera",
  choiceLongText: "Długi tekst",
  verificationTimeoutHoursDescription: "Limit czasu w godzinach na przesłanie odpowiedzi weryfikacyjnych",
  spamDetectionDisabledOptionDescription: "Wyłącz wykrywanie spamu",
  spamAlertRoleDescription: "Rola staff do wspomnienia w alertach spamowych",
  questionAdded: "Pytanie dodane.",
  questionDeleted: "Pytanie usunięte.",
  questionUpdated: "Pytanie zaktualizowane.",
  noQuestionsToDelete: "Brak pytań do usunięcia.",
  noQuestionsToEdit: "Brak pytań do edycji.",
  invalidQuestionIndex: "Nieprawidłowy indeks pytania.",
  verificationSettingsNotConfigured: "Ustawienia weryfikacji nie są skonfigurowane.",
  blacklistReasonRequired: "Wymagany jest powód dla czarnej listy.",
  memberNotFound: "Nie znaleziono członka.",
  memberAlreadyBlacklisted: "Ten członek jest już na czarnej liście.",
  memberBlacklistRemoved: "Członek usunięty z czarnej listy.",
  memberNotBlacklisted: "Ten członek nie jest na czarnej liście.",
  spamDetectionSaved: "Ustawienia wykrywania spamu zapisane.",
  reactionRoleCategoryCreated: (name: string) => `Kategoria **${name}** została utworzona.`,
  reactionRoleCategoryAlreadyExists: (name: string) => `Kategoria **${name}** już istnieje.`,
  reactionRoleCategoryNotFound: (name: string) => `Nie znaleziono kategorii **${name}**.`,
  reactionRoleNewNameRequired: "Parametr `new_name` jest wymagany dla update.",
  reactionRoleCategoryRenamed: (oldName: string, newName: string) => `Zmieniono nazwę kategorii **${oldName}** → **${newName}**.`,
  reactionRoleCategoryDeleted: (name: string) => `Kategoria **${name}** i wszystkie jej role zostały usunięte.`,
  reactionRoleDescriptionAndEmojiRequired: "`description` i `emoji` są wymagane dla add.",
  reactionRoleAlreadyInCategory: (role: string, category: string) => `Rola ${role} jest już w kategorii **${category}**. Użyj \`action:update\`, aby ją zmienić.`,
  reactionRoleAdded: (role: string, category: string, emoji: string) => `Rola ${role} została dodana do **${category}** z emoji ${emoji}.`,
  reactionRoleUpdated: (role: string, category: string) => `Rola ${role} została zaktualizowana w **${category}**.`,
  reactionRoleRemoved: (role: string, category: string) => `Rola ${role} została usunięta z **${category}**.`,
  reactionRolePanelPublished: (category: string, channel: string) => `Panel **${category}** opublikowany w ${channel}.`,
  reactionRoleNoCategoryConfigured: "Na tym serwerze nie skonfigurowano żadnej kategorii.",
  reactionRoleCategoriesTitle: "Kategorie reaction roles",
  reactionRoleNoRole: "*Brak roli*",
  reactionRolePanelPublishedIn: (channelId: string) => `\n📌 Panel opublikowany w <#${channelId}>`,
  reactionRolePanelNotPublished: "*(panel nieopublikowany)*",
  welcomeMessageSaved: "✅ Wiadomość powitalna zapisana.",
  welcomeMessageDeleted: "✅ Wiadomość powitalna usunięta.",
  welcomeMessageNoneConfigured: "❌ Brak skonfigurowanej wiadomości powitalnej na tym serwerze.",
  welcomeMessageNotFound: "❌ Wiadomość nie znaleziona. Sprawdź, czy ID jest poprawne i czy bot ma dostęp do kanału.",
};

const pl_out: MessagesOut = {
  YourVerifiedStatusRestored: (g: string) => `Twoja weryfikacja na **${g}** została przywrócona.`,
  YourVerifiedStatusAccepted: (g: string) => `Twoja weryfikacja na **${g}** została zaakceptowana.`,
  YourVerifiedStatusDenied: (g: string) => `Twoja weryfikacja na **${g}** została odrzucona.`,
  YourVerifiedStatusDeniedAndBlackedListed: (g: string) => `Twoja weryfikacja na **${g}** została odrzucona i zostałeś zbanowany.`,
  MsgBlacklisted: (g: string) => `Jesteś na blacklist i nie możesz dołączyć do **${g}**.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Twoja prośba o weryfikację na serwerze ${guildName} została odrzucona i zostałeś dodany do czarnej listy.\nPowód: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Twoja prośba o weryfikację na serwerze ${guildName} została odrzucona.\nPowód: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Zostałeś wyrzucony z serwera **${guildName}**, ponieważ nie ukończyłeś weryfikacji na czas.`,
};

const pl_server: MessagesServer = {
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
  checkMemberBlacklistedOn: (lines: string) => `⛔ Użytkownik na czarnej liście na:\n\n${lines}`,
  by: "Przez",
  reason: "Powód",
  reactionRolePanelTitle: (category: string) => `Role — ${category}`,
  reactionRolePanelEmpty: "Dla tej kategorii nie skonfigurowano żadnych ról.",
};

const pl_internal: MessagesInternal = {
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