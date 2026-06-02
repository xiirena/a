const { EmbedBuilder } = require('discord.js');

function buildBlacklistAppliedEmbed({ guildName, reason, appealLink }) {
  const embed = new EmbedBuilder()
    .setTitle('Blacklist Notice')
    .setColor(0x23272A)
    .setDescription(
      'You have been permanently blacklisted from this server.\n\n' +
      'A blacklist is permanent and severe. Unlike a standard ban, it will not expire automatically.'
    )
    .addFields(
      { name: 'Server', value: guildName, inline: true },
      { name: 'Action', value: 'Blacklist (Permanent)', inline: true },
      { name: 'Reason', value: reason || 'No reason provided', inline: false },
      { name: 'Duration', value: 'Permanent', inline: true },
      { name: 'Ends', value: 'Never', inline: true }
    )
    .setFooter({ text: 'Punisher Moderation System' })
    .setTimestamp();

  if (appealLink) {
    embed.addFields({ name: 'Appeal', value: `[Submit an appeal](${appealLink})`, inline: false });
  }

  return embed;
}

function buildBlacklistRemovedEmbed({ guildName, moderator, appealLink }) {
  const embed = new EmbedBuilder()
    .setTitle('Blacklist Removed')
    .setColor(0x57F287)
    .setDescription('Your blacklist has been removed. You may now rejoin the server if you have an invite.')
    .addFields(
      { name: 'Server', value: guildName, inline: true },
      { name: 'Action', value: 'Blacklist Removed', inline: true },
      { name: 'Removed By', value: moderator, inline: false }
    )
    .setFooter({ text: 'Punisher Moderation System' })
    .setTimestamp();

  if (appealLink) {
    embed.addFields({ name: 'Rejoin', value: `[Server Invite / Appeal](${appealLink})`, inline: false });
  }

  return embed;
}

module.exports = { buildBlacklistAppliedEmbed, buildBlacklistRemovedEmbed };
