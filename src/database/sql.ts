import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "verification.db");
export const db = new Database(dbPath);

// Table pour stocker les utilisateurs vérifiés et une trace de leur vérification (qui, quand)
db.exec(`
  CREATE TABLE IF NOT EXISTS verified_users (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    verified_at TEXT NOT NULL,
    verified_by TEXT NOT NULL
  )
`);

// Table pour stocker les permissions de qui peut utiliser la commande de setup
db.exec(`
  CREATE TABLE IF NOT EXISTS setup_verification_permissions (
    guild_id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL
  )
`);

//table pour black lister les membres
db.exec(`
  CREATE TABLE IF NOT EXISTS blacklisted_users (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    blacklisted_at TEXT NOT NULL,
    blacklisted_by TEXT NOT NULL,
    reason TEXT,
    PRIMARY KEY (guild_id, user_id)
  )
`);

// Elle stocke la config du serveur :
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_verification_settings (
    guild_id TEXT PRIMARY KEY,
    verified_role_id TEXT NOT NULL,
    staff_category_id TEXT NOT NULL,
    staff_role_id TEXT NOT NULL,
    created_by TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    verification_timeout_hours INTEGER NOT NULL DEFAULT 0
  )
`);

// Elle stocke les questions à poser pour un serveur donné, dans l’ordre.
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_verification_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    question_key TEXT NOT NULL,
    question_label TEXT NOT NULL,
    question_type TEXT NOT NULL,
    required INTEGER NOT NULL DEFAULT 1
  )
`);

