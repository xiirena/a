// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Constants & Configuration
// Central configuration for colors, thresholds, and styling.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {
  // ── Embed Color Coding ──────────────────────────────────────
  COLORS: {
    BAN:          0xED4245,  // Red
    UNBAN:        0x57F287,  // Green
    KICK:         0xE67E22,  // Orange
    WARN:         0xFEE75C,  // Yellow
    UNWARN:       0x57F287,  // Green
    MUTE:         0xF0B232,  // Amber
    UNMUTE:       0x57F287,  // Green
    TIMEOUT:      0xF0B232,  // Amber
    UNTIMEOUT:    0x57F287,  // Green
    SOFTBAN:      0xE74C3C,  // Dark Red
    QUARANTINE:   0x9B59B6,  // Purple
    UNQUARANTINE: 0x57F287,  // Green
    APPEAL:       0x3498DB,  // Blue
    AUTOMOD:      0xE67E22,  // Orange
    RAID:         0xFF0000,  // Bright Red
    INFO:         0x5865F2,  // Blurple
    SUCCESS:      0x57F287,  // Green
    ERROR:        0xED4245,  // Red
    PERMISSION:   0x95A5A6,  // Grey
    LOG:          0x2F3136,  // Dark
  },

  // ── Courtroom Theme Styling ─────────────────────────────────
  DIVIDER: '━━━━━━━━━━━━━━━━━━━━━━',
  BOT_NAME: '⚖️ THE PUNISHER',
  FOOTER_TEXT: '⚖️ The Punisher • Justice System',

  // ── Case ID Formatting ──────────────────────────────────────
  CASE_ID_PAD: 6,  // #000001

  // ── Default Cooldown (seconds) ──────────────────────────────
  DEFAULT_COOLDOWN: 3,

  // ── Max Discord Timeout (28 days in ms) ─────────────────────
  MAX_TIMEOUT_MS: 28 * 24 * 60 * 60 * 1000,

  // ── Default Escalation Thresholds ───────────────────────────
  // Maps active warning count → automatic punishment
  DEFAULT_ESCALATION: {
    3:  { action: 'mute',  duration: '1h',  label: '1 Hour Mute' },
    5:  { action: 'mute',  duration: '1d',  label: '1 Day Mute' },
    7:  { action: 'kick',  duration: null,   label: 'Kick' },
    10: { action: 'ban',   duration: null,   label: 'Permanent Ban' },
  },

  // ── Anti-Raid Defaults ──────────────────────────────────────
  ANTI_RAID: {
    JOIN_THRESHOLD: 10,          // Max joins before trigger
    JOIN_WINDOW_MS: 10_000,      // Time window (10 seconds)
    MASS_ACTION_THRESHOLD: 5,    // Mass channel/role/webhook creation limit
    MASS_ACTION_WINDOW_MS: 30_000,
  },

  // ── Automod Defaults ────────────────────────────────────────
  AUTOMOD_DEFAULTS: {
    enabled: false,
    blacklistedWords: [
      'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded',
      'kys', 'kill yourself', 'tranny', 'spic', 'chink', 'gook',
      'wetback', 'coon', 'beaner', 'kike', 'dyke',
    ],
    blockInvites: true,
    blockScamLinks: true,
    maxCapsPercent: 80,
    maxMentions: 5,
    antiSpam: true,
    spamThreshold: 5,
    spamIntervalMs: 5_000,
  },

  // ── Known Scam Link Patterns ────────────────────────────────
  SCAM_PATTERNS: [
    /discord[\-\.]?gift/i,
    /free[\-\s]?nitro/i,
    /steam[\-\s]?community[\-\.](?!com)/i,
    /dlscord/i,
    /discorc/i,
    /discorcl/i,
  ],

  // ── Invite Link Pattern ─────────────────────────────────────
  INVITE_PATTERN: /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9]+/i,
};
