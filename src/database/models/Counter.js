// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — Counter Model
// Atomic auto-incrementing counter for case IDs per guild.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { Schema, model } = require('mongoose');

const counterSchema = new Schema({
  _id: { type: String, required: true },        // e.g. "cases_<guildId>"
  sequenceValue: { type: Number, default: 0 },
});

/**
 * Atomically increment and return the next sequence value.
 * @param {string} sequenceName - Unique sequence identifier
 * @returns {Promise<number>} The next incremented value
 */
counterSchema.statics.getNextSequence = async function (sequenceName) {
  const counter = await this.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequenceValue;
};

module.exports = model('Counter', counterSchema);
