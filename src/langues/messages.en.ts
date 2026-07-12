import type { MessagesIn, MessagesOut, MessagesServer, MessagesInternal } from "./messages.types.js";

const en_in: MessagesIn = {
  helpMessage: `
# 🤖 Bot setup guide

This bot provides **member verification**, **spam detection**, **member analysis**, and **free game notifications** for your Discord server.

---

## 🔐 Member verification

### Enable verification

Use:

\`/setup-verification\`

to configure verification for new members.

You can define:

- the verified role assigned after approval
- the moderation role
- the moderation category
- the verification timeout

### Manage verification questions

After enabling verification, you can customize the questions shown to new members:

- \`/add-verification-question\` → add a question
- \`/edit-verification-question\` → edit an existing question
- \`/delete-verification-question\` → delete a question

All configured questions can be viewed using:

\`/view-settings\`

### How verification works

1. The bot posts a verification button in the configured channel.
2. A new member clicks the button and answers the configured questions.
3. A moderation verification channel is automatically created.
4. Staff members can:
   - approve the verification request
   - reject the verification request
   - blacklist the member
   - open a private discussion channel with the member to request additional information

5. If approved, the verified role is automatically assigned.

---

## 🛡️ Spam detection

The bot can monitor suspicious activity.

Use:

\`/setup-spam-detection\`

to configure:

- detection activation
- alert channel
- moderation role mention
- detection thresholds

When suspicious activity is detected, moderation alerts are automatically sent.

---

## 👤 Manual member verification

You can manually verify a member, whether they are already on the server or not.

Use:

\`/verify-member\`

with a Discord user ID.

The bot will:

- immediately assign the verified role if the member is already on the server
- automatically verify them later if they join the server

---

## 🔎 Member analysis

Use:

\`/check-member\`

to analyze a Discord account.

This command allows you to:

- view the servers where the member is present (limited to servers where the bot is installed)
- identify whether the member has been blacklisted
- view blacklist reasons recorded on each server
- help moderators identify suspicious users across multiple communities

---

# 🎭 Reaction Roles — User Guide

## 📂 Step 1 — Create a category

Before adding roles, you need to create a category to group them.

\`\`\`
/role-category action:create name:animal
\`\`\`

A category represents a thematic group of roles (e.g. animals, languages, interests...).

## ➕ Step 2 — Add roles to the category

For each role you want to offer to members, use:

\`\`\`
/role-manage action:add categorie:animal role:@fox description:Fox emoji:🦊
/role-manage action:add categorie:animal role:@dog description:Dog emoji:🐕
/role-manage action:add categorie:animal role:@cat description:Cat emoji:🐈
\`\`\`

> **Note:** Custom server emojis are also supported. Copy their identifier from Discord in the format \`<:emojiname:123456789>\`.

## 📢 Step 3 — Publish the panel

Once your roles are configured, publish the panel in the channel of your choice:

\`\`\`
/role-create categorie:animal channel:#roles
\`\`\`

The bot will then:

1. Create an embed message in the specified channel
2. List the configured roles with their emojis and descriptions
3. Automatically add the corresponding reactions under the message

The result will look like:

> **Roles — animal**
> 🦊 — Fox
> 🐕 — Dog
> 🐈 — Cat

Members simply click a reaction to get the associated role, and click again to remove it.

## ✏️ Edit an existing role

To change the description or emoji of an already configured role:

\`\`\`
/role-manage action:update categorie:animal role:@fox description:Arctic Fox emoji:🦊
\`\`\`

To replace a role with another:

\`\`\`
/role-manage action:update categorie:animal role:@oldrole new_role:@newrole
\`\`\`

The published panel is automatically updated.

## 🗑️ Remove a role from the panel

\`\`\`
/role-manage action:delete categorie:animal role:@dog
\`\`\`

The panel is automatically updated. If it was the last role in the category, the message is deleted.

## 📋 Rename a category

\`\`\`
/role-category action:update name:animal new_name:animals
\`\`\`

## ❌ Delete a category

\`\`\`
/role-category action:delete name:animal
\`\`\`

This deletes the category, all its configured roles, and the published panel message.

## 🔍 View existing categories

\`\`\`
/role-category-list
\`\`\`

Displays all server categories, the roles they contain, and whether their panel is published.

---

## 🎮 Free games notifications

The bot can automatically publish **free game promotions** from:

- Steam
- Epic Games

Use the free games setup commands to:

- enable or disable notifications
- choose a publication channel
- enable or disable providers

Games are automatically:

- published in the configured channel
- sorted by promotion expiration date
- removed when promotions expire

---

## ⚙️ Server settings overview

Use:

\`/view-settings\`

to display the complete bot configuration for the server, including:

- verification settings
- verification questions
- free games settings

This command provides a centralized overview of all server-specific settings managed by the bot.

---

\`/role-used-msg-delete\` — Automatically deletes any new message that mentions one of the configured roles. Only the server owner is exempt. Useful to prevent abuse of mass mentions such as @everyone.

---

## 🔒 Permissions

Most configuration commands require **Administrator** permissions.
`,

  helpAbout: `
# 🤖 About the bot

This bot provides **member verification**, **spam detection**, **member analysis**, and **free game notifications** for your Discord server.

---

## ⚙️ Server settings overview

Use:

\`/view-settings\`

to display the complete bot configuration for the server, including:

* verification settings
* verification questions
* free games settings

This command provides a centralized overview of all server-specific settings.

---

\`/role-used-msg-delete\` — Automatically deletes any new message mentioning one of the configured roles. The server owner is exempt from this rule. Useful for preventing mass mention abuse such as @everyone.

🔔 Blacklist Join Notifications

Using the \`/setup-blacklist-alerts\` command, the bot can send alerts to a dedicated channel whenever a member joining the server has previously been blacklisted on another server using the bot.

The notification displays the affected servers and the recorded blacklist reason, allowing staff members to be informed immediately and take appropriate action.
`,

  helpVerification: `
## 🔐 Member Verification

### Enable verification

Use:

\`/setup-verification\`

to configure verification for new members.

You can define:

* the verified role assigned upon approval
* the moderation role
* the moderation category
* the maximum verification duration

### Manage verification questions

After enabling verification, you can customize the questions displayed to new members:

* \`/add-verification-question\` → add a question
* \`/edit-verification-question\` → edit an existing question
* \`/delete-verification-question\` → delete a question

All configured questions can be viewed using:

\`/view-settings\`

### How verification works

1. The bot publishes a verification button in the configured channel.
2. A new member clicks the button and answers the configured questions.
3. A verification channel dedicated to moderation is automatically created.
4. The moderation team can:
   * approve the verification request
   * reject the verification request
   * blacklist the member
   * open a private discussion channel with the member to obtain additional information
5. If the request is approved, the verified role is automatically assigned.

---

## 👤 Manual member verification

You can manually verify a member, whether they are already present on the server or not.

Use:

\`/verify-member\`

with the member's Discord ID.

The bot will:

* immediately assign the verified role if the member is already present
* automatically verify them when they join the server later

---

## 🔎 Member analysis

Use:

\`/check-member\`

to analyze a Discord account.

This command allows you to:

* see on which servers the member is present (only servers where the bot is installed)
* determine whether the member has been blacklisted
* view the blacklist reasons recorded on each server
* help moderators identify potentially problematic users across multiple communities
`,

  helpWelcomeMessage: `
## 👋 Welcome messages

The bot can send a custom welcome message to new members of a server.

To configure this message:

1. First write the welcome message in a server channel.
2. Copy that message ID.
3. Use the command:

\`\`\`
/set-welcome-message message_id:<MESSAGE_ID>
\`\`\`

The bot will copy the content of that message and use it when sending the welcome message to new members.

You can write \`{{mention}}\` in the message: the bot will replace it with the new member's mention to ping them.

To test the configured message preview, use:

\`\`\`
/view-welcome-message
\`\`\`

To delete the configured welcome message, use:

\`\`\`
/delete-welcome-message
\`\`\`
`,

  helpSpam: `
## 🛡️ Spam Detection

The bot can monitor suspicious activity.

Use:

\`/setup-spam-detection\`

to configure:

* enabling or disabling spam detection
* the alert channel
* the moderation role mention
* the detection thresholds

When suspicious activity is detected, alerts are automatically sent to the moderation team.
`,

  helpFreeGames: `
## 🎮 Free Game Notifications

The bot can automatically publish promotions for free games from:

* Steam
* Epic Games

The dedicated commands allow you to:

* enable or disable notifications
* choose a publication channel
* enable or disable platforms

Games are automatically:

* published in the configured channel
* sorted by their promotion end date
* removed when the promotion expires
`,

  helpPermissions: `
## 🔒 Permissions

Most configuration commands require **Administrator** permissions.
`,

  helpHiddenCommands: `
  🔎 Hidden Commands
Write these commands like this:
\`!basi jail <id>\` : allows you to put the member with id \`<id>\` into prison (adapt \`<id>\` to the member)
\`!basi hornyjail <id>\` : allows you to put the member with id \`<id>\` into horny jail (adapt \`<id>\` to the member)
\`!basi bellyjail <id>\` : allows you to put the member with id \`<id>\` into belly jail (adapt \`<id>\` to the member)
\`!basi basijail <id>\` : allows you to put the member with id \`<id>\` into basi jail (adapt \`<id>\` to the member)
\`!basi bonk <id>\` : allows you to bonk the member with id \`<id>\` (adapt \`<id>\` to the member)
  `,

  helpReactionRoles: `
# 🎭 Reaction Roles — User Guide

Reaction roles allow your members to assign or remove roles themselves by clicking on an emoji reaction under a message.

---

## 📂 Step 1 — Create a category

Before adding roles, you must create a category to group them together.

\`\`\`
/role-category action:create name:animal
\`\`\`

A category represents a thematic group of roles (e.g. animals, languages, interests...).

---

## ➕ Step 2 — Add roles to the category

For each role you want to offer to members, use:

\`\`\`
/role-manage action:add category:animal role:@fox description:Fox emoji:🦊
/role-manage action:add category:animal role:@dog description:Dog emoji:🐕
/role-manage action:add category:animal role:@cat description:Cat emoji:🐈
\`\`\`

> **Note:** Custom server emojis are also supported. Copy their identifier from Discord in the format \`<:emojiname:123456789>\`.

---

## 📢 Step 3 — Publish the panel

Once your roles are configured, publish the panel in the channel of your choice:

\`\`\`
/role-create category:animal channel:#roles
\`\`\`

The bot will then:

1. Create an embed message in the specified channel
2. List the configured roles along with their emojis and descriptions
3. Automatically add the corresponding reactions below the message

The result will look like this:

> **Roles — animal**
> 🦊 — Fox
> 🐕 — Dog
> 🐈 — Cat

Members simply need to click on a reaction to obtain the associated role, and click it again to remove it.

---

## ✏️ Edit an existing role

To change the description or emoji of an already configured role:

\`\`\`
/role-manage action:update category:animal role:@fox description:Arctic Fox emoji:🦊
\`\`\`

To replace one role with another:

\`\`\`
/role-manage action:update category:animal role:@oldrole new_role:@newrole
\`\`\`

The published panel is automatically updated.

---

## 🗑️ Remove a role from the panel

\`\`\`
/role-manage action:delete category:animal role:@dog
\`\`\`

The panel is automatically updated. If it was the last role in the category, the message is deleted.

---

## 📋 Rename a category

\`\`\`
/role-category action:update name:animal new_name:animals
\`\`\`

---

## ❌ Delete a category

\`\`\`
/role-category action:delete name:animal
\`\`\`

This deletes the category, all its configured roles, and the published panel message.

---

## 🔍 View existing categories

\`\`\`
/role-category-list
\`\`\`

Displays all categories on the server, the roles they contain, and whether their panel has been published.
`,

  commandMustBeUsedInServer: "This command must be used inside a server",
  actionMustBeUsedInServer: "This action must be used inside a server",
  commandMustBeUsedInTextChannel: "This command must be used in a text channel",
  onlyStaffCanUseCommand: "Only staff members can use this command",
  onlyStaffCanUseButtons: "Only staff members can use these buttons",
  verificationNotConfigured: "Verification is not configured for this server",
  verificationSettingsSaved: "Verification settings saved for this server",
  verificationSettingsSavedAndPanelPosted:
    "Verification settings saved and panel posted successfully",
  verificationRequestSent:
    "Your verification request has been sent to the staff team",
  configuredStaffCategoryNotFound:
    "The configured staff category could not be found",
  configuredPanelChannelInvalid:
    "The current channel is not a valid text channel for the verification panel",
  notAllowedConfigureVerification:
    "You are not allowed to configure verification on this server",
  notAllowedManageQuestions:
    "You are not allowed to manage verification questions on this server",
  noVerificationQuestions:
    "No verification questions are configured for this server",
  tooManyVerificationQuestions:
    "Too many verification questions are configured for this server. Discord modals support a maximum of 5 components",
  blacklistedCannotAccess:
    "You are blacklisted and cannot access this server",
  alreadyVerifiedRoleRestored:
    "You have already been verified before. The verified role has been restored automatically",
  targetMemberNoLongerInServer:
    "The target member is no longer in the server",
  imageRequired: "An image is required",
  errorOccurred: "An error occurred",
  noQuestionFound: (index: number) => `No question found at index ${index}`,
  questionUpdatedSuccessfully: (index: number) => `Question ${index} updated successfully`,
  questionDeletedSuccessfully: (index: number) => `Question ${index} deleted successfully`,
  alreadyBeenVerifiedBefore: "You have already been verified before. The @verified role has been restored automatically",
  userUnknownToTheBot: (targetUserId: string) => `User ${targetUserId} is unknown to the bot`,
  NoAuthorizedServerFoundInSetupVerificationPermissions: "No authorized servers were found in setup_verification_permissions",
  CommandReservedByBasilic: "This command can only by used by \@basilicayakashifr",
  YouCannotConfigureMoreThanFiveQuestions: "You cannot configure more than 5 verification questions because Discord modals are limited to 5 components",
  QuestionAddedAtIndex: (index: number) => `Question added at index ${index}`,
  YouAreNotAllowedToViewVerificationQuestionsOnThisServer: "You are not allowed to view verification questions on this server",
  YouAreNotAllowedtoEditVerificationQuestionsOnThisServer: "You are not allowed to edit verification questions on this server",
  VerifiedUserFound: (user_id: string, username: string, verified_at: string, verified_by: string) => `
            **Verified user found**

            **User ID:** ${user_id}
            **Username:** ${username}
            **Verified at:** ${verified_at}
            **Verified by:** ${verified_by}
            `,
  globalKickHeader: (userId: string) => `**Global kick results for** \`${userId}\``,
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
  questionIndexDescription: "Question index shown by /view-settings",
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
  spamAlertChannelRequired: "You must provide an alert channel when enabling spam detection",
  spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Spam detection enabled.\nAlert channel: <#${channelId}>${staffRoleId ? `\nStaff role: <@&${staffRoleId}>` : ""
    }`,
  spamDetectionDisabled: "✅ Spam detection disabled",
  memberPresentOnServers: (servers: string) => `📡 Member found on the following servers:\n${servers}`,
  memberBlacklistedOnServers: (servers: string) => `⚠️ Member is blacklisted on the following servers:\n${servers}`,
  blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) was blacklisted, but could not be kicked from the server`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) was blacklisted and kicked from the server`,
  spamInfoNombre: "Number of messages required to trigger an alert",
  spamInfoDuree: "Duration in seconds of the detection window",
  DelaiDescriptionCommande: "Time limit in hours to submit verification responses",
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
  ) => `**Current bot configuration**

