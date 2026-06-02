const { EmbedBuilder } = require('discord.js');

function buildExpirationEmbed({ type, guildName, reason, createdAt, expiresAt }) {
  const served = expiresAt - createdAt;
  const hours = Math.floor(served / 3_600_000);
  const minutes = Math.floor((served % 3_600_000) / 60_000);
  const timeServed = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const messages = {
    mute: 'Your mute has expired.',
    ban: 'Your ban has expired. You may rejoin.'
  };

  return new EmbedBuilder()
    .setTitle('Punishment Expired')
    .setColor(0x57F287)
    .setDescription(messages[type] || 'Your punishment has expired.')
    .addFields(
      { name: 'Server', value: guildName, inline: true },
      { name: 'Action Expired', value: type.charAt(0).toUpperCase() + type.slice(1), inline: true },
      { name: 'Original Reason', value: reason || 'No reason provided', inline: false },
      { name: 'Time Served', value: timeServed, inline: true }
    )
    .setFooter({ text: 'Punisher Moderation System' })
    .setTimestamp();
}

module.exports = { buildExpirationEmbed };
