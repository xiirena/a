const { EmbedBuilder } = require('discord.js');

function buildPunishmentEmbed({ guildName, action, reason, duration, expiresAt, appealLink }) {
  const embed = new EmbedBuilder()
    .setTitle('Punishment Notice')
    .setColor(0xED4245)
    .addFields(
      { name: 'Server', value: guildName, inline: true },
      { name: 'Action', value: action, inline: true },
      { name: 'Reason', value: reason || 'No reason provided', inline: false },
      { name: 'Duration', value: duration || 'Permanent', inline: true },
      { name: 'Ends', value: expiresAt ? `<t:${Math.floor(expiresAt / 1000)}:F>` : 'Never', inline: true }
    )
    .setFooter({ text: 'Punisher Moderation System' })
    .setTimestamp();

  if (appealLink) {
    embed.addFields({ name: 'Appeal', value: `[Click here to appeal](${appealLink})`, inline: false });
  }

  return embed;
}

module.exports = { buildPunishmentEmbed };