## Verification

1) Verified role: ${verifiedRoleDisplay}
2) Moderation role: ${staffRoleDisplay}
3) Verification timeout: ${verificationTimeoutHours} hour(s)
4) ${BlcklistAlertChannel}

## Auto-kick
${autokickSettings_days < 1 ? "No members will be auto-kicked when joining the server" : `Members who join with an account created within the last ${autokickSettings_days} days will be auto-kicked`}

${questionsText}

${roleMsgDeleteText}

## Free games

1) Enabled: ${freeGamesEnabled ? "yes" : "no"}
2) Publication channel: ${freeGamesChannel}
3) Steam: ${includeSteam ? "yes" : "no"}
4) Epic Games: ${includeEpicGames ? "yes" : "no"}`,
  NotAuthorizedServer: "The server has not been authorized, it is impossible to use any command",
  ManualVerificationProcessed: (
    targetUserId: string,
    existingVerification: boolean,
    targetMember: boolean,
    roleAdded: boolean
  ) =>
    `✅ Manual verification processed for \`${targetUserId}\`.\n` +
    `- Pending verification removal: completed\n` +
    `- verified_users entry: ${existingVerification ? "already existed" : "added"
    }\n` +
    `- Verified role: ${targetMember
      ? roleAdded
        ? "added"
        : "already present"
      : "not added, member not present on the server"
    }`,

  NoMembersFoundWithRoleCount: (count: number) => `No members found with exactly ${count} role(s)`,
  MembersWithRoleCountTitle: (count: number) => `**Members having exactly ${count} role(s)**`,
  freeGamesManualPublishSettingsDeleted: "Manual publish settings deleted",
  freeGamesManualPublishSettingsSaved: "Manual publish settings saved",
  none: "None",
  SuppressionAutomatiqueMessageMentionRoleActivee: (rolesDisplay: string) => `✅ Deletion enabled for messages mentioning: ${rolesDisplay}`,
  SuppressionAutomatiqueMessageMentionRoleDesctivee: `✅ Deletion disabled`,
  FournirAuMoinsUnRole: "You must provide at least one role to mention to enable automatic deletion",
  AucunRole: "No role",
  RoleIntrouvable: (roleDisplay: string) => `Role not found (\`${roleDisplay}\`)`,
  AffichageParametrageSuppressionMessageRolesUtilises: (enabled: boolean, rolesDisplay: string) => `## 🚫 Deleting Messages by Role
      
      **Activated  :** ${enabled ? "yes" : "no"}
      **Monitored roles :** ${rolesDisplay}
      `,
  unknownServer: "Unknown server",
  Serveur: "Server",
  by: "By",
  reason: "Reason",
  verificationAlreadyInProgress: "⏳ Your verification is already being processed by the staff",
  allowManageQuestionsDescription: "Allow a user to manage verification questions for a specific server",
  choiceLongText: "Long text",
  verificationTimeoutHoursDescription: "Time limit in hours to submit verification answers",
  spamDetectionDisabledOptionDescription: "Disable spam detection",
  spamAlertRoleDescription: "Staff role to mention in spam alerts",
  questionAdded: "Question added",
  questionDeleted: "Question deleted",
  questionUpdated: "Question updated",
  noQuestionsToDelete: "No questions to delete",
  noQuestionsToEdit: "No questions to edit",
  invalidQuestionIndex: "Invalid question index",
  verificationSettingsNotConfigured: "Verification settings are not configured",
  blacklistReasonRequired: "A blacklist reason is required",
  memberNotFound: "Member not found",
  memberAlreadyBlacklisted: "This member is already blacklisted",
  memberBlacklistRemoved: "Member removed from blacklist",
  memberNotBlacklisted: "This member is not blacklisted",
  spamDetectionSaved: "Spam detection settings saved",
  reactionRoleCategoryCreated: (name: string) => `Category **${name}** created`,
  reactionRoleCategoryAlreadyExists: (name: string) => `Category **${name}** already exists`,
  reactionRoleCategoryNotFound: (name: string) => `Category **${name}** not found`,
  reactionRoleNewNameRequired: "`new_name` parameter is required for update",
  reactionRoleCategoryRenamed: (oldName: string, newName: string) => `Category renamed **${oldName}** → **${newName}**`,
  reactionRoleCategoryDeleted: (name: string) => `Category **${name}** and all its roles have been deleted`,
  reactionRoleDescriptionAndEmojiRequired: "`description` and `emoji` are required for add",
  reactionRoleAlreadyInCategory: (role: string, category: string) => `Role ${role} is already in category **${category}**. Use \`action:update\` to modify it`,
  reactionRoleAdded: (role: string, category: string, emoji: string) => `Role ${role} added to **${category}** with emoji ${emoji}`,
  reactionRoleUpdated: (role: string, category: string) => `Role ${role} updated in **${category}**`,
  reactionRoleRemoved: (role: string, category: string) => `Role ${role} removed from **${category}**`,
  reactionRolePanelPublished: (category: string, channel: string) => `Panel **${category}** published in ${channel}`,
  reactionRoleNoCategoryConfigured: "No category configured on this server",
  reactionRoleCategoriesTitle: "Reaction role categories",
  reactionRoleNoRole: "*No role*",
  reactionRolePanelPublishedIn: (channelId: string) => `\n📌 Panel published in <#${channelId}>`,
  reactionRolePanelNotPublished: "*(panel not published)*",
  welcomeMessageSaved: "✅ Welcome message saved",
  welcomeMessageDeleted: "✅ Welcome message deleted",
  welcomeMessageNoneConfigured: "❌ No welcome message configured for this server",
  welcomeMessageNotFound: "❌ Message not found. Verifies that the message ID is correct and that the bot has access to the room",
  blacklistJoinNotificationsEnabled: (channelId: string) => `Notifications enabled in <#${channelId}>`,
  ChannelMustBeTextChannel: "The channel must be a text channel",
  viewSettingsBlacklistNotificationChannel: (channel: string) => `Blacklisted member notification channel: ${channel}`,
  AutokickSettingsUpdated: "Registration Complete",
  helpAutokick: `The auto kick feature monitors new members joining the server.
The \`/autokick-newmembers\` command lets you set an integer value: the number of days. Every time someone joins, the bot checks the age of their account (the account creation date). If the account age is less than the configured number of days, the member will be automatically kicked.
If you set 0 days, the auto kick feature is disabled`,
};

