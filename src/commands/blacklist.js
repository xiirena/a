const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildBlacklistAppliedEmbed } = require('../embeds/blacklistEmbed');
const { sendDM } = require('../utils/sendDM');
const { sendLog } = require('../utils/sendLog');
const { addPunishment, getActiveBlacklist } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Permanently blacklist a user from the server')
    .addUserOption(option => option.setName('user').setDescription('User to blacklist').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the blacklist').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (targetUser.id === interaction.user.id) return interaction.reply({ content: 'You cannot blacklist yourself.', ephemeral: true });
    if (targetUser.id === interaction.client.user.id) return interaction.reply({ content: 'I cannot blacklist myself.', ephemeral: true });

    const existing = getActiveBlacklist(interaction.guild.id, targetUser.id);
    if (existing) return interaction.reply({ content: 'This user is already blacklisted.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    const dmEmbed = buildBlacklistAppliedEmbed({
      guildName: interaction.guild.name,
      reason,
      appealLink: process.env.APPEAL_LINK || null
    });

    const dmResult = await sendDM(targetUser, { embeds: [dmEmbed] });

    await interaction.guild.members.ban(targetUser.id, {
      reason: `[BLACKLIST] ${reason} | By: ${interaction.user.tag}`.slice(0, 512),
      deleteMessageSeconds: 0
    });

    const result = addPunishment({
      guild_id: interaction.guild.id,
      user_id: targetUser.id,
      type: 'blacklist',
      reason,
      moderator_id: interaction.user.id,
      duration_ms: null,
      dm_sent: dmResult.success
    });

    await sendLog(interaction.client, {
      action: 'Blacklist',
      target: { id: targetUser.id, tag: targetUser.tag },
      moderator: { id: interaction.user.id, tag: interaction.user.tag },
      reason,
      duration: 'Permanent',
      dmSent: dmResult.success,
      guildName: interaction.guild.name,
      caseId: result.lastInsertRowid
    });

    const dmStatus = dmResult.success ? '' : '\nWarning: Could not DM user.';
    return interaction.editReply({ content: `Done: ${targetUser.tag} has been permanently blacklisted.${dmStatus}` });
  }
};
