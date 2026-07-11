// jail.ts
import {
  Message,
  PermissionsBitField,
} from "discord.js";

import sharp from "sharp";

export async function register_jail(message: Message) {  
  if (!message.guild) return;

  const v_message = message.content.toLowerCase();
  const v_injail = v_message.startsWith("!basi jail ");
  const v_inhornyjail = v_message.startsWith("!basi hornyjail ");
  const v_inbellyjail = v_message.startsWith("!basi bellyjail ");
  const v_inbasijail = v_message.startsWith("!basi basijail ");
  if (!v_injail && !v_inhornyjail && !v_inbellyjail && !v_inbasijail) return;

  const parts = message.content.trim().split(/\s+/);
  const id = parts[2]?.trim();
  if (!id) return;

  const reel_id = id.startsWith("<@") && id.endsWith(">") ? id.slice(2, -1) : id;

  const member = await message.guild.members.fetch(reel_id.replace("!", "")).catch(() => null);
  if (!member) {
    return;
  }

  await message.delete().catch(() => { });

  const canNick = message.guild.members.me?.permissions.has(
    PermissionsBitField.Flags.ManageNicknames
  );

  if (canNick) {
    if (v_injail) {
      await member.setNickname("🔒 I'm in jail").catch(() => { });
    } else if (v_inhornyjail) {
      await member.setNickname("🔒 I'm in horny jail").catch(() => { });
    } else if (v_inbellyjail) {
      await member.setNickname("🔒 I'm in belly jail").catch(() => { });
    } else if (v_inbasijail) {
      await member.setNickname("👅 Basi thanks you for the meal").catch(() => { });
    }
  }

  const avatarUrl = member.displayAvatarURL({ extension: "png", size: 512 });
  const avatarRes = await fetch(avatarUrl);
  const avatarBuffer = Buffer.from(await avatarRes.arrayBuffer());

  const outBuffer = await renderBarsOnAvatar(avatarBuffer);

  const v_message_afficher = `${member}`;

  await (message.channel as any).send({
    content: v_message_afficher,
    files: [{ attachment: outBuffer, name: "avatar-basi.png" }],
  });
}

async function renderBarsOnAvatar(avatarBuffer: Buffer) {
  // Effet graphique simple : barreaux stylés (générique)
  const img = sharp(avatarBuffer).resize(512, 512).ensureAlpha();
  const base = await img.toBuffer();

  const barsSvg = `
  <svg width="512" height="512">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#555"/>
        <stop offset="1" stop-color="#111"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="transparent"/>
    ${Array.from({ length: 10 }).map((_, i) => {
    const x = 30 + i * 45;
    return `<rect x="${x}" y="40" width="10" height="432" rx="3" fill="url(#g)" opacity="0.75"/>`;
  }).join("")}
    <rect x="40" y="40" width="432" height="432" fill="none" stroke="#111" stroke-width="6" opacity="0.5"/>
  </svg>`;

  const composited = await sharp(base)
    .composite([{ input: Buffer.from(barsSvg), blend: "over", gravity: "center" }])
    .png()
    .toBuffer();

  return composited;
}