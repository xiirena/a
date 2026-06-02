// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Automod Config Model
// Per-guild automod settings (word filters, spam, invites, etc.)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');
const { AUTOMOD_DEFAULTS } = require('../../config/constants');

const automodConfigSchema = new Schema({
  guildId:          { type: String, required: true, unique: true },
  enabled:          { type: Boolean, default: AUTOMOD_DEFAULTS.enabled },
  blacklistedWords: { type: [String], default: AUTOMOD_DEFAULTS.blacklistedWords },
  blockInvites:     { type: Boolean, default: AUTOMOD_DEFAULTS.blockInvites },
  blockScamLinks:   { type: Boolean, default: AUTOMOD_DEFAULTS.blockScamLinks },
  maxCapsPercent:   { type: Number, default: AUTOMOD_DEFAULTS.maxCapsPercent },
  maxMentions:      { type: Number, default: AUTOMOD_DEFAULTS.maxMentions },
  antiSpam:         { type: Boolean, default: AUTOMOD_DEFAULTS.antiSpam },
  spamThreshold:    { type: Number, default: AUTOMOD_DEFAULTS.spamThreshold },
  spamIntervalMs:   { type: Number, default: AUTOMOD_DEFAULTS.spamIntervalMs },
});

module.exports = model('AutomodConfig', automodConfigSchema);
