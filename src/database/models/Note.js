// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Note Model
// Private staff notes attached to users. Only visible to staff.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
  guildId:   { type: String, required: true, index: true },
  userId:    { type: String, required: true, index: true },
  authorId:  { type: String, required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

noteSchema.index({ guildId: 1, userId: 1 });

module.exports = model('Note', noteSchema);
