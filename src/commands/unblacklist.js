const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildBlacklistRemovedEmbed } = require('../embeds/blacklistEmbed');
const { sendDM } = require('../utils/sendDM');
const { sendLog } = require('../utils/sendLog');
const { getActiveBlacklist, deactivateBlacklist } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unblacklist')
    .setDescription('Remove a user blacklist and unban them')
    .addStringOption(option => option.setName('user-id').setDescription('User ID to unblacklist').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const targetId = interaction.options.getString('user-id');
    const targetUser = await interaction.client.users.fetch(targetId).catch(() => null);
    if (!targetUser) return interaction.reply({ content: 'Invalid user ID. Could not find a user with that ID.', ephemeral: true });

    const blacklistRecord = getActiveBlacklist(interaction.guild.id, targetId);
    if (!blacklistRecord) return interaction.reply({ content: 'This user is not blacklisted.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    await interaction.guild.members.unban(targetId, `Blacklist removed by ${interaction.user.tag}`.slice(0, 512))
      .catch(error => console.warn(`[Punisher] Could not unban ${targetId}: ${error.message}`));

    deactivateBlacklist(interaction.guild.id, targetId);

    const dmEmbed = buildBlacklistRemovedEmbed({
      guildName: interaction.guild.name,
      moderator: interaction.user.tag,
      appealLink: process.env.APPEAL_LINK || null
    });

    const dmResult = await sendDM(targetUser, { embeds: [dmEmbed] });

    await sendLog(interaction.client, {
      action: 'Unblacklist',
      target: { id: targetUser.id, tag: targetUser.tag },
      moderator: { id: interaction.user.id, tag: interaction.user.tag },
      reason: `Blacklist removed (original: ${blacklistRecord.reason})`,
      duration: 'N/A',
      dmSent: dmResult.success,
      guildName: interaction.guild.name
    });

    const dmStatus = dmResult.success ? '' : '\nWarning: Could not DM user.';
    return interaction.editReply({ content: `Done: ${targetUser.tag} has been unblacklisted and unbanned.${dmStatus}` });
  }
};
