const en_in = {
  helpMessage : `
**Bot setup guide**

**Getting started**
1. First, ask **basilic** for permission to use the bot on your server.
2. When making your request, provide the **server ID** where the bot will be used.
3. Once permission is granted, the **server owner** can run \`/setup-verification\` to enable new member verification.

**Configure verification**
After enabling verification with \`/setup-verification\`, the server owner can customize the questions asked to new members:

- \`/add-verification-question\` → add a question
- \`/edit-verification-question\` → edit an existing question
- \`/delete-verification-question\` → delete an existing question
- \`/list-verification-questions\` → list all configured questions

**How it works for new members**
1. The bot posts a verification button in the selected channel.
2. A new member clicks the button and answers the configured questions.
3. The bot creates a staff verification channel.
4. Staff members can approve, reject, or blacklist the user.
5. If approved, the configured role is automatically assigned.

**Spam detection**
The bot can also monitor suspicious activity using:

- \`/setup-spam-detection\` → enable and configure spam detection for the server

This feature sends alerts to staff when a user sends an unusually high number of messages in a short period.
`,
  commandMustBeUsedInServer: "This command must be used inside a server.",
    actionMustBeUsedInServer: "This action must be used inside a server.",
    commandMustBeUsedInTextChannel: "This command must be used in a text channel",
    onlyStaffCanUseCommand: "Only staff members can use this command.",
    onlyStaffCanUseButtons: "Only staff members can use these buttons.",
    verificationNotConfigured: "Verification is not configured for this server.",
    verificationSettingsSaved: "Verification settings saved for this server.",
    verificationSettingsSavedAndPanelPosted:
      "Verification settings saved and panel posted successfully.",
    verificationRequestSent:
      "Your verification request has been sent to the staff team.",
    configuredStaffCategoryNotFound:
      "The configured staff category could not be found.",
    configuredPanelChannelInvalid:
      "The current channel is not a valid text channel for the verification panel.",
    notAllowedConfigureVerification:
      "You are not allowed to configure verification on this server.",
    notAllowedManageQuestions:
      "You are not allowed to manage verification questions on this server.",
    noVerificationQuestions:
      "No verification questions are configured for this server.",
    tooManyVerificationQuestions:
      "Too many verification questions are configured for this server. Discord modals support a maximum of 5 components.",
    blacklistedCannotAccess:
      "You are blacklisted and cannot access this server.",
    alreadyVerifiedRoleRestored:
      "You have already been verified before. The verified role has been restored automatically.",
    targetMemberNoLongerInServer:
      "The target member is no longer in the server.",
    imageRequired: "An image is required.",
    errorOccurred: "An error occurred.",
    noQuestionFound: (index: number) => `No question found at index ${index}.`,
    questionUpdatedSuccessfully: (index: number) => `Question ${index} updated successfully.`,
    questionDeletedSuccessfully: (index: number) => `Question ${index} deleted successfully.`,
    alreadyBeenVerifiedBefore : "You have already been verified before. The @verified role has been restored automatically",
    userUnknownToTheBot : (targetUserId: string) => `User ${targetUserId} is unknown to the bot.`,
    NoAuthorizedServerFoundInSetupVerificationPermissions : "No authorized servers were found in setup_verification_permissions.",
    CommandReservedByBasilic : "This command can only by used by \@basilicayakashifr",
    YouCannotConfigureMoreThanFiveQuestions : "You cannot configure more than 5 verification questions because Discord modals are limited to 5 components",
    QuestionAddedAtIndex : (index: number) => `Question added at index ${index}.`,
    YouAreNotAllowedToViewVerificationQuestionsOnThisServer : "You are not allowed to view verification questions on this server",
    YouAreNotAllowedtoEditVerificationQuestionsOnThisServer : "You are not allowed to edit verification questions on this server",
    VerifiedUserFound: (user_id:string, username : string, verified_at : string, verified_by : string) => `
            **Verified user found**

            **User ID:** ${user_id}
            **Username:** ${username}
            **Verified at:** ${verified_at}
            **Verified by:** ${verified_by}
            `,
    globalKickHeader: (userId: string) =>`**Global kick results for** \`${userId}\``,
    permissionAdded: (guildId: string) => `Permission added.\n\n**Guild ID:** ${guildId}`,
    verificationQuestionsTitle: "**Verification questions for this server**",
    typeLabel: "Type",
    requiredLabel: "Required",
    yes: "yes",
    no: "no",
    setupVerificationDescription: "Configure verification for this server",
    checkVerifiedDescription: "Check a user's verification, blacklist status, and shared servers",
    globalKickDescription: "Kick a user from all bot-authorized servers",
    allowSetupVerificationDescription: "Allow a user to configure verification for a specific server",
    addVerificationQuestionDescription: "Add a verification question for this server",
    listVerificationQuestionsDescription: "List verification questions for this server",
    editVerificationQuestionDescription: "Edit a verification question by its index",
    deleteVerificationQuestionDescription: "Delete a verification question by its index",
    botHelpDescription: "Show the bot setup guide and useful commands",
	  verifiedRoleIdDescription: "Role to grant after approval",
    staffCategoryIdDescription: "Category ID where staff channels will be created",
    staffRoleIdDescription: "Staff role to notify",
    userIdLookupDescription: "The user ID to look up",
    userIdKickDescription: "The Discord user ID to kick",
    guildIdDescription: "Discord server ID where the command is allowed",
    questionLabelDescription: "Question label shown to the user",
    questionTypeDescription: "Question type",
    questionRequiredDescription: "Whether the question is required",
    questionIndexDescription: "Question index shown by /list-verification-questions",
    newQuestionLabelDescription: "New question label",
    newQuestionTypeDescription: "New question type",
    newQuestionRequiredDescription: "Whether the question is required",
    choiceShortText: "Short text",
    choiceParagraph: "Paragraph",
    choiceImageUpload: "Image upload",
    guildNotFound: (guildId: string) => `❌ ${guildId} — guild not found or bot not present`,
    userNotPresent: (name: string, id: string) => `ℹ️ ${name} (${id}) — user not present`,
    userNotKickable: (name: string, id: string) => `❌ ${name} (${id}) — user is not kickable`,
    userKicked: (name: string, id: string) => `✅ ${name} (${id}) — kicked`,
    unexpectedError: (guildId: string) => `❌ ${guildId} — unexpected error`,
	
	BlacklistedUserFound: (
	  userId: string,
	  username: string,
	  blacklistedAt: string,
	  blacklistedBy: string,
	  reason: string
	) => `⚠️ Blacklisted user found

	User ID: ${userId}
	Username: ${username}
	Blacklisted at: ${blacklistedAt}
	Blacklisted by: ${blacklistedBy}
	Reason: ${reason}`,

	noReasonProvided: "No reason provided",
	
  blacklistReasonDescription: "Add a reason (optional)",
  blacklistMemberDescription: "Blacklist a user on this server",
	unblacklistMemberDescription: "Remove a user from the blacklist for this server",
	userNotBlacklisted: (userId: string) => `ℹ️ ${userId} — user is not blacklisted`,
	userRemovedFromBlacklist: (userId: string) => `✅ ${userId} — removed from blacklist and unbanned`,
	blacklistReasonSaved: "Blacklist reason recorded successfully",
	refusalReasonSaved: "Reason recorded successfully",
	setupSpamDetectionDescription: "Configure spam alert detection for this server",
	spamDetectionEnabledOptionDescription: "Enable or disable spam detection",
	spamAlertChannelDescription: "Channel where moderation alerts will be sent",
	spamStaffRoleDescription: "Staff role to mention in spam alerts",
	spamAlertChannelRequired: "You must provide an alert channel when enabling spam detection.",
	spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Spam detection enabled.\nAlert channel: <#${channelId}>${
		staffRoleId ? `\nStaff role: <@&${staffRoleId}>` : ""
	  }`,
	spamDetectionDisabled: "✅ Spam detection disabled.",
	memberPresentOnServers: (servers: string) => `📡 Member found on the following servers:\n${servers}`,
	memberBlacklistedOnServers: (servers: string) => `⚠️ Member is blacklisted on the following servers:\n${servers}`,
	blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) was blacklisted, but could not be kicked from the server.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) was blacklisted and kicked from the server.`,
  spamInfoNombre : "Number of messages required to trigger an alert",
  spamInfoDuree : "Duration in seconds of the detection window",
  DelaiDescriptionCommande : "Time limit in hours to submit verification responses",
  ViewVeriicationsetup: (verifiedRoleDisplay : string, staffRoleDisplay : string, verification_timeout_hours : number) =>  `**Current verification configuration**

1) Role used to verify members : ${verifiedRoleDisplay}
2) Role used to notify the moderation team : ${staffRoleDisplay}
3) Maximum time allowed to start verification : ${verification_timeout_hours} hour(s)`,
  NotAuthorizedServer: "The server has not been authorized, it is impossible to use any command",
};

