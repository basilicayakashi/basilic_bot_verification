// bonk.ts
import {
  Message,
} from "discord.js";

import sharp from "sharp";

export async function register_bonk(message: Message) {
  if (!message.guild) return;

  const v_message = message.content.toLowerCase();
  const v_inbonk = v_message.startsWith("!basi bonk ");
  if (!v_inbonk) return;

  const parts = message.content.trim().split(/\s+/);
  const id = parts[2]?.trim();
  if (!id) return;

  const reel_id = id.startsWith("<@") && id.endsWith(">") ? id.slice(2, -1) : id;

  const member = await message.guild.members.fetch(reel_id.replace("!", "")).catch(() => null);
  if (!member) {
    return;
  }

  await message.delete().catch(() => { });

  const avatarUrl = member.displayAvatarURL({ extension: "png", size: 512 });
  const avatarRes = await fetch(avatarUrl);
  const avatarBuffer = Buffer.from(await avatarRes.arrayBuffer());

  const outBuffer = await renderBonkOnAvatar(avatarBuffer);

  const v_message_afficher = `${member} got bonked! 🔨`;

  await (message.channel as any).send({
    content: v_message_afficher,
    files: [{ attachment: outBuffer, name: "avatar-bonk.png" }],
  });
}

async function renderBonkOnAvatar(avatarBuffer: Buffer) {
  const img = sharp(avatarBuffer).resize(512, 512).ensureAlpha();
  const base = await img.toBuffer();

  const bonkSvg = `
  <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <!-- Manche de la batte -->
    <g transform="rotate(-35 380 130)">
      <rect x="330" y="40" width="26" height="180" rx="10" fill="#8B5A2B" stroke="#4a2f14" stroke-width="4"/>
      <!-- Tête de la batte -->
      <ellipse cx="343" cy="30" rx="34" ry="26" fill="#a9702f" stroke="#4a2f14" stroke-width="4"/>
    </g>

    <!-- Lignes d'impact -->
    <g stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9">
      <line x1="300" y1="150" x2="340" y2="120"/>
      <line x1="310" y1="180" x2="355" y2="165"/>
      <line x1="295" y1="210" x2="335" y2="205"/>
    </g>

    <!-- Texte BONK -->
    <text x="60%" y="80%" font-size="60" text-anchor="middle" dominant-baseline="middle"
      font-family="sans-serif" font-weight="bold" fill="#ffcc00" stroke="#111" stroke-width="3"
      transform="rotate(-10 320 400)">BONK!</text>
  </svg>`;

  const composited = await sharp(base)
    .composite([{ input: Buffer.from(bonkSvg), blend: "over", gravity: "center" }])
    .png()
    .toBuffer();

  return composited;
}