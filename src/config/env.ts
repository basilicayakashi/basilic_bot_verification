import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant dans .env");
}

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN manquant dans .env");
}