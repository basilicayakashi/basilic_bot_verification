import {
  TextChannel,
  Message,
  EmbedBuilder,
  Guild,
  GuildMember,
} from "discord.js";

import { firstValueFrom } from "rxjs";

import {
  getReactionRoleEntries,
  getReactionRolePanelByCategory,
  insertReactionRolePanel,
  ReactionRoleCategoryRow,
  ReactionRoleEntryRow,
  ReactionRolePanelRow,
} from "../database/sql.js";

import { MessagesServer } from "../langues/index.js";

/** Construit le contenu de l'embed pour un panel de reaction roles */
export function buildReactionRolePanelEmbed(
  category: ReactionRoleCategoryRow,
  entries: ReactionRoleEntryRow[],
  msgServer: MessagesServer
): EmbedBuilder {
  const lines = entries.map((e) => `${e.emoji} — ${e.description}`);

  return new EmbedBuilder()
    .setTitle(msgServer.reactionRolePanelTitle(category.name))
    .setDescription(
      lines.length > 0
        ? lines.join("\n")
        : `*${msgServer.reactionRolePanelEmpty}*`
    );
}

/** Publie ou met à jour le message de panel dans le salon */
export async function publishOrUpdatePanel(
  guild: Guild,
  category: ReactionRoleCategoryRow,
  entries: ReactionRoleEntryRow[],
  channel: TextChannel,
  msgServer: MessagesServer
): Promise<Message> {
  const embed = buildReactionRolePanelEmbed(category, entries, msgServer);

  const existingPanel = await firstValueFrom(
    getReactionRolePanelByCategory(category.id)
  );

  let message: Message;

  if (existingPanel) {
    try {
      const existingChannel = (await guild.channels.fetch(
        existingPanel.channel_id
      )) as TextChannel | null;

      const existingMessage = existingChannel
        ? await existingChannel.messages.fetch(existingPanel.message_id).catch(() => null)
        : null;

      if (existingMessage) {
        await existingMessage.reactions.removeAll().catch(() => null);
        message = await existingMessage.edit({ embeds: [embed] });
      } else {
        message = await channel.send({ embeds: [embed] });
      }
    } catch {
      message = await channel.send({ embeds: [embed] });
    }
  } else {
    message = await channel.send({ embeds: [embed] });
  }

  // Ajouter les réactions dans l'ordre
  for (const entry of entries) {
    await message.react(entry.emoji).catch(() => null);
  }

  // Sauvegarder en DB PostgreSQL
  await firstValueFrom(
    insertReactionRolePanel(
      category.id,
      guild.id,
      channel.id,
      message.id
    )
  );

  return message;
}

/** Handler : un membre ajoute une réaction */
export async function handleReactionAdd(
  panel: ReactionRolePanelRow,
  emoji: string,
  member: GuildMember
): Promise<void> {
  const entries = await firstValueFrom(
    getReactionRoleEntries(panel.category_id)
  );

  const entry = entries.find((e) => e.emoji === emoji);
  if (!entry) return;

  const role = member.guild.roles.cache.get(entry.role_id);
  if (!role) return;

  if (!member.roles.cache.has(entry.role_id)) {
    await member.roles.add(role);
  }
}

/** Handler : un membre retire une réaction */
export async function handleReactionRemove(
  panel: ReactionRolePanelRow,
  emoji: string,
  member: GuildMember
): Promise<void> {
  const entries = await firstValueFrom(
    getReactionRoleEntries(panel.category_id)
  );

  const entry = entries.find((e) => e.emoji === emoji);
  if (!entry) return;

  const role = member.guild.roles.cache.get(entry.role_id);
  if (!role) return;

  if (member.roles.cache.has(entry.role_id)) {
    await member.roles.remove(role);
  }
}
