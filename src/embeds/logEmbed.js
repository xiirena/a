const { EmbedBuilder } = require('discord.js');

function buildLogEmbed({ action, target, moderator, reason, duration, dmSent, guildName, caseId }) {
  const colorMap = {
    Ban: 0xED4245,
    Mute: 0xFEE75C,
    Warn: 0xF0B232,
    Blacklist: 0x23272A,
    Unblacklist: 0x57F287,
    'Mute Expired': 0x57F287,
    'Ban Expired': 0x57F287
  };

  const embed = new EmbedBuilder()
    .setTitle(action)
    .setColor(colorMap[action] || 0x5865F2)
    .setTimestamp();

  if (caseId) embed.setAuthor({ name: `Case #${caseId}` });

  embed.addFields(
    { name: 'Punished User', value: `<@${target.id}>\n\`${target.tag}\`\n\`${target.id}\``, inline: true },
    { name: 'Punished By', value: moderator ? `<@${moderator.id}>\n\`${moderator.tag}\`` : 'System\n`Auto-expiration`', inline: true },
    { name: 'Reason', value: reason || 'No reason provided', inline: false },
    { name: 'Duration', value: duration || 'Permanent', inline: true },
    { name: 'Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
    { name: 'DM Status', value: dmSent ? 'Delivered' : 'Failed (DMs disabled)', inline: true }
  );

  if (guildName) embed.addFields({ name: 'Server', value: guildName, inline: true });

  return embed.setFooter({ text: 'Punisher Moderation System' });
}

module.exports = { buildLogEmbed };
