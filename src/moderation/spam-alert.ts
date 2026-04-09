import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
  Locale,
} from "discord.js";

import { getMessagesUser, getMessagesOut, getMessagesServer, getMessagesInternal} from "./../langues/index.js";

type RecentMessage = {
  messageId: string;
  channelId: string;
  channelName: string;
  content: string;
  normalizedContent: string;
  attachmentKeys: string[];
  createdTimestamp: number;
  jumpUrl: string;
};

export type GuildSpamSettings = {
  enabled: number;
  alert_channel_id: string | null;
  staff_role_id: string | null;
  message_threshold: number;
  window_seconds: number;
};

type GetGuildSpamSettings = (guildId: string) => GuildSpamSettings | undefined;

type SpamAlertConfig = {
  getGuildSpamSettings: GetGuildSpamSettings;
  windowMs?: number;
  minDuplicateMessages?: number;
  minDistinctChannels?: number;
  alertCooldownMs?: number;
  maxStoredMessagesPerUser?: number;
  ignoreBots?: boolean;
  ignoreStaff?: boolean;
  ignoreAdmins?: boolean;
};

type SuspicionResult = {
  shouldAlert: boolean;
  score: number;
  reasonLines: string[];
  matchedMessages: RecentMessage[];
};

const DEFAULT_CONFIG = {
  windowMs: 20_000,
  minDuplicateMessages: 3,
  minDistinctChannels: 2,
  alertCooldownMs: 60_000,
  maxStoredMessagesPerUser: 25,
  ignoreBots: true,
  ignoreStaff: true,
  ignoreAdmins: true,
};

export class SpamAlertService {
  private readonly activeAlerts = new Map<string, string>();
  private readonly config: Required<Omit<SpamAlertConfig, "getGuildSpamSettings">> & {
    getGuildSpamSettings: GetGuildSpamSettings;
  };

  private readonly recentByUser = new Map<string, RecentMessage[]>();
  private readonly alertCooldowns = new Map<string, number>();

  public clearActiveAlert(guildId: string, userId: string): void {
    const alertKey = this.buildAlertKey(guildId, userId);
    this.activeAlerts.delete(alertKey);
  }