// table pour éviter les spams sur un serveur donné
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_spam_settings (
    guild_id TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL DEFAULT 0,
    alert_channel_id TEXT,
    staff_role_id TEXT,
    message_threshold INTEGER NOT NULL DEFAULT 6,
    window_seconds INTEGER NOT NULL DEFAULT 20,
    created_by TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS pending_verification_submissions (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    PRIMARY KEY (guild_id, user_id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_welcome_messages (
    guild_id TEXT NOT NULL,
    locale TEXT NOT NULL,
    dm_message TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (guild_id, locale)
  );
`);

export const getVerifiedUserStmt = db.prepare(
  "SELECT * FROM verified_users WHERE user_id = ?"
);

export const insertVerifiedUserStmt = db.prepare(`
  INSERT OR REPLACE INTO verified_users (user_id, username, verified_at, verified_by)
  VALUES (?, ?, ?, ?)
`);

export const insertSetupPermissionStmt = db.prepare(`
  INSERT OR REPLACE INTO setup_verification_permissions
  (guild_id, created_at)
  VALUES (?, ?)
`);

export const getSetupPermissionStmt = db.prepare(`
  SELECT * FROM setup_verification_permissions
  WHERE guild_id = ?
`);

export const getAuthorizedGuildIdsStmt = db.prepare(`
  SELECT DISTINCT guild_id
  FROM setup_verification_permissions
`);

export const getSetupPermissionByGuildStmt = db.prepare(`
  SELECT 1
  FROM setup_verification_permissions
  WHERE guild_id = ?
  LIMIT 1
`);

export const getBlacklistedUserStmt = db.prepare(`
  SELECT * FROM blacklisted_users
  WHERE guild_id = ? AND user_id = ?
`);

export const getBlacklistedUsersEverywhereStmt = db.prepare(`
  SELECT * FROM blacklisted_users
  WHERE user_id = ?
  ORDER BY blacklisted_at DESC
`);

export const getGuildWelcomeMessageStmt = db.prepare(`
  SELECT * FROM guild_welcome_messages  
  WHERE guild_id = ? AND locale  = ?
`);

export const getGuildWelcomeMessagesAllStmt = db.prepare(`
  SELECT * FROM guild_welcome_messages
  WHERE guild_id = ?
  ORDER BY locale ASC
`);

export const insertBlacklistedUserStmt = db.prepare(`
  INSERT OR REPLACE INTO blacklisted_users
  (guild_id, user_id, username, blacklisted_at, blacklisted_by, reason)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export const upsertGuildWelcomeMessageStmt = db.prepare(`
  INSERT OR REPLACE INTO guild_welcome_messages  
  (guild_id, locale, dm_message, updated_at)
  VALUES (?, ?, ?, ?)
`);

export const deleteBlacklistedUserStmt = db.prepare(`
  DELETE FROM blacklisted_users
  WHERE guild_id = ? AND user_id = ?
`);

export const deleteGuildWelcomeMessageStmt = db.prepare(`
  DELETE FROM guild_welcome_messages  
  WHERE guild_id = ? AND locale = ?
`);

export const upsertGuildVerificationSettingsStmt = db.prepare(`
  INSERT OR REPLACE INTO guild_verification_settings
  (guild_id, verified_role_id, staff_category_id, staff_role_id, created_by, updated_at, verification_timeout_hours)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

export const deleteGuildVerificationQuestionsStmt = db.prepare(`
  DELETE FROM guild_verification_questions
  WHERE guild_id = ?
`);

export const insertGuildVerificationQuestionStmt = db.prepare(`
  INSERT INTO guild_verification_questions
  (guild_id, question_order, question_key, question_label, question_type, required)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export const getGuildVerificationSettingsStmt = db.prepare(`
  SELECT * FROM guild_verification_settings
  WHERE guild_id = ?
`);

export const getGuildVerificationQuestionsStmt = db.prepare(`
  SELECT * FROM guild_verification_questions
  WHERE guild_id = ?
  ORDER BY question_order ASC
`);

export const getGuildVerificationQuestionByIndexStmt = db.prepare(`
  SELECT *
  FROM guild_verification_questions
  WHERE guild_id = ?
  ORDER BY question_order ASC
  LIMIT 1 OFFSET ?
`);

export const updateGuildVerificationQuestionStmt = db.prepare(`
  UPDATE guild_verification_questions
  SET question_label = ?, question_type = ?, required = ?
  WHERE id = ?
`);

export const deleteGuildVerificationQuestionByIdStmt = db.prepare(`
  DELETE FROM guild_verification_questions
  WHERE id = ?
`);

export const reorderGuildVerificationQuestionsStmt = db.prepare(`
  UPDATE guild_verification_questions
  SET question_order = ?
  WHERE id = ?
`);

export const getGuildSpamSettingsStmt = db.prepare(`
  SELECT * FROM guild_spam_settings
  WHERE guild_id = ?
`);

export const upsertGuildSpamSettingsStmt = db.prepare(`
  INSERT OR REPLACE INTO guild_spam_settings
  (guild_id, enabled, alert_channel_id, staff_role_id, message_threshold, window_seconds, created_by, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

export const insertPendingVerificationSubmissionStmt = db.prepare(`
  INSERT OR REPLACE INTO pending_verification_submissions
  (guild_id, user_id, joined_at, expires_at)
  VALUES (?, ?, ?, ?)
`);

export const deletePendingVerificationSubmissionStmt = db.prepare(`
  DELETE FROM pending_verification_submissions
  WHERE guild_id = ? AND user_id = ?
`);

export const getExpiredPendingVerificationSubmissionsStmt = db.prepare(`
  SELECT *
  FROM pending_verification_submissions
  WHERE expires_at <= ?
`);

export type VerifiedUserRow = {
  user_id: string;
  username: string;
  verified_at: string;
  verified_by: string;
};

export type SetupVerificationPermissionRow = {
  guild_id: string;
  created_at: string;
};

export type BlacklistedUserRow = {
  guild_id: string;
  user_id: string;
  username: string;
  blacklisted_at: string;
  blacklisted_by: string;
  reason: string | null;
};



export type AuthorizedGuildRow = {
  guild_id: string;
};

export type GuildVerificationQuestionRow = {
  id: number;
  guild_id: string;
  question_order: number;
  question_key: string;
  question_label: string;
  question_type: string;
  required: number;
};

export type GuildVerificationSettingsRow = {
  guild_id: string;
  verified_role_id: string;
  staff_category_id: string;
  staff_role_id: string;
  created_by: string;
  updated_at: string;
  verification_timeout_hours : number;
};

export type GuildSpamSettingsRow = {
  guild_id: string;
  enabled: number;
  alert_channel_id: string | null;
  staff_role_id: string | null;
  message_threshold: number;
  window_seconds: number;
  created_by: string;
  updated_at: string;
};

export type GuildWelcomeMessageRow = {
  guild_id: string;
  locale: string;
  dm_message: string;
  updated_at: string;
};