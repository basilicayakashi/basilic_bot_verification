const fr_in = {
  helpMessage: `
**Guide de démarrage du bot**

**Comment débuter**
1. Demandez d’abord à **basilic** l’autorisation d’utiliser le bot sur votre serveur.
2. Lors de votre demande, fournissez-lui **l’ID du serveur** sur lequel le bot sera utilisé.
3. Une fois l’autorisation accordée, le **créateur du serveur** peut utiliser \`/setup-verification\` pour activer la vérification des nouveaux membres.

**Configurer la vérification**
Après avoir activé la vérification avec \`/setup-verification\`, le créateur du serveur peut personnaliser les questions posées aux nouveaux membres :

- \`/add-verification-question\` → ajoute une question
- \`/edit-verification-question\` → modifie une question existante
- \`/delete-verification-question\` → supprime une question existante
- \`/list-verification-questions\` → affiche la liste des questions actuellement configurées

**Fonctionnement pour les nouveaux membres**
1. Le bot publie un bouton de vérification dans le salon choisi.
2. Un nouveau membre clique sur le bouton et répond aux questions configurées.
3. Le bot crée ensuite un salon staff de vérification.
4. Les membres du staff peuvent approuver, refuser ou blacklister la personne.
5. En cas d’approbation, le rôle configuré est attribué automatiquement.

**Détection anti-spam**
Le bot peut aussi surveiller les comportements suspects grâce à la commande :

- \`/setup-spam-detection\` → active et configure la détection anti-spam sur le serveur

Cette fonctionnalité permet d’envoyer des alertes au staff lorsqu’un membre envoie un volume anormal de messages dans une courte période.
`,

    commandMustBeUsedInServer: "Cette commande doit être utilisée dans un serveur.",
    actionMustBeUsedInServer: "Cette action doit être utilisée dans un serveur.",
    commandMustBeUsedInTextChannel: "Cette commande doit être utilisée dans un salon textuel",
    onlyStaffCanUseCommand: "Seuls les membres du staff peuvent utiliser cette commande.",
    onlyStaffCanUseButtons: "Seuls les membres du staff peuvent utiliser ces boutons.",
    verificationNotConfigured: "La vérification n’est pas configurée pour ce serveur.",
    verificationSettingsSaved: "Les paramètres de vérification ont été enregistrés pour ce serveur.",
    verificationSettingsSavedAndPanelPosted:
      "Les paramètres de vérification ont été enregistrés et le panneau a été publié avec succès.",
    verificationRequestSent:
      "Votre demande de vérification a été envoyée à l’équipe staff.",
    configuredStaffCategoryNotFound:
      "La catégorie staff configurée est introuvable.",
    configuredPanelChannelInvalid:
      "Le salon actuel n’est pas un salon texte valide pour le panneau de vérification.",
    notAllowedConfigureVerification:
      "Vous n’êtes pas autorisé à configurer la vérification sur ce serveur.",
    notAllowedManageQuestions:
      "Vous n’êtes pas autorisé à gérer les questions de vérification sur ce serveur.",
    noVerificationQuestions:
      "Aucune question de vérification n’est configurée pour ce serveur.",
    tooManyVerificationQuestions:
      "Trop de questions de vérification sont configurées pour ce serveur. Les modals Discord sont limités à 5 composants.",
    blacklistedCannotAccess:
      "Vous êtes blacklisté et ne pouvez pas accéder à ce serveur.",
    alreadyVerifiedRoleRestored:
      "Vous avez déjà été vérifié auparavant. Le rôle de vérifié a été restauré automatiquement.",
    targetMemberNoLongerInServer:
      "Le membre concerné n’est plus sur le serveur.",
    imageRequired: "Une image est requise.",
    errorOccurred: "Une erreur est survenue.",
    noQuestionFound: (index: number) => `Aucune question n’a été trouvée à l’index ${index}.`,
    questionUpdatedSuccessfully: (index: number) => `La question ${index} a été modifiée avec succès.`,
    questionDeletedSuccessfully: (index: number) => `La question ${index} a été supprimée avec succès.`,
    alreadyBeenVerifiedBefore : "Vous avez déjà été vérifié auparavant. Le rôle @verified a été restauré automatiquement.",
    userUnknownToTheBot : (targetUserId: string) => `L’utilisateur ${targetUserId} est inconnu du bot.`,
    NoAuthorizedServerFoundInSetupVerificationPermissions : "Aucun serveur autorisé n’a été trouvé dans setup_verification_permissions.",
    CommandReservedByBasilic : "Cette commande ne peut être utilisée que par \@basilicayakashifr",
    YouCannotConfigureMoreThanFiveQuestions : "Vous ne pouvez pas configurer plus de 5 questions de vérification car les modals Discord sont limités à 5 composants.",
    QuestionAddedAtIndex : (index: number) => `Question ajoutée à l’index ${index}.`,
    YouAreNotAllowedToViewVerificationQuestionsOnThisServer : "Vous n’êtes pas autorisé à voir les questions de vérification sur ce serveur",
    YouAreNotAllowedtoEditVerificationQuestionsOnThisServer : "Vous n’êtes pas autorisé à modifier les questions de vérification sur ce serveur",
    VerifiedUserFound: (user_id:string, username : string, verified_at : string, verified_by : string) => `
            **Utilisateur vérifié trouvé**

            **ID utilisateur:** ${user_id}
            **Nom d’utilisateur:** ${username}
            **Vérifié le:** ${verified_at}
            **Vérifié par:** ${verified_by}
            `,
    globalKickHeader: (userId: string) =>`**Résultats du bannissement global pour** \`${userId}\``,
    permissionAdded: (guildId: string) => `Permission ajoutée.\n\n**ID du serveur :** ${guildId}`,
    verificationQuestionsTitle: "**Questions de vérification pour ce serveur**",
    typeLabel: "Type",
    requiredLabel: "Obligatoire",
    yes: "oui",
    no: "non",
    setupVerificationDescription: "Configurer la vérification pour ce serveur",
    checkVerifiedDescription: "Vérifier si un utilisateur est enregistré dans la table verified_users",
    globalKickDescription: "Expulser un utilisateur de tous les serveurs autorisés pour le bot",
    allowSetupVerificationDescription: "Autoriser un utilisateur à configurer la vérification pour un serveur spécifique",
    addVerificationQuestionDescription: "Ajouter une question de vérification pour ce serveur",
    listVerificationQuestionsDescription: "Lister les questions de vérification pour ce serveur",
    editVerificationQuestionDescription: "Modifier une question de vérification par son index",
    deleteVerificationQuestionDescription: "Supprimer une question de vérification par son index",
    botHelpDescription: "Afficher le guide de démarrage du bot et les commandes utiles",
    verifiedRoleIdDescription: "Rôle à attribuer après approbation",
    staffCategoryIdDescription: "ID de la catégorie dans laquelle les salons du staff seront créés",
    staffRoleIdDescription: "Rôle du staff à notifier",
    userIdLookupDescription: "ID de l'utilisateur à rechercher",
    userIdKickDescription: "ID Discord de l'utilisateur à expulser",
    guildIdDescription: "ID du serveur Discord où la commande est autorisée",
    questionLabelDescription: "Libellé de la question affiché à l'utilisateur",
    questionTypeDescription: "Type de question",
    questionRequiredDescription: "Indique si la question est obligatoire",
    questionIndexDescription: "Index de la question affiché par /list-verification-questions",
    newQuestionLabelDescription: "Nouveau libellé de la question",
    newQuestionTypeDescription: "Nouveau type de question",
    newQuestionRequiredDescription: "Indique si la question est obligatoire",
    choiceShortText: "Texte court",
    choiceParagraph: "Paragraphe",
    choiceImageUpload: "Téléversement d'image",
    guildNotFound: (guildId: string) => `❌ ${guildId} — serveur introuvable ou bot absent`,
    userNotPresent: (name: string, id: string) => `ℹ️ ${name} (${id}) — utilisateur absent`,
    userNotKickable: (name: string, id: string) => `❌ ${name} (${id}) — utilisateur impossible à expulser`,
    userKicked: (name: string, id: string) => `✅ ${name} (${id}) — expulsé`,
    unexpectedError: (guildId: string) => `❌ ${guildId} — erreur inattendue`,
	
	BlacklistedUserFound: (
	  userId: string,
	  username: string,
	  blacklistedAt: string,
	  blacklistedBy: string,
	  reason: string
	) => `⚠️ Utilisateur blacklisté trouvé

	ID utilisateur : ${userId}
	Nom d'utilisateur : ${username}
	Blacklisté le : ${blacklistedAt}
	Blacklisté par : ${blacklistedBy}
	Raison : ${reason}`,

	noReasonProvided: "Aucune raison fournie",

  blacklistReasonDescription: "Ajouter une raison (facultatif)",
	blacklistMemberDescription: "Mettre un utilisateur sur liste noire sur ce serveur",
	unblacklistMemberDescription: "Retirer un utilisateur de la blacklist et le débannir",
	userNotBlacklisted: (userId: string) => `ℹ️ ${userId} — utilisateur non blacklisté`,
	userRemovedFromBlacklist: (userId: string) => `✅ ${userId} — retiré de la blacklist et débanni`,
	blacklistReasonSaved: "Motif de blacklist enregistré avec succès",
	refusalReasonSaved: "Motif enregistré avec succès",
	setupSpamDetectionDescription: "Configurer la détection d'alertes anti-spam pour ce serveur",
	spamDetectionEnabledOptionDescription: "Activer ou désactiver la détection anti-spam",
	spamAlertChannelDescription: "Salon où les alertes de modération seront envoyées",
	spamStaffRoleDescription: "Rôle staff à mentionner dans les alertes anti-spam",
	spamAlertChannelRequired: "Vous devez fournir un salon d’alerte pour activer la détection anti-spam.",
	spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Détection anti-spam activée.\nSalon d’alerte : <#${channelId}>${
		staffRoleId ? `\nRôle staff : <@&${staffRoleId}>` : ""
	  }`,
	spamDetectionDisabled: "✅ Détection anti-spam désactivée.",
	memberPresentOnServers: (servers: string) => `📡 Membre présent sur les serveurs suivants :\n${servers}`,
	memberBlacklistedOnServers: (servers: string) => `⚠️ Membre blacklisté sur les serveurs suivants :\n${servers}`,
	blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) a été blacklisté, mais n'a pas pu être expulsé du serveur.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) a été blacklisté et expulsé du serveur.`,
  spamInfoNombre : "Nombre de messages à partir duquel une alerte est déclenchée",
  spamInfoDuree : "Durée en secondes de la fenêtre de détection",
  DelaiDescriptionCommande : "Délai en heures pour soumettre les réponses de vérification",
  ViewVeriicationsetup: (verifiedRoleDisplay : string, staffRoleDisplay : string, verification_timeout_hours : number) =>  `**Configuration actuelle de la vérification**

1) Rôle utilisé pour vérifier les membres : ${verifiedRoleDisplay}
2) Rôle utilisé pour signaler l'équipe de modération : ${staffRoleDisplay}
3) Délai maximal pour lancer la vérification : ${verification_timeout_hours} heure(s)`,
};

