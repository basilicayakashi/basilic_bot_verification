import {
  TextChannel,
  Message,
  EmbedBuilder,
  Guild,
  GuildMember,
} from "discord.js";

import {
  getReactionRoleEntriesStmt,
  getReactionRolePanelByCategoryStmt,
  insertReactionRolePanelStmt,
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
  const existingPanel = getReactionRolePanelByCategoryStmt.get(
    category.id
  ) as ReactionRolePanelRow | undefined;

  let message: Message;

  if (existingPanel) {
    // Récupérer et éditer le message existant si possible
    try {
      const existingChannel = (await guild.channels.fetch(
        existingPanel.channel_id
      )) as TextChannel | null;
      const existingMessage = existingChannel
        ? await existingChannel.messages.fetch(existingPanel.message_id)
        : null;

      if (existingMessage) {
        await existingMessage.reactions.removeAll();
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
    await message.react(entry.emoji);
  }

  // Sauvegarder en DB
  insertReactionRolePanelStmt.run(
    category.id,
    guild.id,
    channel.id,
    message.id
  );

  return message;
}

/** Handler : un membre ajoute une réaction */
export async function handleReactionAdd(
  panel: ReactionRolePanelRow,
  emoji: string,
  member: GuildMember
): Promise<void> {
  const entries = getReactionRoleEntriesStmt.all(
    panel.category_id
  ) as ReactionRoleEntryRow[];
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
  const entries = getReactionRoleEntriesStmt.all(
    panel.category_id
  ) as ReactionRoleEntryRow[];
  const entry = entries.find((e) => e.emoji === emoji);
  if (!entry) return;

  const role = member.guild.roles.cache.get(entry.role_id);
  if (!role) return;

  if (member.roles.cache.has(entry.role_id)) {
    await member.roles.remove(role);
  }
}