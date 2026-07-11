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

  //const v_message_afficher = `${member} got bonked! 🔨`;
const v_message_afficher = `${member} got bonked!`;

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
    <g transform="rotate(-30 380 160)">
      <!-- Manche -->
      <rect x="368" y="90" width="24" height="170" rx="10" fill="#c98a3e" stroke="#5c3a15" stroke-width="4"/>
      <!-- Tête du maillet (rectangle arrondi, vu de profil) -->
      <rect x="320" y="30" width="120" height="80" rx="16" fill="#a9702f" stroke="#4a2f14" stroke-width="5"/>
      <!-- Reflet sur la tête pour donner du volume -->
      <rect x="332" y="42" width="96" height="18" rx="8" fill="#c98a3e" opacity="0.6"/>
    </g>

    <!-- Lignes d'impact -->
    <g stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.9">
      <line x1="260" y1="180" x2="310" y2="140"/>
      <line x1="270" y1="215" x2="325" y2="195"/>
      <line x1="255" y1="250" x2="300" y2="245"/>
    </g>

    <!-- Petites étoiles d'impact -->
    <g fill="#ffcc00" stroke="#111" stroke-width="2">
      <polygon points="290,150 296,165 312,165 299,175 304,190 290,181 276,190 281,175 268,165 284,165" />
    </g>

    <!-- Texte BONK -->
    <text x="60%" y="82%" font-size="62" text-anchor="middle" dominant-baseline="middle"
      font-family="sans-serif" font-weight="bold" fill="#ffcc00" stroke="#111" stroke-width="3"
      transform="rotate(-8 320 410)">BONK!</text>
  </svg>`;

  const composited = await sharp(base)
    .composite([{ input: Buffer.from(bonkSvg), blend: "over", gravity: "center" }])
    .png()
    .toBuffer();

  return composited;
}