const fr_out = {
  YourVerifiedStatusRestored: (guild_name : string) => `Bonjour, votre statut vérifié sur **${guild_name}** a été automatiquement restauré.`,
  YourVerifiedStatusAccepted : (guild_name : string) => `Bonjour, votre vérification sur **${guild_name}** a été acceptée. Le rôle @verified vous a été attribué.`,
  YourVerifiedStatusDenied : (guild_name : string) => `Bonjour, votre demande de vérification sur **${guild_name}** a été refusée.`,
  YourVerifiedStatusDeniedAndBlackedListed : (guild_name : string) => `Bonjour, votre demande de vérification sur **${guild_name}** a été refusée et votre compte a été blacklisté.`,
  MsgBlacklisted : (guild_name : string) => `Bonjour, vous êtes blacklisté et ne pouvez pas rejoindre **${guild_name}**.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Votre demande de vérification pour ${guildName} a été refusée et vous avez été blacklisté.\nMotif : ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Votre demande de vérification pour ${guildName} a été refusée.\nMotif : ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Vous avez été expulsé du serveur **${guildName}** car vous n’avez pas complété la vérification à temps.`,
};

const fr_server = {
  startVerificationButton: "Commencer la vérification",
  startVerificationMessage: "Cliquez sur le bouton ci-dessous pour commencer votre vérification.",

  approveButton: "Approuver",
  rejectButton: "Refuser",
  blacklistButton: "Blacklister",

  approvedDoneButton: "Approuvé",
  rejectedDoneButton: "Refusé",
  blacklistedDoneButton: "Blacklisté",

  verificationModalTitle: "Vérification",
  answerPlaceholder: "Tapez votre réponse ici",
  uploadOneImage: "Téléverser une image",
  noFileProvided: "Aucun fichier fourni",

  newVerificationRequest: "Nouvelle demande de vérification.",
  memberLabel: "Membre",
  tagLabel: "Tag",
  accountCreatedOnLabel: "Compte créé le",
  accountAgeLabel: "Âge du compte",

  verificationWaiting: (staffRoleId: string) =>`<@&${staffRoleId}> une demande de vérification est en attente.`,
  verificationAcceptedBy: (staffId: string, targetId: string) => `✅ Vérification acceptée par <@${staffId}> pour <@${targetId}>.`,
  verificationDeniedBy: (staffId: string, targetId: string) => `❌ Vérification refusée par <@${staffId}> pour <@${targetId}>.`,
  userBlacklistedBy: (staffId: string, targetId: string) => `⛔ L'utilisateur <@${targetId}> a été blacklisté par <@${staffId}>.`,
  
  lessThanOneDay: "moins d'un jour",
  oneDay: "1 jour",
  days: (n: number) => `${n} jours`,
  oneMonth: "1 mois",
  months: (n: number) => `${n} mois`,
  oneYear: "1 an",
  years: (n: number) => `${n} ans`,
  
	rejectModalTitle: "Refuser la demande de vérification",
	rejectReasonLabel: "Motif du refus",
	rejectReasonPlaceholder: "Optionnel : expliquez pourquoi la demande est refusée",
	reasonLabel: "Motif",
	noReasonProvided: "Aucun motif fourni",
	
  blacklistModalTitle: "Blacklister le membre",
  blacklistReasonLabel: "Motif du blacklist",
  blacklistReasonPlaceholder: "Expliquez pourquoi ce membre est blacklisté",
  spamDuplicateText: "Messages répétés détectés",
  spamChannelsTouched: "Salons concernés",
  spamDuplicateFile: (n: number) => `Même fichier / image republié ${n} fois`,
  spamHighVolume: (n: number) => `Volume élevé : ${n} messages dans la fenêtre`,
  spamAlertTitle: "⚠️ Suspicion de spam à vérifier",
  spamNoContent: "(message sans texte, probablement pièce jointe)",
  spamFalsePositive: "Faux spam",
  spamBan: "Bannir",
  spamUserLabel: "Utilisateur",
  spamScoreLabel: "Score",
  spamOccurrencesLabel: "Occurrences retenues",
  spamChannelsLabel: "Salons concernés",
  spamReasonsLabel: "Indices",
  spamSampleLabel: "Extrait",
  spamLinksLabel: "Liens messages",
  spamUnknown: "inconnu",
  spamModerationFallback: "Modération",
  spamAlertMessage: "activité suspecte détectée, vérification manuelle recommandée.",
  discussMemberButton: "Discuter avec le membre",
  discussionChannelIntro: (targetId: string) => `Ce salon privé permet au staff d’échanger avec <@${targetId}> au sujet de sa demande de vérification.`,
  discussionChannelAlreadyExists: (channelId: string) => `Un salon de discussion existe déjà : <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Salon de discussion créé : <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Délai de soumission de la vérification dépassé",
  verificationTimeoutDM: (guildName: string) => `Vous avez été expulsé du serveur **${guildName}** car vous n’avez pas complété la vérification à temps.`,
  verificationTimeoutDisabled: "Aucun délai de vérification défini",
  verificationTimeoutSet: (hours: number) => `Délai de vérification défini à ${hours} heure(s).`,
  spamFalsePositiveConfirmed: "✅ Faux positif confirmé.",
  spamUserBanned: "🔨 Utilisateur banni.",
};

const fr_internal = {
  kickReasonBlacklistedStart : "Utilisateur blacklisté ayant tenté une vérification",
  kickReasonAuto: "Utilisateur blacklisté expulsé automatiquement à l'arrivée",
  kickReasonDenied: "Vérification refusée par le staff",
  kickReasonBlacklisted: "Utilisateur blacklisté pendant la vérification",
  memberAlreadyVerifiedPreviously:"Membre déjà vérifié auparavant",
  blacklistedDuringVerification:"Blacklisté pendant la vérification",
  verifiedBy: (staffTag: string) =>`Vérifié par ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) =>`Expulsion globale demandée par ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Blacklisté lors de la vérification : ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Vérification refusée : ${reason}`,
  verificationTimeoutKickReason: "Délai de soumission de la vérification dépassé",
  verificationChannelClosed: "Décision de vérification finalisée",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Blacklisté par ${moderatorTag}${reason ? ` | Raison : ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam confirmé par ${moderatorTag}`,
};

export default {fr_in, fr_out, fr_server, fr_internal};