const en_out: MessagesOut = {
  YourVerifiedStatusRestored: (guild_name: string) => `Hello, your verified status on **${guild_name}** has been automatically restored`,
  YourVerifiedStatusAccepted: (guild_name: string) => `Hello, your verification on **${guild_name}** has been accepted. The @verified role has been assigned to you`,
  YourVerifiedStatusDenied: (guild_name: string) => `Hello, your verification request on **${guild_name}** has been denied`,
  YourVerifiedStatusDeniedAndBlackedListed: (guild_name: string) => `Hello, your verification request on **${guild_name}** has been denied and your account has been blacklisted`,
  MsgBlacklisted: (guild_name: string) => `Hello, you are blacklisted and cannot join **${guild_name}**`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Your verification request for ${guildName} was denied and you have been blacklisted.\nReason: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Your verification request for ${guildName} was denied.\nReason: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `You have been kicked from **${guildName}** because you did not complete the verification in time`,
};

const en_server: MessagesServer = {
  startVerificationButton: "Start verification",
  startVerificationMessage: "Click the button below to start your verification",

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

  newVerificationRequest: "New verification request",
  memberLabel: "Member",
  tagLabel: "Tag",
  accountCreatedOnLabel: "Account created on",
  accountAgeLabel: "Account age",

  verificationWaiting: (staffRoleId: string) => `<@&${staffRoleId}> a verification request is waiting`,
  verificationAcceptedBy: (staffId: string, targetId: string) => `✅ Verification accepted by <@${staffId}> for <@${targetId}>`,
  verificationDeniedBy: (staffId: string, targetId: string) => `❌ Verification denied by <@${staffId}> for <@${targetId}>`,
  userBlacklistedBy: (staffId: string, targetId: string) => `⛔ User <@${targetId}> was blacklisted by <@${staffId}>`,

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
  spamAlertMessage: "suspicious activity detected, manual review recommended",
  discussMemberButton: "Discuss with member",
  discussionChannelIntro: (targetId: string) => `This private channel allows staff to discuss with <@${targetId}> about their verification request`,
  discussionChannelAlreadyExists: (channelId: string) => `A discussion channel already exists: <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Discussion channel created: <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Verification submission timeout exceeded",
  verificationTimeoutDM: (guildName: string) => `You have been kicked from **${guildName}** because you did not complete the verification in time`,
  verificationTimeoutDisabled: "No verification timeout configured",
  verificationTimeoutSet: (hours: number) => `Verification timeout set to ${hours} hour(s)`,
  spamFalsePositiveConfirmed: "✅ False positive confirmed",
  spamUserBanned: "🔨 User banned",
  checkMemberBlacklistedOn: (lines: string) => `⛔ User blacklisted on:\n\n${lines}`,
  by: "By",
  reason: "Reason",
  reactionRolePanelTitle: (category: string) => `Roles — ${category}`,
  reactionRolePanelEmpty: "No roles have been configured for this category",
  blacklistServerMessage: (guildName: string, timestamp: string, blacklisted_by: string, reason: string) => `• Server : ${guildName}
  Date : ${timestamp}
  By : ${blacklisted_by}
  Reason : ${reason}`,

  blackListedMemberFound: (memberTag: string, memberId: string, msgLines: string) => `⚠️ **New member already blacklisted elsewhere**
  
  Member : ${memberTag} (${memberId} - <@${memberId}>)

  ${msgLines}
  `,

  masterPet: {
    alreadyDeclared: (role) =>
      `You are already declared as a ${role}`,

    declaredSuccess: (role) =>
      `You are now declared as a ${role}`,

    undeclaredSuccess: (role) =>
      `You are no longer declared as a ${role}`,

    cannotTargetSelf:
      "You cannot target yourself.",

    cannotTargetBot:
      "Bots cannot participate in master/pet relationships.",

    mustDeclareMasterFirst:
      "You must declare yourself as a master before sending this request.",

    mustDeclarePetFirst:
      "You must declare yourself as a pet before sending this request.",

    alreadyLinked:
      "You are already linked with this member.",

    noLinkFound:
      "No master/pet relationship exists with this member.",

    unlinkSuccess: (targetId) =>
      `Your relationship with <@${targetId}> has been removed`,

    accept: "Accept",
    decline: "Decline",

    requestPetSent: (requesterId, targetId) =>
      `<@${targetId}>, <@${requesterId}> would like you to become their pet`,

    requestMasterSent: (requesterId, targetId) =>
      `<@${targetId}>, <@${requesterId}> would like you to become their master`,

    requestExpired:
      "This request no longer exists.",

    notYourRequest:
      "This request is not addressed to you.",

    requestAccepted: (requesterId, targetId) =>
      `Relationship successfully created between <@${requesterId}> and <@${targetId}>`,

    requestDeclined: (requesterId, targetId) =>
      `<@${targetId}> declined the request from <@${requesterId}>`,

    memberNotFound: 'Member not found',

    targetDmClosed: 'This member has their DMs closed, the request could not be sent',
    requestSentConfirmation: 'Your request has been sent by direct message',
    roleMaster: 'Master',
    rolePet: 'Pet',
    noRoleDeclared: 'No role declared',
    noneLabel: 'None',
    profileSummary: (userId, roles, masters, pets) => `**Profile of <@${userId}>**
    Declared role(s): ${roles}
    Master(s): ${masters}
    Pet(s): ${pets}`,

    invalidSymbol: 'This symbol is not valid. Use a Unicode emoji or a server emoji.',
    symbolAlreadyTaken: 'This symbol has already been claimed by another master.',
    symbolClaimed: (symbol) => `You claimed the symbol ${symbol}.`,
    symbolRemoved: 'Your symbol has been released.',
    invalidChannel: 'This channel does not support message reading.',
    referenceMessageNotFound: 'Message not found in this channel.',
    referenceMessageSet: 'The reference message has been set successfully.',
    noSymbolsClaimed: 'No symbols have been claimed yet.',
    masterSymbolsTableTitle: '📋 Master symbols',
    symbolColumnHeader: 'Symbol',
    masterColumnHeader: 'Master',
  }
};

const en_internal: MessagesInternal = {
  kickReasonBlacklistedStart: "Blacklisted user attempted to start verification",
  kickReasonAuto: "Blacklisted user auto-kicked on join",
  kickReasonDenied: "Verification denied by staff",
  kickReasonBlacklisted: "User blacklisted by staff during verification",
  memberAlreadyVerifiedPreviously: "Member was already verified previously",
  blacklistedDuringVerification: "Blacklisted during verification",
  verifiedBy: (staffTag: string) => `Verified by ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) => `Global kick requested by ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Blacklisted during verification: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Verification denied: ${reason}`,
  verificationTimeoutKickReason: "Verification submission timeout exceeded",
  verificationChannelClosed: "Verification decision finalized",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Blacklisted by ${moderatorTag}${reason ? ` | Reason: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam confirmed by ${moderatorTag}`,
};

export default { en_in, en_out, en_server, en_internal };