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
  <svg width="512" height="512">
    <text x="50%" y="18%" font-size="150" text-anchor="middle" dominant-baseline="middle">🔨</text>
    <text x="78%" y="55%" font-size="70" text-anchor="middle" dominant-baseline="middle"
      font-family="Impact, sans-serif" fill="#ffcc00" stroke="#111" stroke-width="3"
      transform="rotate(-12 400 280)">BONK!</text>
  </svg>`;

  const composited = await sharp(base)
    .composite([{ input: Buffer.from(bonkSvg), blend: "over", gravity: "center" }])
    .png()
    .toBuffer();

  return composited;
}