import {
  ActionRowBuilder,
  ButtonBuilder,
  FileUploadBuilder,
  LabelBuilder,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

import { deletePendingVerificationSubmissionStmt } from "../database/sql.js";

export type VerificationFlowDeps = {
  client: any;

  getVerifiedUserStmt: any;
  insertVerifiedUserStmt: any;

  getBlacklistedUserStmt: any;
  getGuildVerificationSettingsStmt: any;
  getGuildVerificationQuestionsStmt: any;

  buildDisabledDecisionButtonsRow: (
    finalAction: "approved" | "rejected" | "blacklisted",
    msgServer: any
  ) => ActionRowBuilder<ButtonBuilder>;

  blacklistMemberInGuild: (params: {
    guild: any;
    targetUserId: string;
    moderatorId: string;
    moderatorTag: string;
    reason?: string | null;
    username?: string | null;
    msgInternal: any;
  }) => Promise<{ kicked: boolean; username: string }>;

  isUsedOnAServer: (interaction: any) => boolean;
  isAdministrator: (member: any, interaction: any) => boolean;
  
  buildDecisionButtonsRow: (
	  userId: string,
	  msgServer: any 
  ) => ActionRowBuilder<ButtonBuilder>;

	formatAccountAge: (createdAt: Date, msgServer: any) => string;
};

export async function handleVerificationButtons({
  interaction,
  deps,
  msgIn,
  msgOut,
  msgServer,
  msgInternal,
}: {
  interaction: any;
  deps: VerificationFlowDeps;
  msgIn: any;
  msgOut: any;
  msgServer: any;
  msgInternal: any;
}) {
  if (!interaction.isButton()) return false;
  if (!deps.isUsedOnAServer(interaction)) return false;

  if (interaction.customId === "start_verification") {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    const blacklistedUser = deps.getBlacklistedUserStmt.get(
      interaction.guild.id,
      member.id
    );

    if (blacklistedUser) {
      await interaction.reply({
        content: msgIn.blacklistedCannotAccess,
        flags: MessageFlags.Ephemeral,
      });

      if (member.kickable) {
        await member.kick(msgInternal.kickReasonBlacklistedStart);
      }

      return true;
    }

    const existingVerification = deps.getVerifiedUserStmt.get(member.id);
    const guildSettings = deps.getGuildVerificationSettingsStmt.get(interaction.guild.id);

    if (!guildSettings) {
      await interaction.reply({
        content: msgIn.verificationNotConfigured,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    if (existingVerification) {
      if (!member.roles.cache.has(guildSettings.verified_role_id)) {
        await member.roles.add(
          guildSettings.verified_role_id,
          msgInternal.memberAlreadyVerifiedPreviously
        );
      }

      deletePendingVerificationSubmissionStmt.run(interaction.guild.id, member.id);

      try {
        await member.send(msgOut.YourVerifiedStatusRestored(interaction.guild.name));
      } catch {}

      await interaction.reply({
        content: msgIn.alreadyBeenVerifiedBefore,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    const questions = deps.getGuildVerificationQuestionsStmt.all(
      interaction.guild.id
    );

    if (questions.length === 0) {
      await interaction.reply({
        content: msgIn.noVerificationQuestions,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    const modal = new ModalBuilder()
      .setCustomId("verification_modal")
      .setTitle(msgServer.verificationModalTitle);

    const labelComponents: Array<LabelBuilder> = [];

    for (const question of questions) {
      if (question.question_type === "text_short") {
        const input = new TextInputBuilder()
          .setCustomId(question.question_key)
          .setPlaceholder(msgServer.answerPlaceholder)
          .setStyle(TextInputStyle.Short)
          .setRequired(question.required === 1)
          .setMaxLength(200);

        labelComponents.push(
          new LabelBuilder()
            .setLabel(question.question_label)
            .setTextInputComponent(input)
        );
        continue;
      }

      if (question.question_type === "text_paragraph") {
        const input = new TextInputBuilder()
          .setCustomId(question.question_key)
          .setPlaceholder(msgServer.answerPlaceholder)
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(question.required === 1)
          .setMaxLength(1000);

        labelComponents.push(
          new LabelBuilder()
            .setLabel(question.question_label)
            .setTextInputComponent(input)
        );
        continue;
      }

      if (question.question_type === "file_image") {
        const upload = new FileUploadBuilder()
          .setCustomId(question.question_key)
          .setMinValues(question.required === 1 ? 1 : 0)
          .setMaxValues(1)
          .setRequired(question.required === 1);

        labelComponents.push(
          new LabelBuilder()
            .setLabel(question.question_label)
            .setDescription(msgServer.uploadOneImage)
            .setFileUploadComponent(upload)
        );
      }
    }

    modal.addLabelComponents(...labelComponents);
    await interaction.showModal(modal);
    return true;
  }

  if (
    interaction.customId.startsWith("staff_validate_") ||
    interaction.customId.startsWith("staff_refuse_") ||
    interaction.customId.startsWith("staff_blacklist_") ||
	interaction.customId.startsWith("staff_discuss_")
  ) {
    const staffMember = await interaction.guild.members.fetch(interaction.user.id);
    const guildSettings = deps.getGuildVerificationSettingsStmt.get(interaction.guild.id);

    if (!guildSettings) {
      await interaction.reply({
        content: msgIn.verificationNotConfigured,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    if (
      !staffMember.roles.cache.has(guildSettings.staff_role_id) &&
      !deps.isAdministrator(staffMember, interaction)
    ) {
      await interaction.reply({
        content: msgIn.onlyStaffCanUseButtons,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }
	
    if (interaction.customId.startsWith("staff_refuse_")) {
      const targetUserId = interaction.customId.replace("staff_refuse_", "");

      const modal = new ModalBuilder()
        .setCustomId(`staff_refuse_modal_${targetUserId}`)
        .setTitle(msgServer.rejectModalTitle);

      const reasonInput = new TextInputBuilder()
        .setCustomId("reject_reason")
        .setLabel(msgServer.rejectReasonLabel)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(500)
        .setPlaceholder(msgServer.rejectReasonPlaceholder);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
      );

      await interaction.showModal(modal);
      return true;
    }

    const isValidate = interaction.customId.startsWith("staff_validate_");
    const isBlacklist = interaction.customId.startsWith("staff_blacklist_");
	const isDiscuss = interaction.customId.startsWith("staff_discuss_");

    const targetUserId = interaction.customId
      .replace("staff_validate_", "")
      .replace("staff_refuse_", "")
      .replace("staff_blacklist_", "")
	  .replace("staff_discuss_", "");

    let targetMember;
    try {
      targetMember = await interaction.guild.members.fetch(targetUserId);
    } catch {
      await interaction.reply({
        content: msgIn.targetMemberNoLongerInServer,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    if (isBlacklist) {
      const modal = new ModalBuilder()
        .setCustomId(`staff_blacklist_modal_${targetUserId}`)
        .setTitle(msgServer.blacklistModalTitle);

      const reasonInput = new TextInputBuilder()
        .setCustomId("blacklist_reason")
        .setLabel(msgServer.blacklistReasonLabel)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(500)
        .setPlaceholder(msgServer.blacklistReasonPlaceholder);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
      );

      await interaction.showModal(modal);
      return true;
    }

    if (isValidate) {
      const nowIso = new Date().toISOString();

      deps.insertVerifiedUserStmt.run(
        targetMember.id,
        targetMember.user.tag,
        nowIso,
        `${staffMember.user.tag} (${staffMember.id})`
      );

      if (!targetMember.roles.cache.has(guildSettings.verified_role_id)) {
        await targetMember.roles.add(
          guildSettings.verified_role_id,
          msgInternal.verifiedBy(staffMember.user.tag)
        );
      }

      try {
        await targetMember.send(msgOut.YourVerifiedStatusAccepted(interaction.guild.name));
      } catch {}

      await interaction.update({
        content:
          `${interaction.message.content}\n\n` +
          msgServer.verificationAcceptedBy(staffMember.id, targetMember.id),
        components: [deps.buildDisabledDecisionButtonsRow("approved", msgServer)],
      });

      await deleteDiscussionChannelIfExists(interaction.guild, targetMember.id, msgInternal);
      return true;
    }
	
	if (isDiscuss) {
	  const existingDiscussion = interaction.guild.channels.cache.find(
		(channel: any) =>
		  channel.type === ChannelType.GuildText &&
		  channel.parentId === interaction.channel.parentId &&
		  channel.topic === `verification-discussion:${targetUserId}`
	  );

	  if (existingDiscussion) {
		await interaction.reply({
		  content: msgServer.discussionChannelAlreadyExists(existingDiscussion.id),
		  flags: MessageFlags.Ephemeral,
		});
		return true;
	  }

	  const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);

	  if (!targetMember) {
		await interaction.reply({
		  content: msgIn.targetMemberNoLongerInServer,
		  flags: MessageFlags.Ephemeral,
		});
		return true;
	  }

	  const discussionChannel = await interaction.guild.channels.create({
		name: `${msgServer.discussionChannelNamePrefix}-${targetMember.user.username}`
		  .toLowerCase()
		  .replace(/[^a-z0-9-]/g, "")
		  .slice(0, 90),
		type: ChannelType.GuildText,
		parent: interaction.channel.parentId ?? undefined,
		topic: `verification-discussion:${targetUserId}`,
		permissionOverwrites: [
		  {
			id: interaction.guild.roles.everyone.id,
			deny: [PermissionFlagsBits.ViewChannel],
		  },
		  {
			id: guildSettings.staff_role_id,
			allow: [
			  PermissionFlagsBits.ViewChannel,
			  PermissionFlagsBits.SendMessages,
			  PermissionFlagsBits.ReadMessageHistory,
			  PermissionFlagsBits.AttachFiles,
			],
		  },
		  {
			id: targetMember.id,
			allow: [
			  PermissionFlagsBits.ViewChannel,
			  PermissionFlagsBits.SendMessages,
			  PermissionFlagsBits.ReadMessageHistory,
			  PermissionFlagsBits.AttachFiles,
			],
		  },
		  {
			id: deps.client.user!.id,
			allow: [
			  PermissionFlagsBits.ViewChannel,
			  PermissionFlagsBits.SendMessages,
			  PermissionFlagsBits.ReadMessageHistory,
			  PermissionFlagsBits.AttachFiles,
			  PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.MentionEveryone,
			],
		  },
		],
	  });

	  await (discussionChannel as TextChannel).send({
		content: msgServer.discussionChannelIntro(targetMember.id),
	  });

	  await interaction.reply({
		content: msgServer.discussionChannelCreated(discussionChannel.id),
		flags: MessageFlags.Ephemeral,
	  });

	  return true;
	}

    try {
      await targetMember.send(msgOut.YourVerifiedStatusDenied(interaction.guild.name));
    } catch {}

    await interaction.update({
      content:
        `${interaction.message.content}\n\n` +
        msgServer.verificationDeniedBy(staffMember.id, targetMember.id),
      components: [deps.buildDisabledDecisionButtonsRow("rejected", msgServer)],
    });

    if (targetMember.kickable) {
      await targetMember.kick(msgInternal.kickReasonDenied);
    }

    return true;
  }

  return false;
}

async function deleteDiscussionChannelIfExists(
  guild: any,
  targetUserId: string,
  msgInternal: any
) {
  const discussionChannel = guild.channels.cache.find(
    (channel: any) =>
      channel.type === ChannelType.GuildText &&
      channel.topic === `verification-discussion:${targetUserId}`
  );

  if (discussionChannel) {
    await discussionChannel
      .delete(msgInternal.verificationChannelClosed)
      .catch(() => null);
  }
}

export async function handleVerificationModals({
  interaction,
  deps,
  msgIn,
  msgOut,
  msgServer,
  msgInternal,
}: {
  interaction: any;
  deps: VerificationFlowDeps;
  msgIn: any;
  msgOut: any;
  msgServer: any;
  msgInternal: any;
}) {
  if (!interaction.isModalSubmit()) return false;
  if (!deps.isUsedOnAServer(interaction)) return false;

  if (interaction.customId.startsWith("staff_blacklist_modal_")) {
    const staffMember = await interaction.guild.members.fetch(interaction.user.id);
    const guildSettings = deps.getGuildVerificationSettingsStmt.get(interaction.guild.id);

    if (!guildSettings) {
      await interaction.reply({
        content: msgIn.verificationNotConfigured,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    if (
      !staffMember.roles.cache.has(guildSettings.staff_role_id) &&
      !deps.isAdministrator(staffMember, interaction)
    ) {
      await interaction.reply({
        content: msgIn.onlyStaffCanUseButtons,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    const targetUserId = interaction.customId.replace("staff_blacklist_modal_", "");
    const reason = interaction.fields.getTextInputValue("blacklist_reason").trim();

    const result = await deps.blacklistMemberInGuild({
      guild: interaction.guild,
      targetUserId,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      reason,
      msgInternal,
    });

    try {
      const user = await deps.client.users.fetch(targetUserId);
      await user.send(
        msgOut.YourVerifiedStatusDeniedAndBlackedListedWithReason(
          interaction.guild.name,
          reason
        )
      );
    } catch {}

    await interaction.reply({
      content: msgIn.blacklistReasonSaved,
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.channel as TextChannel;
    await channel.send({
      content:
        `${msgServer.userBlacklistedBy(staffMember.id, targetUserId)}\n` +
        `**${msgServer.reasonLabel}:** ${reason}`,
      components: [deps.buildDisabledDecisionButtonsRow("blacklisted", msgServer)],
    });

    if (!result.kicked) {
      await channel.send({
        content: msgIn.blacklistMemberSavedButKickFailed(targetUserId, result.username),
      });
    }

    await deleteDiscussionChannelIfExists(interaction.guild, targetUserId, msgInternal);
    return true;
  }

  if (interaction.customId.startsWith("staff_refuse_modal_")) {
	  const staffMember = await interaction.guild.members.fetch(interaction.user.id);
	  const guildSettings = deps.getGuildVerificationSettingsStmt.get(interaction.guild.id);

	  if (!guildSettings) {
		await interaction.reply({
		  content: msgIn.verificationNotConfigured,
		  flags: MessageFlags.Ephemeral,
		});
		return true;
	  }

	  if (
		!staffMember.roles.cache.has(guildSettings.staff_role_id) &&
		!deps.isAdministrator(staffMember, interaction)
	  ) {
		await interaction.reply({
		  content: msgIn.onlyStaffCanUseButtons,
		  flags: MessageFlags.Ephemeral,
		});
		return true;
	  }

	  const targetUserId = interaction.customId.replace("staff_refuse_modal_", "");
	  const reason = interaction.fields.getTextInputValue("reject_reason").trim();

    let targetMember;
    try {
      targetMember = await interaction.guild.members.fetch(targetUserId);
    } catch {
      await interaction.reply({
        content: msgIn.targetMemberNoLongerInServer,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    try {
      await targetMember.send(
        reason
          ? msgOut.YourVerifiedStatusDeniedWithReason(interaction.guild.name, reason)
          : msgOut.YourVerifiedStatusDenied(interaction.guild.name)
      );
    } catch {}

    await interaction.reply({
      content: msgIn.refusalReasonSaved,
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.channel as TextChannel;
    await channel.send({
      content:
        `${msgServer.verificationDeniedBy(staffMember.id, targetMember.id)}\n` +
        `**${msgServer.reasonLabel}:** ${reason || msgServer.noReasonProvided}`,
      components: [deps.buildDisabledDecisionButtonsRow("rejected", msgServer)],
    });

    if (targetMember.kickable) {
      await targetMember.kick(
        reason
          ? msgInternal.kickReasonDeniedWithReason(reason)
          : msgInternal.kickReasonDenied
      );
    }

    await deleteDiscussionChannelIfExists(interaction.guild, targetMember.id, msgInternal);
    return true;
  }

	if (interaction.customId === "verification_modal") {
	  const member = await interaction.guild.members.fetch(interaction.user.id);
	  
	  deletePendingVerificationSubmissionStmt.run(
		  interaction.guild.id,
		  member.id
		);
		
	  const questions = deps.getGuildVerificationQuestionsStmt.all(
		interaction.guild.id
	  );

	  if (questions.length === 0) {
		await interaction.reply({
		  content: msgIn.noVerificationQuestions,
		  flags: MessageFlags.Ephemeral,
		});
		return true;
	  }

	  const accountAgeText = deps.formatAccountAge(member.user.createdAt, msgServer);
	  const createdTimestamp = Math.floor(member.user.createdAt.getTime() / 1000);

	  const guildSettings = deps.getGuildVerificationSettingsStmt.get(
		interaction.guild.id
	  );

	  if (!guildSettings) {
		await interaction.reply({
		  content: msgIn.verificationNotConfigured,
		  flags: MessageFlags.Ephemeral,
		});
		return true;
	  }

	  const staffCategory = await interaction.guild.channels
		.fetch(guildSettings.staff_category_id)
		.catch(() => null);

	  if (!staffCategory || staffCategory.type !== ChannelType.GuildCategory) {
		await interaction.reply({
		  content: msgIn.configuredStaffCategoryNotFound,
		  flags: MessageFlags.Ephemeral,
		});
		return true;
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
			deny: [PermissionFlagsBits.ViewChannel],
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
			id: deps.client.user!.id,
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

    /*
	  content += `\n${msgServer.verificationWaiting(guildSettings.staff_role_id)}`;

	  await (verificationChannel as TextChannel).send({
		content,
		components: [deps.buildDecisionButtonsRow(member.id, msgServer)],
	  });
    */

    await (verificationChannel as TextChannel).send({
      content,
      components: [deps.buildDecisionButtonsRow(member.id, msgServer)],
    });

    await (verificationChannel as TextChannel).send({
      content: msgServer.verificationWaiting(guildSettings.staff_role_id),
      allowedMentions: { roles: [guildSettings.staff_role_id] },
    });

	  await interaction.reply({
		content: msgIn.verificationRequestSent,
		flags: MessageFlags.Ephemeral,
	  });

	  return true;
	}

  return false;
}