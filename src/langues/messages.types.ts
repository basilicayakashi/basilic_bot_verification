import { GuildMember } from "discord.js";

export type MessagesIn = {
    helpMessage: string;
    helpAbout: string;
    helpVerification: string;
    helpWelcomeMessage: string;
    helpSpam: string;
    helpReactionRoles: string;
    helpFreeGames: string;
    helpPermissions: string;
    helpHiddenCommands: string;
    commandMustBeUsedInServer: string;
    actionMustBeUsedInServer: string;
    commandMustBeUsedInTextChannel: string;
    onlyStaffCanUseCommand: string;
    onlyStaffCanUseButtons: string;
    verificationNotConfigured: string;
    verificationSettingsSaved: string;
    verificationSettingsSavedAndPanelPosted: string;
    verificationRequestSent: string;
    configuredStaffCategoryNotFound: string;
    configuredPanelChannelInvalid: string;
    notAllowedConfigureVerification: string;
    notAllowedManageQuestions: string;
    noVerificationQuestions: string;
    tooManyVerificationQuestions: string;
    blacklistedCannotAccess: string;
    alreadyVerifiedRoleRestored: string;
    targetMemberNoLongerInServer: string;
    imageRequired: string;
    errorOccurred: string;
    noQuestionFound: (index: number) => string;
    questionUpdatedSuccessfully: (index: number) => string;
    questionDeletedSuccessfully: (index: number) => string;
    alreadyBeenVerifiedBefore: string;
    NoAuthorizedServerFoundInSetupVerificationPermissions: string;
    CommandReservedByBasilic: string;
    YouCannotConfigureMoreThanFiveQuestions: string;
    QuestionAddedAtIndex: (index: number) => string;
    YouAreNotAllowedToViewVerificationQuestionsOnThisServer: string;
    YouAreNotAllowedtoEditVerificationQuestionsOnThisServer: string;
    VerifiedUserFound: (user_id: string, username: string, verified_at: string, verified_by: string) => string;
    globalKickHeader: (userId: string) => string;
    permissionAdded: (guildId: string) => string;
    verificationQuestionsTitle: string;
    typeLabel: string;
    requiredLabel: string;
    yes: string;
    no: string;
    setupVerificationDescription: string;
    checkVerifiedDescription: string;
    globalKickDescription: string;
    allowSetupVerificationDescription: string;
    allowManageQuestionsDescription: string;
    addVerificationQuestionDescription: string;
    listVerificationQuestionsDescription: string;
    editVerificationQuestionDescription: string;
    deleteVerificationQuestionDescription: string;
    botHelpDescription: string;
    verifiedRoleIdDescription: string;
    staffCategoryIdDescription: string;
    userIdLookupDescription: string;
    staffRoleIdDescription: string;
    userIdKickDescription: string;
    questionLabelDescription: string;
    questionRequiredDescription: string;
    questionTypeDescription: string;
    guildIdDescription: string;
    questionIndexDescription: string;
    newQuestionLabelDescription: string;
    newQuestionTypeDescription: string;
    newQuestionRequiredDescription: string;
    choiceShortText: string;
    choiceLongText: string;
    choiceImageUpload: string;
    guildNotFound: (guildId: string) => string;
    userNotPresent: (name: string, id: string) => string;
    userNotKickable: (name: string, id: string) => string;
    userKicked: (name: string, id: string) => string;
    unexpectedError: (guildId: string) => string;
    BlacklistedUserFound: (
        userId: string,
        username: string,
        blacklistedAt: string,
        blacklistedBy: string,
        reason: string
    ) => string;
    choiceParagraph: string;
    noReasonProvided: string;
    verificationTimeoutHoursDescription: string;
    blacklistReasonDescription: string;
    blacklistMemberDescription: string;
    unblacklistMemberDescription: string;
    userNotBlacklisted: (userId: string) => string;
    userUnknownToTheBot: (targetUserId: string) => string;
    userRemovedFromBlacklist: (userId: string) => string;
    blacklistReasonSaved: string;
    setupSpamDetectionDescription: string;
    spamDetectionEnabledOptionDescription: string;
    spamDetectionDisabledOptionDescription: string;
    spamAlertChannelDescription: string;
    spamAlertRoleDescription: string;
    spamStaffRoleDescription: string;
    spamAlertChannelRequired: string;
    spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => string;
    questionAdded: string;
    questionDeleted: string;
    questionUpdated: string;
    noQuestionsToDelete: string;
    noQuestionsToEdit: string;
    invalidQuestionIndex: string;
    verificationSettingsNotConfigured: string;
    blacklistReasonRequired: string;
    memberNotFound: string;
    memberAlreadyBlacklisted: string;
    memberBlacklistRemoved: string;
    memberNotBlacklisted: string;
    spamDetectionSaved: string;
    spamDetectionDisabled: string;
    memberPresentOnServers: (servers: string) => string;
    memberBlacklistedOnServers: (servers: string) => string;
    blacklistMemberSavedButKickFailed: (userId: string, username: string) => string;
    blacklistMemberSuccess: (userId: string, username: string) => string;
    spamInfoNombre: string;
    spamInfoDuree: string;
    DelaiDescriptionCommande: string;
    ViewSettings: (
        questionsText: string,
        verifiedRoleDisplay: string,
        staffRoleDisplay: string,
        verificationTimeoutHours: number,
        freeGamesEnabled: boolean,
        freeGamesChannel: string,
        includeSteam: boolean,
        includeEpicGames: boolean,
        roleMsgDeleteText: string,
        BlcklistAlertChannel: string,
        autokickSettings_days: number
    ) => string;
    NotAuthorizedServer: string;
    ManualVerificationProcessed: (
        targetUserId: string,
        existingVerification: boolean,
        targetMember: boolean,
        roleAdded: boolean
    ) => string;
    NoMembersFoundWithRoleCount: (count: number) => string;
    MembersWithRoleCountTitle: (count: number) => string;
    freeGamesManualPublishSettingsDeleted: string;
    freeGamesManualPublishSettingsSaved: string;
    none: string;
    SuppressionAutomatiqueMessageMentionRoleActivee: (rolesDisplay: string) => string;
    SuppressionAutomatiqueMessageMentionRoleDesctivee: string;
    FournirAuMoinsUnRole: string;
    AucunRole: string;
    RoleIntrouvable: (roleDisplay: string) => string;
    AffichageParametrageSuppressionMessageRolesUtilises: (enabled: boolean, rolesDisplay: string) => string;
    unknownServer: string;
    Serveur: string;
    by: string;
    reason: string;
    verificationAlreadyInProgress: string;
    refusalReasonSaved: string;
    reactionRoleCategoryAlreadyExists: (name: string) => string;
    reactionRoleCategoryCreated: (name: string) => string;
    reactionRoleCategoryNotFound: (name: string) => string;
    reactionRoleNewNameRequired: string;
    reactionRoleCategoryRenamed: (oldName: string, newName: string) => string;
    reactionRoleCategoryDeleted: (name: string) => string;
    reactionRoleDescriptionAndEmojiRequired: string;
    reactionRoleAlreadyInCategory: (role: string, category: string) => string;
    reactionRoleAdded: (role: string, category: string, emoji: string) => string;
    reactionRoleUpdated: (role: string, category: string) => string;
    reactionRoleRemoved: (role: string, category: string) => string;
    reactionRolePanelPublished: (category: string, channel: string) => string;
    reactionRoleNoCategoryConfigured: string;
    reactionRoleCategoriesTitle: string;
    reactionRoleNoRole: string;
    reactionRolePanelPublishedIn: (channelId: string) => string;
    reactionRolePanelNotPublished: string;
    welcomeMessageSaved: string;
    welcomeMessageDeleted: string;
    welcomeMessageNoneConfigured: string;
    welcomeMessageNotFound: string;
    blacklistJoinNotificationsEnabled: (channelId: string) => string;
    ChannelMustBeTextChannel: string;
    viewSettingsBlacklistNotificationChannel: (channel: string) => string;
    AutokickSettingsUpdated: string;
    helpAutokick: string;
};