  constructor(config: SpamAlertConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  private buildAlertKey(guildId: string, userId: string): string {
    return `${guildId}:${userId}`;
  }

  public async handleMessage(message: Message): Promise<void> {
    if (!message.inGuild()) return;

    const guildSettings = this.config.getGuildSpamSettings(message.guild.id);
    if (!guildSettings) return;
    if (guildSettings.enabled !== 1) return;
    if (!guildSettings.alert_channel_id) return;

    if (message.author.bot && this.config.ignoreBots) return;
    if (!message.member) return;

    if (
      this.config.ignoreAdmins &&
      message.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return;
    }

    if (
      this.config.ignoreStaff &&
      guildSettings.staff_role_id &&
      message.member.roles.cache.has(guildSettings.staff_role_id)
    ) {
      return;
    }

    const normalizedContent = normalizeContent(message.content);
    const attachmentKeys = buildAttachmentKeys(message);

    if (!normalizedContent && attachmentKeys.length === 0) return;

    const entry: RecentMessage = {
      messageId: message.id,
      channelId: message.channelId,
      channelName:
        message.channel.type === ChannelType.GuildText ||
        message.channel.type === ChannelType.GuildAnnouncement
          ? message.channel.name
          : "unknown",
      content: message.content,
      normalizedContent,
      attachmentKeys,
      createdTimestamp: message.createdTimestamp,
      jumpUrl: message.url,
    };

    const userId = message.author.id;
    const now = Date.now();

    const previous = this.recentByUser.get(userId) ?? [];
    const windowMs = (guildSettings.window_seconds ?? 20) * 1000;

    const recent = previous
      .filter((m) => now - m.createdTimestamp <= windowMs)
      .slice(-(this.config.maxStoredMessagesPerUser - 1));

    recent.push(entry);
    this.recentByUser.set(userId, recent);

    const locale = message.guild.preferredLocale ?? "en";
    const msgServer = getMessagesServer(locale);

    const suspicion = this.evaluateSuspicion(recent, guildSettings, msgServer);
    if (!suspicion.shouldAlert) return;

    const cooldownKey = this.buildCooldownKey(userId, suspicion.matchedMessages);
    const nextAllowedAt = this.alertCooldowns.get(cooldownKey) ?? 0;

    if (now < nextAllowedAt) return;
    this.alertCooldowns.set(cooldownKey, now + this.config.alertCooldownMs);

    const alertKey = this.buildAlertKey(message.guild.id, userId);
    if (this.activeAlerts.has(alertKey)) {
      return;
    }

    // Réserve immédiatement l'alerte pour éviter les doublons
    this.activeAlerts.set(alertKey, "pending");

    try {
      await this.sendAlert(message, suspicion, guildSettings);
    } catch (error) {
      this.activeAlerts.delete(alertKey);
      throw error;
    }
  }

  private evaluateSuspicion(
    messages: RecentMessage[],
    guildSettings: GuildSpamSettings,
    msgServer: ReturnType<typeof getMessagesServer>
  ): SuspicionResult {
    let best: SuspicionResult = {
      shouldAlert: false,
      score: 0,
      reasonLines: [],
      matchedMessages: [],
    };

    const byContent = new Map<string, RecentMessage[]>();
    for (const msg of messages) {
      if (!msg.normalizedContent) continue;
      const arr = byContent.get(msg.normalizedContent) ?? [];
      arr.push(msg);
      byContent.set(msg.normalizedContent, arr);
    }

    for (const [, matches] of byContent) {
      const distinctChannels = new Set(matches.map((m) => m.channelId)).size;

      if (
        matches.length >= this.config.minDuplicateMessages &&
        distinctChannels >= this.config.minDistinctChannels
      ) {
        const score = this.scoreTextSpam(matches);
        const candidate: SuspicionResult = {
          shouldAlert: score >= 3,
          score,
          reasonLines: [
            msgServer.spamDuplicateText,
            msgServer.spamChannelsTouched,
          ],
          matchedMessages: matches,
        };

        if (candidate.score > best.score) best = candidate;
      }
    }

    const byAttachmentKey = new Map<string, RecentMessage[]>();
    for (const msg of messages) {
      for (const key of msg.attachmentKeys) {
        const arr = byAttachmentKey.get(key) ?? [];
        arr.push(msg);
        byAttachmentKey.set(key, arr);
      }
    }

    for (const [, matches] of byAttachmentKey) {
      const distinctChannels = new Set(matches.map((m) => m.channelId)).size;

      if (
        matches.length >= this.config.minDuplicateMessages &&
        distinctChannels >= this.config.minDistinctChannels
      ) {
        const score = this.scoreAttachmentSpam(matches);
        const candidate: SuspicionResult = {
          shouldAlert: score >= 3,
          score,
          reasonLines: [
            msgServer.spamDuplicateFile(matches.length),
            msgServer.spamChannelsTouched,
          ],
          matchedMessages: matches,
        };

        if (candidate.score > best.score) best = candidate;
      }
    }

    if (messages.length >= guildSettings.message_threshold) {
      const distinctChannels = new Set(messages.map((m) => m.channelId)).size;
      const candidate: SuspicionResult = {
        shouldAlert: true,
        score: 3,
        reasonLines: [
          msgServer.spamHighVolume(messages.length),
          msgServer.spamChannelsTouched,
        ],
        matchedMessages: messages,
      };

      if (candidate.score > best.score) best = candidate;
    }

    return best;
  }

  private scoreTextSpam(matches: RecentMessage[]): number {
    const distinctChannels = new Set(matches.map((m) => m.channelId)).size;
    const sample = matches[0];
    let score = 0;

    score += 2;
    if (matches.length >= 4) score += 1;
    if (distinctChannels >= 3) score += 1;
    if (containsInviteOrLink(sample.content)) score += 2;
    if (sample.content.trim().length >= 25) score += 1;
    if (sample.content.trim().length <= 6) score -= 1;

    return Math.max(score, 0);
  }

  private scoreAttachmentSpam(matches: RecentMessage[]): number {
    const distinctChannels = new Set(matches.map((m) => m.channelId)).size;
    let score = 0;

    score += 2;
    if (matches.length >= 4) score += 1;
    if (distinctChannels >= 3) score += 1;

    return score;
  }

  private buildCooldownKey(userId: string, matches: RecentMessage[]): string {
    const ids = matches
      .map((m) => m.messageId)
      .sort()
      .slice(-5)
      .join(",");

    return `${userId}:${ids}`;
  }

  private async sendAlert(
    sourceMessage: Message,
    suspicion: SuspicionResult,
    guildSettings: GuildSpamSettings
  ): Promise<void> {
    if (!guildSettings.alert_channel_id) return;
    if (!sourceMessage.inGuild()) return;

    const alertChannel = await sourceMessage.guild.channels
      .fetch(guildSettings.alert_channel_id)
      .catch(() => null);

    if (!alertChannel || !alertChannel.isTextBased()) return;

    const locale = sourceMessage.guild.preferredLocale ?? "en";
    const msgServer = getMessagesServer(locale);

    const matched = [...suspicion.matchedMessages].sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp
    );

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`spam:false_positive:${sourceMessage.guild.id}:${sourceMessage.author.id}`)
      .setLabel(msgServer.spamFalsePositive)
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId(`spam:ban:${sourceMessage.guild.id}:${sourceMessage.author.id}`)
      .setLabel(msgServer.spamBan)
      .setStyle(ButtonStyle.Danger)
  );

    const distinctChannels = [
      ...new Set(matched.map((m) => `<#${m.channelId}>`)),
    ].join(", ");

    const links = matched
      .slice(0, 8)
      .map((m, index) => `[${index + 1}](${m.jumpUrl})`)
      .join(" • ");

    const sampleContent =
      matched[0]?.content?.trim() || msgServer.spamNoContent;

    const embed = new EmbedBuilder()
      .setTitle(msgServer.spamAlertTitle)
      .setDescription(
        [
        `**${msgServer.spamUserLabel} :** <@${sourceMessage.author.id}> (\`${sourceMessage.author.id}\`)`,
        `**${msgServer.spamScoreLabel} :** ${suspicion.score}`,
        `**${msgServer.spamOccurrencesLabel} :** ${matched.length}`,
        `**${msgServer.spamChannelsLabel} :** ${distinctChannels || msgServer.spamUnknown}`,
        "",
        `**${msgServer.spamReasonsLabel} :**`,
        ...suspicion.reasonLines.map((line) => `- ${line}`),
        "",
        `**${msgServer.spamSampleLabel} :**`,
        truncateForEmbed(sampleContent, 300),
        "",
        `**${msgServer.spamLinksLabel} :** ${links || msgServer.spamUnknown}`,
      ].join("\n")
      )
      .setTimestamp(new Date());

    const prefix = guildSettings.staff_role_id
      ? `<@&${guildSettings.staff_role_id}>`
      : msgServer.spamModerationFallback;

    const sentMessage = await (alertChannel as TextChannel).send({
    content: `${prefix} — activité suspecte détectée, vérification manuelle recommandée.`,
    embeds: [embed],
    components: [buttons],
  });

    const alertKey = this.buildAlertKey(sourceMessage.guild.id, sourceMessage.author.id);
    this.activeAlerts.set(alertKey, sentMessage.id);
  }
}

function normalizeContent(content: string): string {
  return content.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildAttachmentKeys(message: Message): string[] {
  const keys: string[] = [];

  for (const [, attachment] of message.attachments) {
    const key = [
      attachment.name ?? "unknown",
      attachment.size ?? 0,
      attachment.contentType ?? "unknown",
    ].join("|");

    keys.push(key);
  }

  return keys;
}

function containsInviteOrLink(content: string): boolean {
  const value = content.toLowerCase();
  return (
    value.includes("http://") ||
    value.includes("https://") ||
    value.includes("discord.gg/") ||
    value.includes("discord.com/invite/")
  );
}

function truncateForEmbed(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

