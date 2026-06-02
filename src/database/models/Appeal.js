// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Appeal Model
// Stores punishment appeal submissions linked to case IDs.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const appealSchema = new Schema({
  caseId:     { type: Number, required: true },
  guildId:    { type: String, required: true, index: true },
  userId:     { type: String, required: true },
  reason:     { type: String, required: true },          // User's appeal reason
  status:     { type: String, default: 'pending', enum: ['pending', 'accepted', 'denied'] },
  reviewedBy: { type: String, default: null },           // Moderator who reviewed
  reviewNote: { type: String, default: null },           // Staff note on decision
  createdAt:  { type: Date, default: Date.now },
  reviewedAt: { type: Date, default: null },
});

appealSchema.index({ guildId: 1, caseId: 1 });
appealSchema.index({ guildId: 1, userId: 1 });

module.exports = model('Appeal', appealSchema);
