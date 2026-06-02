const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', '..', 'punisher.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create punishments table
db.exec(`
  CREATE TABLE IF NOT EXISTS punishments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('ban', 'mute', 'warn', 'blacklist')),
    reason TEXT NOT NULL DEFAULT 'No reason provided',
    moderator_id TEXT NOT NULL,
    duration_ms INTEGER,
    created_at INTEGER NOT NULL,
    expires_at INTEGER,
    active INTEGER NOT NULL DEFAULT 1,
    dm_sent INTEGER NOT NULL DEFAULT 0
  );
`);

// Prepared statements
const stmts = {
  addPunishment: db.prepare(`
    INSERT INTO punishments (guild_id, user_id, type, reason, moderator_id, duration_ms, created_at, expires_at, active, dm_sent)
    VALUES (@guild_id, @user_id, @type, @reason, @moderator_id, @duration_ms, @created_at, @expires_at, @active, @dm_sent)
  `),

  getExpiredPunishments: db.prepare(`
    SELECT * FROM punishments
    WHERE active = 1
      AND expires_at IS NOT NULL
      AND expires_at <= @now
      AND type IN ('ban', 'mute')
  `),

  deactivatePunishment: db.prepare(`
    UPDATE punishments SET active = 0 WHERE id = @id
  `),

  getActivePunishments: db.prepare(`
    SELECT * FROM punishments
    WHERE guild_id = @guild_id
      AND user_id = @user_id
      AND active = 1
    ORDER BY created_at DESC
  `),

  getPunishmentHistory: db.prepare(`
    SELECT * FROM punishments
    WHERE guild_id = @guild_id
      AND user_id = @user_id
    ORDER BY created_at DESC
    LIMIT 25
  `),

  getActiveBlacklist: db.prepare(`
    SELECT * FROM punishments
    WHERE guild_id = @guild_id
      AND user_id = @user_id
      AND type = 'blacklist'
      AND active = 1
    LIMIT 1
  `),

  deactivateBlacklist: db.prepare(`
    UPDATE punishments
    SET active = 0
    WHERE guild_id = @guild_id
      AND user_id = @user_id
      AND type = 'blacklist'
      AND active = 1
  `)
};

/**
 * Add a new punishment record.
 * @returns {object} The inserted row info (lastInsertRowid)
 */
function addPunishment({ guild_id, user_id, type, reason, moderator_id, duration_ms, dm_sent }) {
  const now = Date.now();
  const expires_at = duration_ms ? now + duration_ms : null;

  return stmts.addPunishment.run({
    guild_id,
    user_id,
    type,
    reason,
    moderator_id,
    duration_ms: duration_ms || null,
    created_at: now,
    expires_at,
    active: 1,
    dm_sent: dm_sent ? 1 : 0
  });
}

/**
 * Get all punishments that have expired but are still marked active.
 */
function getExpiredPunishments() {
  return stmts.getExpiredPunishments.all({ now: Date.now() });
}

/**
 * Mark a punishment as inactive.
 */
function deactivatePunishment(id) {
  return stmts.deactivatePunishment.run({ id });
}

/**
 * Get active punishments for a user in a guild.
 */
function getActivePunishments(guild_id, user_id) {
  return stmts.getActivePunishments.all({ guild_id, user_id });
}

/**
 * Get full punishment history for a user in a guild (last 25).
 */
function getPunishmentHistory(guild_id, user_id) {
  return stmts.getPunishmentHistory.all({ guild_id, user_id });
}

/**
 * Get active blacklist for a user in a guild.
 */
function getActiveBlacklist(guild_id, user_id) {
  return stmts.getActiveBlacklist.get({ guild_id, user_id }) || null;
}

/**
 * Deactivate all active blacklists for a user in a guild.
 */
function deactivateBlacklist(guild_id, user_id) {
  return stmts.deactivateBlacklist.run({ guild_id, user_id });
}

module.exports = {
  db,
  addPunishment,
  getExpiredPunishments,
  deactivatePunishment,
  getActivePunishments,
  getPunishmentHistory,
  getActiveBlacklist,
  deactivateBlacklist
};
