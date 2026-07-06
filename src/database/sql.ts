import { Pool, QueryResult, QueryResultRow } from "pg";
import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

// ---------------------------------------------------------------------------
// Connexion
// ---------------------------------------------------------------------------

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL manquant au moment de créer le Pool PostgreSQL");
}

export const db = new Pool({
  connectionString: databaseUrl,
});

// ---------------------------------------------------------------------------
// Helper générique
// ---------------------------------------------------------------------------

function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Observable<T[]> {
  return from(db.query<T>(sql, params)).pipe(
    map((result: QueryResult<T>) => result.rows),
    catchError((err) => throwError(() => new Error(`[DB] ${err.message}`)))
  );
}

function queryOne<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Observable<T | null> {
  return query<T>(sql, params).pipe(map((rows) => rows[0] ?? null));
}

/** Pour INSERT / UPDATE / DELETE sans retour de lignes */
function execute(sql: string, params: unknown[] = []): Observable<void> {
  return from(db.query(sql, params)).pipe(
    map(() => undefined),
    catchError((err) => throwError(() => new Error(`[DB] ${err.message}`)))
  );
}

// ---------------------------------------------------------------------------
// Initialisation des tables
// ---------------------------------------------------------------------------

export function initDb(): Observable<void> {
  const statements = [
    // Utilisateurs vérifiés
    `CREATE TABLE IF NOT EXISTS verified_users (
      guild_id    TEXT NOT NULL,
      user_id     TEXT NOT NULL,
      username    TEXT NOT NULL,
      verified_at TIMESTAMPTZ NOT NULL,
      verified_by TEXT NOT NULL,
      PRIMARY KEY (guild_id, user_id)
    )`,

    // Blacklist membres
    `CREATE TABLE IF NOT EXISTS blacklisted_users (
      guild_id        TEXT NOT NULL,
      user_id         TEXT NOT NULL,
      username        TEXT NOT NULL,
      blacklisted_at  TIMESTAMPTZ NOT NULL,
      blacklisted_by  TEXT NOT NULL,
      reason          TEXT,
      PRIMARY KEY (guild_id, user_id)
    )`,

    // Config vérification serveur
    `CREATE TABLE IF NOT EXISTS guild_verification_settings (
      guild_id                    TEXT PRIMARY KEY,
      verified_role_id            TEXT NOT NULL,
      staff_category_id           TEXT NOT NULL,
      staff_role_id               TEXT NOT NULL,
      created_by                  TEXT NOT NULL,
      updated_at                  TIMESTAMPTZ NOT NULL,
      verification_timeout_hours  INTEGER NOT NULL DEFAULT 0
    )`,

    // Questions de vérification par serveur
    `CREATE TABLE IF NOT EXISTS guild_verification_questions (
      id             SERIAL PRIMARY KEY,
      guild_id       TEXT NOT NULL,
      question_order INTEGER NOT NULL,
      question_key   TEXT NOT NULL,
      question_label TEXT NOT NULL,
      question_type  TEXT NOT NULL,
      required       BOOLEAN NOT NULL DEFAULT TRUE
    )`,

    // Anti-spam par serveur
    `CREATE TABLE IF NOT EXISTS guild_spam_settings (
      guild_id          TEXT PRIMARY KEY,
      enabled           BOOLEAN NOT NULL DEFAULT FALSE,
      alert_channel_id  TEXT,
      staff_role_id     TEXT,
      message_threshold INTEGER NOT NULL DEFAULT 6,
      window_seconds    INTEGER NOT NULL DEFAULT 20,
      created_by        TEXT NOT NULL,
      updated_at        TIMESTAMPTZ NOT NULL
    )`,

    // Vérifications en attente
    `CREATE TABLE IF NOT EXISTS pending_verification_submissions (
      guild_id   TEXT NOT NULL,
      user_id    TEXT NOT NULL,
      joined_at  TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (guild_id, user_id)
    )`,

    // Messages de bienvenue
    `CREATE TABLE IF NOT EXISTS guild_welcome_messages (
      guild_id   TEXT PRIMARY KEY,
      dm_message TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )`,

    // Paramètres free games
    `CREATE TABLE IF NOT EXISTS free_games_settings (
      guild_id          TEXT PRIMARY KEY,
      channel_id        TEXT NOT NULL,
      enabled           BOOLEAN NOT NULL DEFAULT TRUE,
      include_steam     BOOLEAN NOT NULL DEFAULT TRUE,
      include_epicgames BOOLEAN NOT NULL DEFAULT TRUE,
      include_itchio    BOOLEAN NOT NULL DEFAULT FALSE,
      include_gog       BOOLEAN NOT NULL DEFAULT FALSE,
      created_at        TIMESTAMPTZ DEFAULT NOW(),
      updated_at        TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Publications free games
    `CREATE TABLE IF NOT EXISTS free_games_publications (
      guild_id     TEXT NOT NULL,
      channel_id   TEXT,
      message_id   TEXT,
      free_game_id INTEGER NOT NULL,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (guild_id, free_game_id)
    )`,

    // Catalogue free games
    `CREATE TABLE IF NOT EXISTS free_games (
      id            SERIAL PRIMARY KEY,
      image_url     TEXT,
      provider_code TEXT NOT NULL,
      title         TEXT NOT NULL,
      promo_url     TEXT NOT NULL,
      expires_at    TIMESTAMPTZ NOT NULL,
      promo_type    TEXT NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (provider_code, promo_url, promo_type)
    )`,

    // Panels de rôles
    `CREATE TABLE IF NOT EXISTS role_panels (
      id          SERIAL PRIMARY KEY,
      guild_id    TEXT NOT NULL,
      channel_id  TEXT NOT NULL,
      message_id  TEXT,
      title       TEXT NOT NULL,
      description TEXT,
      created_by  TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Options des panels de rôles
    `CREATE TABLE IF NOT EXISTS role_panel_options (
      id           SERIAL PRIMARY KEY,
      panel_id     INTEGER NOT NULL,
      role_id      TEXT NOT NULL,
      label        TEXT NOT NULL,
      emoji        TEXT,
      button_style TEXT DEFAULT 'Secondary',
      position     INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (panel_id) REFERENCES role_panels(id) ON DELETE CASCADE
    )`,

    // Suppression de messages par rôle
    `CREATE TABLE IF NOT EXISTS guild_role_message_delete_settings (
      guild_id   TEXT PRIMARY KEY,
      enabled    BOOLEAN NOT NULL,
      role_id1   TEXT,
      role_id2   TEXT,
      role_id3   TEXT,
      role_id4   TEXT,
      role_id5   TEXT,
      updated_by TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )`,

    // Catégories de reaction roles
    `CREATE TABLE IF NOT EXISTS reaction_role_categories (
      id       SERIAL PRIMARY KEY,
      guild_id TEXT NOT NULL,
      name     TEXT NOT NULL,
      UNIQUE (guild_id, name)
    )`,

    // Entrées de reaction roles
    `CREATE TABLE IF NOT EXISTS reaction_role_entries (
      id          SERIAL PRIMARY KEY,
      category_id INTEGER NOT NULL,
      role_id     TEXT NOT NULL,
      description TEXT NOT NULL,
      emoji       TEXT NOT NULL,
      UNIQUE (category_id, role_id),
      FOREIGN KEY (category_id) REFERENCES reaction_role_categories(id) ON DELETE CASCADE
    )`,

    // Panels de reaction roles
    `CREATE TABLE IF NOT EXISTS reaction_role_panels (
      id          SERIAL PRIMARY KEY,
      category_id INTEGER NOT NULL UNIQUE,
      guild_id    TEXT NOT NULL,
      channel_id  TEXT NOT NULL,
      message_id  TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES reaction_role_categories(id) ON DELETE CASCADE
    )`,

    // Notifications blacklist join
    `CREATE TABLE IF NOT EXISTS guild_blacklist_join_notifications (
      guild_id   TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL
    )`,

    // Serveurs bannis
    `CREATE TABLE IF NOT EXISTS banned_guilds (
      guild_id TEXT PRIMARY KEY
    )`,

    `CREATE TABLE IF NOT EXISTS AUTOKICK_SETTINGS (
      guild_id TEXT PRIMARY KEY,
      days INTEGER NOT NULL,
      text_to_send TEXT
    )`,
  ];

  return from(
    (async () => {
      const client = await db.connect();
      try {
        await client.query("BEGIN");
        for (const sql of statements) {
          await client.query(sql);
        }
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    })()
  ).pipe(
    map(() => undefined),
    catchError((err) => throwError(() => new Error(`[DB init] ${err.message}`)))
  );
}

// ---------------------------------------------------------------------------
// verified_users
// ---------------------------------------------------------------------------

export function getVerifiedUser(guildId: string, userId: string): Observable<VerifiedUserRow | null> {
  return queryOne<VerifiedUserRow>(
    "SELECT * FROM verified_users WHERE guild_id = $1 AND user_id = $2",
    [guildId, userId]
  );
}

export function insertVerifiedUser(
  guildId: string,
  userId: string,
  username: string,
  verifiedAt: string,
  verifiedBy: string
): Observable<void> {
  return execute(
    `INSERT INTO verified_users (guild_id, user_id, username, verified_at, verified_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (guild_id, user_id) DO UPDATE SET
       username    = EXCLUDED.username,
       verified_at = EXCLUDED.verified_at,
       verified_by = EXCLUDED.verified_by`,
    [guildId, userId, username, verifiedAt, verifiedBy]
  );
}

// ---------------------------------------------------------------------------
// blacklisted_users
// ---------------------------------------------------------------------------

export function getBlacklistedUser(guildId: string, userId: string): Observable<BlacklistedUserRow | null> {
  return queryOne<BlacklistedUserRow>(
    "SELECT * FROM blacklisted_users WHERE guild_id = $1 AND user_id = $2",
    [guildId, userId]
  );
}

export function getBlacklistedUsersEverywhere(userId: string): Observable<BlacklistedUserRow[]> {
  return query<BlacklistedUserRow>(
    "SELECT * FROM blacklisted_users WHERE user_id = $1 ORDER BY blacklisted_at DESC",
    [userId]
  );
}

export function insertBlacklistedUser(
  guildId: string,
  userId: string,
  username: string,
  blacklistedAt: string,
  blacklistedBy: string,
  reason: string | null
): Observable<void> {
  return execute(
    `INSERT INTO blacklisted_users (guild_id, user_id, username, blacklisted_at, blacklisted_by, reason)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (guild_id, user_id) DO UPDATE SET
       username       = EXCLUDED.username,
       blacklisted_at = EXCLUDED.blacklisted_at,
       blacklisted_by = EXCLUDED.blacklisted_by,
       reason         = EXCLUDED.reason`,
    [guildId, userId, username, blacklistedAt, blacklistedBy, reason]
  );
}

export function deleteBlacklistedUser(guildId: string, userId: string): Observable<void> {
  return execute(
    "DELETE FROM blacklisted_users WHERE guild_id = $1 AND user_id = $2",
    [guildId, userId]
  );
}

// ---------------------------------------------------------------------------
// guild_welcome_messages
// ---------------------------------------------------------------------------

export function getGuildWelcomeMessage(guildId: string): Observable<GuildWelcomeMessageRow | null> {
  return queryOne<GuildWelcomeMessageRow>(
    "SELECT * FROM guild_welcome_messages WHERE guild_id = $1",
    [guildId]
  );
}

export function upsertGuildWelcomeMessage(
  guildId: string,
  dmMessage: string,
  updatedAt: string
): Observable<void> {
  return execute(
    `INSERT INTO guild_welcome_messages (guild_id, dm_message, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (guild_id) DO UPDATE SET
       dm_message = EXCLUDED.dm_message,
       updated_at = EXCLUDED.updated_at`,
    [guildId, dmMessage, updatedAt]
  );
}

export function deleteGuildWelcomeMessage(guildId: string): Observable<void> {
  return execute(
    "DELETE FROM guild_welcome_messages WHERE guild_id = $1",
    [guildId]
  );
}

// ---------------------------------------------------------------------------
// guild_verification_settings
// ---------------------------------------------------------------------------

export function getGuildVerificationSettings(guildId: string): Observable<GuildVerificationSettingsRow | null> {
  return queryOne<GuildVerificationSettingsRow>(
    "SELECT * FROM guild_verification_settings WHERE guild_id = $1",
    [guildId]
  );
}

export function upsertGuildVerificationSettings(
  guildId: string,
  verifiedRoleId: string,
  staffCategoryId: string,
  staffRoleId: string,
  createdBy: string,
  updatedAt: string,
  verificationTimeoutHours: number
): Observable<void> {
  return execute(
    `INSERT INTO guild_verification_settings
       (guild_id, verified_role_id, staff_category_id, staff_role_id, created_by, updated_at, verification_timeout_hours)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (guild_id) DO UPDATE SET
       verified_role_id           = EXCLUDED.verified_role_id,
       staff_category_id          = EXCLUDED.staff_category_id,
       staff_role_id              = EXCLUDED.staff_role_id,
       created_by                 = EXCLUDED.created_by,
       updated_at                 = EXCLUDED.updated_at,
       verification_timeout_hours = EXCLUDED.verification_timeout_hours`,
    [guildId, verifiedRoleId, staffCategoryId, staffRoleId, createdBy, updatedAt, verificationTimeoutHours]
  );
}

// ---------------------------------------------------------------------------
// guild_verification_questions
// ---------------------------------------------------------------------------

export function getGuildVerificationQuestions(guildId: string): Observable<GuildVerificationQuestionRow[]> {
  return query<GuildVerificationQuestionRow>(
    "SELECT * FROM guild_verification_questions WHERE guild_id = $1 ORDER BY question_order ASC",
    [guildId]
  );
}

export function getGuildVerificationQuestionByIndex(guildId: string, offset: number): Observable<GuildVerificationQuestionRow | null> {
  return queryOne<GuildVerificationQuestionRow>(
    `SELECT * FROM guild_verification_questions
     WHERE guild_id = $1
     ORDER BY question_order ASC
     LIMIT 1 OFFSET $2`,
    [guildId, offset]
  );
}

export function insertGuildVerificationQuestion(
  guildId: string,
  questionOrder: number,
  questionKey: string,
  questionLabel: string,
  questionType: string,
  required: boolean
): Observable<void> {
  return execute(
    `INSERT INTO guild_verification_questions
       (guild_id, question_order, question_key, question_label, question_type, required)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [guildId, questionOrder, questionKey, questionLabel, questionType, required]
  );
}

export function updateGuildVerificationQuestion(
  questionLabel: string,
  questionType: string,
  required: boolean,
  id: number
): Observable<void> {
  return execute(
    "UPDATE guild_verification_questions SET question_label = $1, question_type = $2, required = $3 WHERE id = $4",
    [questionLabel, questionType, required, id]
  );
}

export function deleteGuildVerificationQuestions(guildId: string): Observable<void> {
  return execute(
    "DELETE FROM guild_verification_questions WHERE guild_id = $1",
    [guildId]
  );
}

export function deleteGuildVerificationQuestionById(id: number): Observable<void> {
  return execute(
    "DELETE FROM guild_verification_questions WHERE id = $1",
    [id]
  );
}

export function reorderGuildVerificationQuestion(questionOrder: number, id: number): Observable<void> {
  return execute(
    "UPDATE guild_verification_questions SET question_order = $1 WHERE id = $2",
    [questionOrder, id]
  );
}

// ---------------------------------------------------------------------------
// guild_spam_settings
// ---------------------------------------------------------------------------

export function getGuildSpamSettings(guildId: string): Observable<GuildSpamSettingsRow | null> {
  return queryOne<GuildSpamSettingsRow>(
    "SELECT * FROM guild_spam_settings WHERE guild_id = $1",
    [guildId]
  );
}

export function upsertGuildSpamSettings(
  guildId: string,
  enabled: boolean,
  alertChannelId: string | null,
  staffRoleId: string | null,
  messageThreshold: number,
  windowSeconds: number,
  createdBy: string,
  updatedAt: string
): Observable<void> {
  return execute(
    `INSERT INTO guild_spam_settings
       (guild_id, enabled, alert_channel_id, staff_role_id, message_threshold, window_seconds, created_by, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (guild_id) DO UPDATE SET
       enabled           = EXCLUDED.enabled,
       alert_channel_id  = EXCLUDED.alert_channel_id,
       staff_role_id     = EXCLUDED.staff_role_id,
       message_threshold = EXCLUDED.message_threshold,
       window_seconds    = EXCLUDED.window_seconds,
       created_by        = EXCLUDED.created_by,
       updated_at        = EXCLUDED.updated_at`,
    [guildId, enabled, alertChannelId, staffRoleId, messageThreshold, windowSeconds, createdBy, updatedAt]
  );
}

// ---------------------------------------------------------------------------
// pending_verification_submissions
// ---------------------------------------------------------------------------

export function insertPendingVerificationSubmission(
  guildId: string,
  userId: string,
  joinedAt: string,
  expiresAt: string
): Observable<void> {
  return execute(
    `INSERT INTO pending_verification_submissions (guild_id, user_id, joined_at, expires_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (guild_id, user_id) DO UPDATE SET
       joined_at  = EXCLUDED.joined_at,
       expires_at = EXCLUDED.expires_at`,
    [guildId, userId, joinedAt, expiresAt]
  );
}

export function deletePendingVerificationSubmission(guildId: string, userId: string): Observable<void> {
  return execute(
    "DELETE FROM pending_verification_submissions WHERE guild_id = $1 AND user_id = $2",
    [guildId, userId]
  );
}

export function getExpiredPendingVerificationSubmissions(now: string): Observable<PendingVerificationSubmissionRow[]> {
  return query<PendingVerificationSubmissionRow>(
    "SELECT * FROM pending_verification_submissions WHERE expires_at <= $1",
    [now]
  );
}

// ---------------------------------------------------------------------------
// free_games_settings
// ---------------------------------------------------------------------------

export function getFreeGamesSettings(guildId: string): Observable<GuildFreeGamesSettingsRow | null> {
  return queryOne<GuildFreeGamesSettingsRow>(
    "SELECT * FROM free_games_settings WHERE guild_id = $1",
    [guildId]
  );
}

export function getEnabledFreeGamesSettings(): Observable<GuildFreeGamesSettingsRow[]> {
  return query<GuildFreeGamesSettingsRow>(
    "SELECT * FROM free_games_settings WHERE enabled = TRUE"
  );
}

export function getAllFreeGamesSettings(): Observable<Pick<GuildFreeGamesSettingsRow, "guild_id" | "channel_id">[]> {
  return query<Pick<GuildFreeGamesSettingsRow, "guild_id" | "channel_id">>(
    "SELECT guild_id, channel_id FROM free_games_settings WHERE enabled = TRUE AND channel_id IS NOT NULL"
  );
}

export function upsertFreeGamesSettings(
  guildId: string,
  channelId: string,
  enabled: boolean,
  includeSteam: boolean,
  includeEpicgames: boolean,
  includeItchio: boolean,
  includeGog: boolean
): Observable<void> {
  return execute(
    `INSERT INTO free_games_settings
       (guild_id, channel_id, enabled, include_steam, include_epicgames, include_itchio, include_gog, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     ON CONFLICT (guild_id) DO UPDATE SET
       channel_id        = EXCLUDED.channel_id,
       enabled           = EXCLUDED.enabled,
       include_steam     = EXCLUDED.include_steam,
       include_epicgames = EXCLUDED.include_epicgames,
       include_itchio    = EXCLUDED.include_itchio,
       include_gog       = EXCLUDED.include_gog,
       updated_at        = NOW()`,
    [guildId, channelId, enabled, includeSteam, includeEpicgames, includeItchio, includeGog]
  );
}

// ---------------------------------------------------------------------------
// free_games
// ---------------------------------------------------------------------------

export function getAllFreeGames(): Observable<FreeGameRow[]> {
  return query<FreeGameRow>(
    "SELECT * FROM free_games ORDER BY expires_at ASC"
  );
}

// ---------------------------------------------------------------------------
// free_games_publications
// ---------------------------------------------------------------------------

export function insertFreeGamePublication(
  guildId: string,
  freeGameId: number,
  channelId: string | null,
  messageId: string | null
): Observable<void> {
  return execute(
    `INSERT INTO free_games_publications (guild_id, free_game_id, channel_id, message_id, published_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT DO NOTHING`,
    [guildId, freeGameId, channelId, messageId]
  );
}

export function getPublishedFreeGameIdsForGuild(guildId: string): Observable<{ free_game_id: number }[]> {
  return query<{ free_game_id: number }>(
    "SELECT free_game_id FROM free_games_publications WHERE guild_id = $1",
    [guildId]
  );
}

export function getFreeGamePublicationByMessageId(guildId: string, messageId: string): Observable<{ exists: boolean }> {
  return queryOne<{ "?column?": number }>(
    "SELECT 1 FROM free_games_publications WHERE guild_id = $1 AND message_id = $2",
    [guildId, messageId]
  ).pipe(map((row) => ({ exists: row !== null })));
}

export function getExpiredFreeGamePublications(): Observable<ExpiredFreeGamePublicationRow[]> {
  return query<ExpiredFreeGamePublicationRow>(
    `SELECT fgp.guild_id, fgp.free_game_id, fgp.channel_id, fgp.message_id
     FROM free_games_publications fgp
     INNER JOIN free_games fg ON fg.id = fgp.free_game_id
     WHERE fg.expires_at < NOW()
       AND fgp.channel_id IS NOT NULL
       AND fgp.message_id IS NOT NULL`
  );
}

export function deleteFreeGamePublication(guildId: string, freeGameId: number): Observable<void> {
  return execute(
    "DELETE FROM free_games_publications WHERE guild_id = $1 AND free_game_id = $2",
    [guildId, freeGameId]
  );
}

// ---------------------------------------------------------------------------
// guild_role_message_delete_settings
// ---------------------------------------------------------------------------

export function getGuildRoleMessageDeleteSettings(guildId: string): Observable<GuildRoleMessageDeleteSettingsRow | null> {
  return queryOne<GuildRoleMessageDeleteSettingsRow>(
    "SELECT * FROM guild_role_message_delete_settings WHERE guild_id = $1",
    [guildId]
  );
}

export function upsertGuildRoleMessageDeleteSettings(
  guildId: string,
  enabled: boolean,
  roleId1: string | null,
  roleId2: string | null,
  roleId3: string | null,
  roleId4: string | null,
  roleId5: string | null,
  updatedBy: string,
  updatedAt: string
): Observable<void> {
  return execute(
    `INSERT INTO guild_role_message_delete_settings
       (guild_id, enabled, role_id1, role_id2, role_id3, role_id4, role_id5, updated_by, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (guild_id) DO UPDATE SET
       enabled    = EXCLUDED.enabled,
       role_id1   = EXCLUDED.role_id1,
       role_id2   = EXCLUDED.role_id2,
       role_id3   = EXCLUDED.role_id3,
       role_id4   = EXCLUDED.role_id4,
       role_id5   = EXCLUDED.role_id5,
       updated_by = EXCLUDED.updated_by,
       updated_at = EXCLUDED.updated_at`,
    [guildId, enabled, roleId1, roleId2, roleId3, roleId4, roleId5, updatedBy, updatedAt]
  );
}

// ---------------------------------------------------------------------------
// role_panels
// ---------------------------------------------------------------------------

export function insertRolePanel(
  guildId: string,
  channelId: string,
  title: string,
  description: string | null,
  createdBy: string
): Observable<RolePanelRow> {
  return queryOne<RolePanelRow>(
    `INSERT INTO role_panels (guild_id, channel_id, title, description, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [guildId, channelId, title, description, createdBy]
  ).pipe(map((row) => row!));
}

export function updateRolePanelMessageId(messageId: string, id: number): Observable<void> {
  return execute(
    "UPDATE role_panels SET message_id = $1 WHERE id = $2",
    [messageId, id]
  );
}

export function getRolePanel(id: number): Observable<RolePanelRow | null> {
  return queryOne<RolePanelRow>(
    "SELECT * FROM role_panels WHERE id = $1",
    [id]
  );
}

export function getRolePanelByMessageId(messageId: string): Observable<RolePanelRow | null> {
  return queryOne<RolePanelRow>(
    "SELECT * FROM role_panels WHERE message_id = $1",
    [messageId]
  );
}

export function getRolePanelsByGuild(guildId: string): Observable<RolePanelRow[]> {
  return query<RolePanelRow>(
    "SELECT * FROM role_panels WHERE guild_id = $1 ORDER BY id DESC",
    [guildId]
  );
}

export function deleteRolePanel(id: number): Observable<void> {
  return execute("DELETE FROM role_panels WHERE id = $1", [id]);
}

// ---------------------------------------------------------------------------
// role_panel_options
// ---------------------------------------------------------------------------

export function insertRolePanelOption(
  panelId: number,
  roleId: string,
  label: string,
  emoji: string | null,
  buttonStyle: string,
  position: number
): Observable<void> {
  return execute(
    `INSERT INTO role_panel_options (panel_id, role_id, label, emoji, button_style, position)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [panelId, roleId, label, emoji, buttonStyle, position]
  );
}

export function getRolePanelOptions(panelId: number): Observable<RolePanelOptionRow[]> {
  return query<RolePanelOptionRow>(
    "SELECT * FROM role_panel_options WHERE panel_id = $1 ORDER BY position ASC",
    [panelId]
  );
}

export function deleteRolePanelOptions(panelId: number): Observable<void> {
  return execute("DELETE FROM role_panel_options WHERE panel_id = $1", [panelId]);
}

// ---------------------------------------------------------------------------
// reaction_role_categories
// ---------------------------------------------------------------------------

export function insertReactionRoleCategory(guildId: string, name: string): Observable<void> {
  return execute(
    "INSERT INTO reaction_role_categories (guild_id, name) VALUES ($1, $2)",
    [guildId, name]
  );
}

export function updateReactionRoleCategory(name: string, guildId: string, oldName: string): Observable<void> {
  return execute(
    "UPDATE reaction_role_categories SET name = $1 WHERE guild_id = $2 AND name = $3",
    [name, guildId, oldName]
  );
}

export function deleteReactionRoleCategory(guildId: string, name: string): Observable<void> {
  return execute(
    "DELETE FROM reaction_role_categories WHERE guild_id = $1 AND name = $2",
    [guildId, name]
  );
}

export function getReactionRoleCategory(guildId: string, name: string): Observable<ReactionRoleCategoryRow | null> {
  return queryOne<ReactionRoleCategoryRow>(
    "SELECT * FROM reaction_role_categories WHERE guild_id = $1 AND name = $2",
    [guildId, name]
  );
}

export function getReactionRoleCategories(guildId: string): Observable<ReactionRoleCategoryRow[]> {
  return query<ReactionRoleCategoryRow>(
    "SELECT * FROM reaction_role_categories WHERE guild_id = $1 ORDER BY name ASC",
    [guildId]
  );
}

// ---------------------------------------------------------------------------
// reaction_role_entries
// ---------------------------------------------------------------------------

export function insertReactionRoleEntry(
  categoryId: number,
  roleId: string,
  description: string,
  emoji: string
): Observable<void> {
  return execute(
    "INSERT INTO reaction_role_entries (category_id, role_id, description, emoji) VALUES ($1, $2, $3, $4)",
    [categoryId, roleId, description, emoji]
  );
}

export function updateReactionRoleEntry(
  description: string | null,
  emoji: string | null,
  roleId: string | null,
  categoryId: number,
  currentRoleId: string
): Observable<void> {
  return execute(
    `UPDATE reaction_role_entries
     SET description = COALESCE($1, description),
         emoji       = COALESCE($2, emoji),
         role_id     = COALESCE($3, role_id)
     WHERE category_id = $4 AND role_id = $5`,
    [description, emoji, roleId, categoryId, currentRoleId]
  );
}

export function deleteReactionRoleEntry(categoryId: number, roleId: string): Observable<void> {
  return execute(
    "DELETE FROM reaction_role_entries WHERE category_id = $1 AND role_id = $2",
    [categoryId, roleId]
  );
}

export function getReactionRoleEntries(categoryId: number): Observable<ReactionRoleEntryRow[]> {
  return query<ReactionRoleEntryRow>(
    "SELECT * FROM reaction_role_entries WHERE category_id = $1 ORDER BY id ASC",
    [categoryId]
  );
}

export function getReactionRoleEntryByEmoji(categoryId: number, emoji: string): Observable<ReactionRoleEntryRow | null> {
  return queryOne<ReactionRoleEntryRow>(
    "SELECT * FROM reaction_role_entries WHERE category_id = $1 AND emoji = $2",
    [categoryId, emoji]
  );
}

// ---------------------------------------------------------------------------
// reaction_role_panels
// ---------------------------------------------------------------------------

export function insertReactionRolePanel(
  categoryId: number,
  guildId: string,
  channelId: string,
  messageId: string
): Observable<void> {
  return execute(
    `INSERT INTO reaction_role_panels (category_id, guild_id, channel_id, message_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (category_id) DO UPDATE SET
       guild_id   = EXCLUDED.guild_id,
       channel_id = EXCLUDED.channel_id,
       message_id = EXCLUDED.message_id`,
    [categoryId, guildId, channelId, messageId]
  );
}

export function getReactionRolePanelByCategory(categoryId: number): Observable<ReactionRolePanelRow | null> {
  return queryOne<ReactionRolePanelRow>(
    "SELECT * FROM reaction_role_panels WHERE category_id = $1",
    [categoryId]
  );
}

export function getReactionRolePanelByMessageId(messageId: string): Observable<ReactionRolePanelRow | null> {
  return queryOne<ReactionRolePanelRow>(
    "SELECT * FROM reaction_role_panels WHERE message_id = $1",
    [messageId]
  );
}

export function deleteReactionRolePanel(categoryId: number): Observable<void> {
  return execute(
    "DELETE FROM reaction_role_panels WHERE category_id = $1",
    [categoryId]
  );
}

// ---------------------------------------------------------------------------
// guild_blacklist_join_notifications
// ---------------------------------------------------------------------------

export function upsertNewComerNotification(guildId: string, channelId: string): Observable<void> {
  return execute(
    `INSERT INTO guild_blacklist_join_notifications (guild_id, channel_id)
     VALUES ($1, $2)
     ON CONFLICT (guild_id) DO UPDATE SET channel_id = EXCLUDED.channel_id`,
    [guildId, channelId]
  );
}

export function getNewComerNotification(guildId: string): Observable<NewComerNotificationRow | null> {
  return queryOne<NewComerNotificationRow>(
    "SELECT * FROM guild_blacklist_join_notifications WHERE guild_id = $1",
    [guildId]
  );
}

export function deleteNewComerNotification(guildId: string): Observable<void> {
  return execute(
    "DELETE FROM guild_blacklist_join_notifications WHERE guild_id = $1",
    [guildId]
  );
}

// ---------------------------------------------------------------------------
// banned_guilds
// ---------------------------------------------------------------------------

export function getBannedGuild(guildId: string): Observable<boolean> {
  return queryOne<{ "?column?": number }>(
    "SELECT 1 FROM banned_guilds WHERE guild_id = $1 LIMIT 1",
    [guildId]
  ).pipe(map((row) => row !== null));
}

// ---------------------------------------------------------------------------
// autokick

export function upsertAutokickNewMembers(guildId: string, days: number, text_to_send: string): Observable<void> {
  return execute(
    `INSERT INTO AUTOKICK_SETTINGS (guild_id, days, text_to_send)
     VALUES ($1, $2, $3)
     ON CONFLICT (guild_id) DO UPDATE SET days = EXCLUDED.days, text_to_send = EXCLUDED.text_to_send`,
    [guildId, days, text_to_send]
  );
}

export function getAutokickNewMembers(guildId: string): Observable<AutokickSettingsRow | null> {
  return queryOne<AutokickSettingsRow>(
    "SELECT * FROM AUTOKICK_SETTINGS WHERE guild_id = $1",
    [guildId]
  );
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  required: boolean;
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
  enabled: boolean;
  alert_channel_id: string | null;
  staff_role_id: string | null;
  message_threshold: number;
  window_seconds: number;
  created_by: string;
  updated_at: string;
};

export type GuildWelcomeMessageRow = {
  guild_id: string;
  dm_message: string;
  updated_at: string;
};

export type GuildFreeGamesSettingsRow = {
  guild_id: string;
  channel_id: string;
  enabled: boolean;
  include_steam: boolean;
  include_epicgames: boolean;
  include_itchio: boolean;
  include_gog: boolean;
  created_at: string;
  updated_at: string;
};

export type FreeGameRow = {
  id: number;
  image_url: string | null;
  provider_code: string;
  title: string;
  promo_url: string;
  expires_at: string;
  promo_type: string;
  created_at: string;
  updated_at: string;
};

export type ExpiredFreeGamePublicationRow = {
  guild_id: string;
  free_game_id: number;
  channel_id: string;
  message_id: string;
};

export type PendingVerificationSubmissionRow = {
  guild_id: string;
  user_id: string;
  joined_at: string;
  expires_at: string;
};

export type GuildRoleMessageDeleteSettingsRow = {
  guild_id: string;
  enabled: boolean;
  role_id1: string | null;
  role_id2: string | null;
  role_id3: string | null;
  role_id4: string | null;
  role_id5: string | null;
  updated_by: string;
  updated_at: string;
};

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

export type NewComerNotificationRow = {
  guild_id: string;
  channel_id: string;
};

export type AutokickSettingsRow = {
  guild_id: string;
  days: number;
  text_to_send: string;
};