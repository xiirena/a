// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Case Model
// Stores all punishment case records (ban, kick, warn, etc.).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const caseSchema = new Schema({
  caseId:      { type: Number, required: true },
  guildId:     { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: [
      'ban', 'unban', 'kick', 'mute', 'unmute',
      'timeout', 'untimeout', 'warn', 'unwarn',
      'softban', 'quarantine', 'unquarantine',
    ],
  },
  userId:      { type: String, required: true, index: true },
  moderatorId: { type: String, required: true },
  reason:      { type: String, default: 'No reason provided' },
  duration:    { type: String, default: null },     // Human-readable duration
  durationMs:  { type: Number, default: null },     // Duration in milliseconds
  timestamp:   { type: Date, default: Date.now },
  expiresAt:   { type: Date, default: null },
  active:      { type: Boolean, default: true },
  dmSent:      { type: Boolean, default: false },
  removed:     { type: Boolean, default: false },   // Soft-delete flag
});

// Compound index for efficient queries
caseSchema.index({ guildId: 1, caseId: 1 }, { unique: true });
caseSchema.index({ guildId: 1, userId: 1 });
caseSchema.index({ guildId: 1, moderatorId: 1 });
caseSchema.index({ active: 1, expiresAt: 1 });

module.exports = model('Case', caseSchema);
