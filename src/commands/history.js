const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPunishmentHistory } = require('../database/db');
const { formatDuration } = require('../utils/parseDuration');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('View punishment history for a user')
    .addUserOption(option => option.setName('user').setDescription('User to check history for').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const records = getPunishmentHistory(interaction.guild.id, targetUser.id);

    if (records.length === 0) {
      return interaction.reply({ content: `${targetUser.tag} has no punishment history.`, ephemeral: true });
    }

    const lines = records.map((record, index) => {
      const status = record.active ? 'Active' : 'Resolved';
      const date = `<t:${Math.floor(record.created_at / 1000)}:f>`;
      const duration = record.duration_ms ? formatDuration(record.duration_ms) : 'Permanent';

      return `**${index + 1}. ${record.type.toUpperCase()}** - ${date}\n` +
        `> Reason: ${record.reason}\n` +
        `> Duration: ${duration} | Status: ${status}\n` +
        `> Moderator: <@${record.moderator_id}>`;
    });

    const description = lines.join('\n\n');
    const embed = new EmbedBuilder()
      .setTitle(`Punishment History - ${targetUser.tag}`)
      .setColor(0x5865F2)
      .setDescription(description.length > 4096 ? `${description.substring(0, 4090)}...` : description)
      .setFooter({ text: `${records.length} record(s) found | Punisher Moderation System` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
