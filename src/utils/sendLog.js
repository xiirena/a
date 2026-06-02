const { buildLogEmbed } = require('../embeds/logEmbed');

async function sendLog(client, opts) {
  const logChannelId = process.env.PUNISHMENT_CHANNEL;
  if (!logChannelId) {
    console.warn('[Punisher] PUNISHMENT_CHANNEL not set; skipping log.');
    return;
  }

  try {
    const channel = await client.channels.fetch(logChannelId);
    if (!channel || !channel.isTextBased()) {
      console.warn('[Punisher] Log channel not found or not text-based.');
      return;
    }

    const embed = buildLogEmbed(opts);
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`[Punisher] Failed to send log: ${error.message}`);
  }
}

module.exports = { sendLog };