const en_out = {
  YourVerifiedStatusRestored: (guild_name : string) => `Hello, your verified status on **${guild_name}** has been automatically restored.`,
  YourVerifiedStatusAccepted : (guild_name : string) => `Hello, your verification on **${guild_name}** has been accepted. The @verified role has been assigned to you.`,
  YourVerifiedStatusDenied : (guild_name : string) => `Hello, your verification request on **${guild_name}** has been denied.`,
  YourVerifiedStatusDeniedAndBlackedListed : (guild_name : string) => `Hello, your verification request on **${guild_name}** has been denied and your account has been blacklisted.`,
  MsgBlacklisted : (guild_name : string) => `Hello, you are blacklisted and cannot join **${guild_name}**.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Your verification request for ${guildName} was denied and you have been blacklisted.\nReason: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Your verification request for ${guildName} was denied.\nReason: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `You have been kicked from **${guildName}** because you did not complete the verification in time.`,
};

const en_server = {
  startVerificationButton: "Start verification",
  startVerificationMessage: "Click the button below to start your verification.",

  approveButton: "Approve",
  rejectButton: "Reject",
  blacklistButton: "Blacklist",

  approvedDoneButton: "Approved",
  rejectedDoneButton: "Rejected",
  blacklistedDoneButton: "Blacklisted",

  verificationModalTitle: "Verification",
  answerPlaceholder: "Type your answer here",
  uploadOneImage: "Upload one image",
  noFileProvided: "No file provided",

  newVerificationRequest: "New verification request.",
  memberLabel: "Member",
  tagLabel: "Tag",
  accountCreatedOnLabel: "Account created on",
  accountAgeLabel: "Account age",

  verificationWaiting: (staffRoleId: string) =>`<@&${staffRoleId}> a verification request is waiting.`,
  verificationAcceptedBy: (staffId: string, targetId: string) => `✅ Verification accepted by <@${staffId}> for <@${targetId}>.`,
  verificationDeniedBy: (staffId: string, targetId: string) => `❌ Verification denied by <@${staffId}> for <@${targetId}>.`,
  userBlacklistedBy: (staffId: string, targetId: string) => `⛔ User <@${targetId}> was blacklisted by <@${staffId}>.`,
  
  lessThanOneDay: "less than 1 day",
  oneDay: "1 day",
  days: (n: number) => `${n} days`,
  oneMonth: "1 month",
  months: (n: number) => `${n} months`,
  oneYear: "1 year",
  years: (n: number) => `${n} years`,
  
	rejectModalTitle: "Reject verification request",
	rejectReasonLabel: "Reason for rejection",
	rejectReasonPlaceholder: "Optional: explain why the request is rejected",
	reasonLabel: "Reason",
	noReasonProvided: "No reason provided",
	
	blacklistModalTitle: "Blacklist member",
	blacklistReasonLabel: "Reason for blacklist",
	blacklistReasonPlaceholder: "Explain why this member is blacklisted",
  spamDuplicateText: "Repeated messages detected",
  spamChannelsTouched: "Channels impacted",
  spamDuplicateFile: (n: number) => `Same file/image reposted ${n} times`,
  spamHighVolume: (n: number) => `High volume: ${n} messages in the time window`,
  spamAlertTitle: "⚠️ Spam suspicion detected",
  spamNoContent: "(no text content, likely an attachment)",
  spamFalsePositive: "False positive",
  spamBan: "Ban",
  spamUserLabel: "User",
  spamScoreLabel: "Score",
  spamOccurrencesLabel: "Occurrences considered",
  spamChannelsLabel: "Channels involved",
  spamReasonsLabel: "Indicators",
  spamSampleLabel: "Sample",
  spamLinksLabel: "Message links",
  spamUnknown: "unknown",
  spamModerationFallback: "Moderation",
  spamAlertMessage: "suspicious activity detected, manual review recommended.",
  discussMemberButton: "Discuss with member",
  discussionChannelIntro: (targetId: string) => `This private channel allows staff to discuss with <@${targetId}> about their verification request.`,
  discussionChannelAlreadyExists: (channelId: string) => `A discussion channel already exists: <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Discussion channel created: <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Verification submission timeout exceeded",
  verificationTimeoutDM: (guildName: string) => `You have been kicked from **${guildName}** because you did not complete the verification in time.`,
  verificationTimeoutDisabled: "No verification timeout configured",
  verificationTimeoutSet: (hours: number) => `Verification timeout set to ${hours} hour(s).`,
  spamFalsePositiveConfirmed: "✅ False positive confirmed.",
  spamUserBanned: "🔨 User banned.",
};

const en_internal = {
  kickReasonBlacklistedStart : "Blacklisted user attempted to start verification",
  kickReasonAuto: "Blacklisted user auto-kicked on join",
  kickReasonDenied: "Verification denied by staff",
  kickReasonBlacklisted: "User blacklisted by staff during verification",
  memberAlreadyVerifiedPreviously:"Member was already verified previously",
  blacklistedDuringVerification:"Blacklisted during verification",
  verifiedBy: (staffTag: string) =>`Verified by ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) =>`Global kick requested by ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Blacklisted during verification: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Verification denied: ${reason}`,
  verificationTimeoutKickReason: "Verification submission timeout exceeded",
  verificationChannelClosed: "Verification decision finalized",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Blacklisted by ${moderatorTag}${reason ? ` | Reason: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam confirmed by ${moderatorTag}`,
};

export default {en_in, en_out, en_server, en_internal};