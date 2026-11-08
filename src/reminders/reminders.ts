// src/reminders/reminders.ts
// Fonctions de TRAITEMENT uniquement (programmation à l'arrivée + envoi des rappels échus).
// Les commandes /reminder-* et leurs traductions sont gérées dans index.ts.
import { Client } from "discord.js";
import { firstValueFrom } from "rxjs";

import {
  schedulePendingMemberReminders,
  claimDueMemberReminders,
  getVerifiedUser,
  getBannedGuild,
} from "../database/sql.js";

// =========================
// PROGRAMMATION À L'ARRIVÉE D'UN MEMBRE
// =========================

/** À appeler dans un listener GuildMemberAdd */
export async function scheduleRemindersForNewMember(member: {
  id: string;
  guild: { id: string };
  user: { bot: boolean };
}): Promise<void> {
  if (member.user.bot) return;

  const guildId = member.guild.id;

  // Serveur non autorisé : on ne fait rien
  if (await firstValueFrom(getBannedGuild(guildId))) return;

  // Déjà vérifié par le passé : inutile de le relancer
  if (await firstValueFrom(getVerifiedUser(guildId, member.id))) return;

  await firstValueFrom(schedulePendingMemberReminders(guildId, member.id));
}

// =========================
// ENVOI DES RAPPELS ÉCHUS
// =========================
// Le texte envoyé en DM est celui du message choisi par l'admin avec /reminder-add :
// il n'est volontairement PAS traduit (l'admin l'écrit dans la langue qu'il veut).

let running = false;

async function processDueReminders(client: Client): Promise<void> {
  if (running) return;
  running = true;

  try {
    const due = await firstValueFrom(claimDueMemberReminders());

    for (const row of due) {
      try {
        const guild = await client.guilds.fetch(row.guild_id).catch(() => null);
        if (!guild) continue;

        // Le membre a pu partir (ban/kick/départ) entre-temps
        const member = await guild.members.fetch(row.user_id).catch(() => null);
        if (!member) continue;

        // Filet de sécurité : déjà vérifié entre-temps
        if (await firstValueFrom(getVerifiedUser(row.guild_id, row.user_id))) continue;

        const content = row.message_content.replace("{{mention}}", `<@${row.user_id}>`);
        await member.send(content).catch(() => null); // DMs fermés : on ignore
      } catch (error) {
        console.error(
          `[reminders] Erreur d'envoi pour ${row.user_id} (guild ${row.guild_id}) :`,
          error
        );
      }
    }
  } catch (error) {
    console.error("[reminders] Erreur dans la tâche de rappel :", error);
  } finally {
    running = false;
  }
}

/** À appeler une fois, après initDb(), dans ClientReady */
export function startReminderScheduler(client: Client): void {
  void processDueReminders(client);
  setInterval(() => void processDueReminders(client), 60_000);
}