import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "verification.db");
export const db = new Database(dbPath);

// Table pour stocker les utilisateurs vérifiés et une trace de leur vérification (qui, quand)
db.exec(`
  CREATE TABLE IF NOT EXISTS verified_users (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  PRIMARY KEY (guild_id, user_id)
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

db.exec(`
  CREATE TABLE IF NOT EXISTS free_games_settings (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    include_steam BOOLEAN NOT NULL DEFAULT TRUE,
    include_epicgames BOOLEAN NOT NULL DEFAULT TRUE,
    include_itchio BOOLEAN NOT NULL DEFAULT FALSE,
    include_gog BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    CHECK (enabled IN (0, 1)),
    CHECK (include_steam IN (0, 1)),
    CHECK (include_epicgames IN (0, 1)),
    CHECK (include_itchio IN (0, 1)),
    CHECK (include_gog IN (0, 1))
  );
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS free_games_publications (
    guild_id TEXT NOT NULL,
    channel_id TEXT NULL,
    message_id TEXT NULL,
    free_game_id INTEGER NOT NULL,
    published_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (guild_id, free_game_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS free_games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT,
      provider_code TEXT NOT NULL,
      title TEXT NOT NULL,
      promo_url TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      promo_type TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(provider_code, promo_url, promo_type)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS role_panels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS role_panel_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    panel_id INTEGER NOT NULL,
    role_id TEXT NOT NULL,
    label TEXT NOT NULL,
    emoji TEXT,
    button_style TEXT DEFAULT 'Secondary',
    position INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(panel_id) REFERENCES role_panels(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_role_message_delete_settings (
    guild_id TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL,
    role_id1 TEXT NULL,
    role_id2 TEXT NULL,
    role_id3 TEXT NULL,
    role_id4 TEXT NULL,
    role_id5 TEXT NULL,
    updated_by TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reaction_role_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(guild_id, name)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reaction_role_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    role_id TEXT NOT NULL,
    description TEXT NOT NULL,
    emoji TEXT NOT NULL,
    UNIQUE(category_id, role_id),
    FOREIGN KEY(category_id) REFERENCES reaction_role_categories(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reaction_role_panels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL UNIQUE,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message_id TEXT NOT NULL,
    FOREIGN KEY(category_id) REFERENCES reaction_role_categories(id) ON DELETE CASCADE
  );
`);

export const getAllFreeGamesStmt = db.prepare(`
  SELECT *
  FROM free_games
  ORDER BY datetime(expires_at) ASC
`);

export const getVerifiedUserStmt = db.prepare(
  "SELECT * FROM verified_users WHERE guild_id = ? AND user_id = ?"
);

export const insertVerifiedUserStmt = db.prepare(`
  INSERT OR REPLACE INTO verified_users (guild_id, user_id, username, verified_at, verified_by)
  VALUES (?, ?, ?, ?, ?)
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

export const upsertFreeGamesSettingsStmt = db.prepare(`
  INSERT INTO free_games_settings (
    guild_id,
    channel_id,
    enabled,
    include_steam,
    include_epicgames,
    include_itchio,
    include_gog,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT(guild_id) DO UPDATE SET
    channel_id = excluded.channel_id,
    enabled = excluded.enabled,
    include_steam = excluded.include_steam,
    include_epicgames = excluded.include_epicgames,
    include_itchio = excluded.include_itchio,
    include_gog = excluded.include_gog,
    updated_at = CURRENT_TIMESTAMP
`);

export const getFreeGamesSettingsStmt = db.prepare(`
  SELECT *
  FROM free_games_settings
  WHERE guild_id = ?
`);

export const getEnabledFreeGamesSettingsStmt = db.prepare(`
  SELECT *
  FROM free_games_settings
  WHERE enabled = 1
`);

export const insertFreeGamePublicationStmt = db.prepare(`
  INSERT OR IGNORE INTO free_games_publications (
    guild_id,
    free_game_id,
    channel_id,
    message_id,
    published_at
  )
  VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
`);

export const getPublishedFreeGameIdsForGuildStmt = db.prepare(`
  SELECT free_game_id FROM free_games_publications
  WHERE guild_id = ?
`);

export const getExpiredFreeGamePublicationsStmt = db.prepare(`
  SELECT
    fgp.guild_id,
    fgp.free_game_id,
    fgp.channel_id,
    fgp.message_id
  FROM free_games_publications fgp
  INNER JOIN free_games fg ON fg.id = fgp.free_game_id
  WHERE fg.expires_at < strftime('%Y-%m-%dT%H:%M:%S.000Z', 'now')
    AND fgp.channel_id IS NOT NULL
    AND fgp.message_id IS NOT NULL
`);

export const deleteFreeGamePublicationStmt = db.prepare(`
  DELETE FROM free_games_publications
  WHERE guild_id = ?
    AND free_game_id = ?
`);

export const getGuildRoleMessageDeleteSettingsStmt = db.prepare(`
  SELECT * FROM guild_role_message_delete_settings
  WHERE guild_id = ?
`);

export const upsertGuildRoleMessageDeleteSettingsStmt = db.prepare(`
  INSERT INTO guild_role_message_delete_settings (
    guild_id, enabled, role_id1, role_id2, role_id3, role_id4, role_id5, updated_by, updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(guild_id) DO UPDATE SET
    enabled = excluded.enabled,
    role_id1 = excluded.role_id1,
    role_id2 = excluded.role_id2,
    role_id3 = excluded.role_id3,
    role_id4 = excluded.role_id4,
    role_id5 = excluded.role_id5,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at
`);

export const insertRolePanelStmt = db.prepare(`
  INSERT INTO role_panels (guild_id, channel_id, title, description, created_by)
  VALUES (?, ?, ?, ?, ?)
`);

export const updateRolePanelMessageIdStmt = db.prepare(`
  UPDATE role_panels SET message_id = ? WHERE id = ?
`);

export const getRolePanelStmt = db.prepare(`
  SELECT * FROM role_panels WHERE id = ?
`);

export const getRolePanelByMessageIdStmt = db.prepare(`
  SELECT * FROM role_panels WHERE message_id = ?
`);

export const getRolePanelsByGuildStmt = db.prepare(`
  SELECT * FROM role_panels WHERE guild_id = ? ORDER BY id DESC
`);

export const deleteRolePanelStmt = db.prepare(`
  DELETE FROM role_panels WHERE id = ?
`);

export const insertRolePanelOptionStmt = db.prepare(`
  INSERT INTO role_panel_options (panel_id, role_id, label, emoji, button_style, position)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export const getRolePanelOptionsStmt = db.prepare(`
  SELECT * FROM role_panel_options WHERE panel_id = ? ORDER BY position ASC
`);

export const deleteRolePanelOptionsStmt = db.prepare(`
  DELETE FROM role_panel_options WHERE panel_id = ?
`);

export const insertReactionRoleCategoryStmt = db.prepare(`
  INSERT INTO reaction_role_categories (guild_id, name) VALUES (?, ?)
`);

export const updateReactionRoleCategoryStmt = db.prepare(`
  UPDATE reaction_role_categories SET name = ? WHERE guild_id = ? AND name = ?
`);

export const deleteReactionRoleCategoryStmt = db.prepare(`
  DELETE FROM reaction_role_categories WHERE guild_id = ? AND name = ?
`);

export const getReactionRoleCategoryStmt = db.prepare(`
  SELECT * FROM reaction_role_categories WHERE guild_id = ? AND name = ?
`);

export const getReactionRoleCategoriesStmt = db.prepare(`
  SELECT * FROM reaction_role_categories WHERE guild_id = ? ORDER BY name ASC
`);

// Statements — entrées
export const insertReactionRoleEntryStmt = db.prepare(`
  INSERT INTO reaction_role_entries (category_id, role_id, description, emoji)
  VALUES (?, ?, ?, ?)
`);

export const updateReactionRoleEntryStmt = db.prepare(`
  UPDATE reaction_role_entries
  SET description = COALESCE(?, description),
      emoji = COALESCE(?, emoji),
      role_id = COALESCE(?, role_id)
  WHERE category_id = ? AND role_id = ?
`);

export const deleteReactionRoleEntryStmt = db.prepare(`
  DELETE FROM reaction_role_entries WHERE category_id = ? AND role_id = ?
`);

export const getReactionRoleEntriesStmt = db.prepare(`
  SELECT * FROM reaction_role_entries WHERE category_id = ? ORDER BY id ASC
`);

export const getReactionRoleEntryByEmojiStmt = db.prepare(`
  SELECT * FROM reaction_role_entries WHERE category_id = ? AND emoji = ?
`);

// Statements — panels
export const insertReactionRolePanelStmt = db.prepare(`
  INSERT OR REPLACE INTO reaction_role_panels (category_id, guild_id, channel_id, message_id)
  VALUES (?, ?, ?, ?)
`);

export const getReactionRolePanelByCategoryStmt = db.prepare(`
  SELECT * FROM reaction_role_panels WHERE category_id = ?
`);

export const getReactionRolePanelByMessageIdStmt = db.prepare(`
  SELECT * FROM reaction_role_panels WHERE message_id = ?
`);

export const deleteReactionRolePanelStmt = db.prepare(`
  DELETE FROM reaction_role_panels WHERE category_id = ?
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
  verification_timeout_hours: number;
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

export type GuildFreeGamesSettingsRow = {
  guild_id: string;
  channel_id: string;
  enabled: number;
  include_free_to_keep: number;
  include_play_for_free: number;
  created_at: string;
  updated_at: string;
};

export type GuildRoleMessageDeleteSettingsRow = {
  guild_id: string;
  enabled: number;
  role_id1: string | null;
  role_id2: string | null;
  role_id3: string | null;
  role_id4: string | null;
  role_id5: string | null;
  updated_by: string;
  updated_at: string;
}

export type RolePanelRow = {
  id: number;
  guild_id: string;
  channel_id: string;
  message_id: string | null;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
};

export type RolePanelOptionRow = {
  id: number;
  panel_id: number;
  role_id: string;
  label: string;
  emoji: string | null;
  button_style: string;
  position: number;
};

export type ReactionRoleCategoryRow = {
  id: number;
  guild_id: string;
  name: string;
};

export type ReactionRoleEntryRow = {
  id: number;
  category_id: number;
  role_id: string;
  description: string;
  emoji: string;
};

export type ReactionRolePanelRow = {
  id: number;
  category_id: number;
  guild_id: string;
  channel_id: string;
  message_id: string;
};