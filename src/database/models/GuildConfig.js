// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Guild Config Model
// Per-guild configuration for escalation and anti-raid settings.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
  guildId:  { type: String, required: true, unique: true },
  raidMode: { type: Boolean, default: false },

  // Escalation thresholds — maps warning count to action
  // Stored as an array of { count, action, duration, label }
  escalationThresholds: {
    type: [
      {
        count:    { type: Number, required: true },
        action:   { type: String, required: true, enum: ['mute', 'kick', 'ban'] },
        duration: { type: String, default: null },
        label:    { type: String, required: true },
      },
    ],
    default: [
      { count: 3,  action: 'mute', duration: '1h', label: '1 Hour Mute' },
      { count: 5,  action: 'mute', duration: '1d', label: '1 Day Mute' },
      { count: 7,  action: 'kick', duration: null, label: 'Kick' },
      { count: 10, action: 'ban',  duration: null, label: 'Permanent Ban' },
    ],
  },

  // Anti-raid configuration
  antiRaid: {
    joinThreshold:       { type: Number, default: 10 },
    joinWindowMs:        { type: Number, default: 10_000 },
    massActionThreshold: { type: Number, default: 5 },
    massActionWindowMs:  { type: Number, default: 30_000 },
  },
});

module.exports = model('GuildConfig', guildConfigSchema);
