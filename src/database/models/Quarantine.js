// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Quarantine Model
// Stores removed roles when a user is quarantined.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const quarantineSchema = new Schema({
  guildId:        { type: String, required: true },
  userId:         { type: String, required: true },
  storedRoles:    { type: [String], default: [] },   // Role IDs removed during quarantine
  quarantinedAt:  { type: Date, default: Date.now },
});

quarantineSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model('Quarantine', quarantineSchema);
