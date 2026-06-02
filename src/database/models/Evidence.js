// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Evidence Model
// Evidence attachments (images, videos, links) tied to cases.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const evidenceSchema = new Schema({
  caseId:      { type: Number, required: true },
  guildId:     { type: String, required: true, index: true },
  addedBy:     { type: String, required: true },
  type:        { type: String, default: 'link', enum: ['image', 'video', 'screenshot', 'link'] },
  url:         { type: String, required: true },
  description: { type: String, default: null },
  createdAt:   { type: Date, default: Date.now },
});

evidenceSchema.index({ guildId: 1, caseId: 1 });

module.exports = model('Evidence', evidenceSchema);