export type MessagesOut = {
    YourVerifiedStatusRestored: (guild_name: string) => string;
    YourVerifiedStatusAccepted: (guild_name: string) => string;
    YourVerifiedStatusDenied: (guild_name: string) => string;
    YourVerifiedStatusDeniedAndBlackedListed: (guild_name: string) => string;
    MsgBlacklisted: (guild_name: string) => string;
    YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => string;
    YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => string;
    verificationTimeoutDM: (guildName: string) => string;
};

export type MessagesServer = {
    startVerificationButton: string;
    startVerificationMessage: string;
    approveButton: string;
    rejectButton: string;
    blacklistButton: string;
    approvedDoneButton: string;
    rejectedDoneButton: string;
    blacklistedDoneButton: string;
    verificationModalTitle: string;
    answerPlaceholder: string;
    uploadOneImage: string;
    noFileProvided: string;
    newVerificationRequest: string;
    memberLabel: string;
    tagLabel: string;
    accountCreatedOnLabel: string;
    accountAgeLabel: string;
    verificationWaiting: (staffRoleId: string) => string;
    verificationAcceptedBy: (staffId: string, targetId: string) => string;
    verificationDeniedBy: (staffId: string, targetId: string) => string;
    userBlacklistedBy: (staffId: string, targetId: string) => string;
    lessThanOneDay: string;
    oneDay: string;
    days: (n: number) => string;
    oneMonth: string;
    months: (n: number) => string;
    oneYear: string;
    years: (n: number) => string;
    rejectModalTitle: string;
    rejectReasonLabel: string;
    rejectReasonPlaceholder: string;
    reasonLabel: string;
    noReasonProvided: string;
    blacklistModalTitle: string;
    blacklistReasonLabel: string;
    blacklistReasonPlaceholder: string;
    spamDuplicateText: string;
    spamChannelsTouched: string;
    spamDuplicateFile: (n: number) => string;
    spamHighVolume: (n: number) => string;
    spamAlertTitle: string;
    spamNoContent: string;
    spamFalsePositive: string;
    spamBan: string;
    spamUserLabel: string;
    spamScoreLabel: string;
    spamOccurrencesLabel: string;
    spamChannelsLabel: string;
    spamReasonsLabel: string;
    spamSampleLabel: string;
    spamLinksLabel: string;
    spamUnknown: string;
    spamModerationFallback: string;
    spamAlertMessage: string;
    discussMemberButton: string;
    discussionChannelIntro: (targetId: string) => string;
    discussionChannelAlreadyExists: (channelId: string) => string;
    discussionChannelCreated: (channelId: string) => string;
    discussionChannelNamePrefix: string;
    verificationTimeoutKickReason: string;
    verificationTimeoutDM: (guildName: string) => string;
    verificationTimeoutDisabled: string;
    verificationTimeoutSet: (hours: number) => string;
    spamFalsePositiveConfirmed: string;
    spamUserBanned: string;
    checkMemberBlacklistedOn: (lines: string) => string;
    by: string;
    reason: string;
    reactionRolePanelTitle: (category: string) => string;
    reactionRolePanelEmpty: string;
    blacklistServerMessage: (guildName: string, timestamp: string, blacklisted_by: string, reason: string) => string;
    blackListedMemberFound: (memberTag: string, memberId: string, msgLines: string) => string;

    masterPet: {
        alreadyDeclared: (role: string) => string;
        declaredSuccess: (role: string) => string;
        undeclaredSuccess: (role: string) => string;

        cannotTargetSelf: string;
        cannotTargetBot: string;

        mustDeclareMasterFirst: string;
        mustDeclarePetFirst: string;

        alreadyLinked: string;
        noLinkFound: string;

        unlinkSuccess: (targetId: string) => string;

        accept: string;
        decline: string;

        requestPetSent: (requesterId: string, targetId: string) => string;
        requestMasterSent: (requesterId: string, targetId: string) => string;

        requestExpired: string;
        notYourRequest: string;

        requestAccepted: (requesterId: string, targetId: string) => string;
        requestDeclined: (requesterId: string, targetId: string) => string;

        memberNotFound: string;
        targetDmClosed: string;
        requestSentConfirmation: string;
        roleMaster: string;
        rolePet: string;
        noRoleDeclared: string;
        noneLabel: string;
        profileSummary: (userId: string, roles: string, masters: string, pets: string) => string;

        invalidSymbol: string;
        symbolAlreadyTaken: string;
        symbolClaimed: (symbol: string) => string;
        symbolRemoved: string;
        invalidChannel: string;
        referenceMessageNotFound: string;
        referenceMessageSet: string;
        noSymbolsClaimed: string;
    }
};

export type MessagesInternal = {
    kickReasonBlacklistedStart: string;
    kickReasonAuto: string;
    kickReasonDenied: string;
    kickReasonBlacklisted: string;
    memberAlreadyVerifiedPreviously: string;
    blacklistedDuringVerification: string;
    verifiedBy: (staffTag: string) => string;
    globalKickRequestedBy: (staffTag: string) => string;
    kickReasonBlacklistedWithReason: (reason: string) => string;
    kickReasonDeniedWithReason: (reason: string) => string;
    verificationTimeoutKickReason: string;
    verificationChannelClosed: string;
    blacklistKickReason: (moderatorTag: string, reason?: string) => string;
    spamBanReason: (moderatorTag: string) => string;
};