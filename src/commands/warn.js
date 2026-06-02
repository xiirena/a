const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildPunishmentEmbed } = require('../embeds/punishmentEmbed');
const { sendDM } = require('../utils/sendDM');
const { sendLog } = require('../utils/sendLog');
const { addPunishment } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    if (targetUser.id === interaction.user.id) return interaction.reply({ content: 'You cannot warn yourself.', ephemeral: true });
    if (targetUser.bot) return interaction.reply({ content: 'You cannot warn a bot.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    const dmEmbed = buildPunishmentEmbed({
      guildName: interaction.guild.name,
      action: 'Warn',
      reason,
      duration: 'N/A',
      expiresAt: null,
      appealLink: process.env.APPEAL_LINK || null
    });

    const dmResult = await sendDM(targetUser, { embeds: [dmEmbed] });
    const result = addPunishment({
      guild_id: interaction.guild.id,
      user_id: targetUser.id,
      type: 'warn',
      reason,
      moderator_id: interaction.user.id,
      duration_ms: null,
      dm_sent: dmResult.success
    });

    await sendLog(interaction.client, {
      action: 'Warn',
      target: { id: targetUser.id, tag: targetUser.tag },
      moderator: { id: interaction.user.id, tag: interaction.user.tag },
      reason,
      duration: 'N/A',
      dmSent: dmResult.success,
      guildName: interaction.guild.name,
      caseId: result.lastInsertRowid
    });

    const dmStatus = dmResult.success ? '' : '\nWarning: Could not DM user.';
    return interaction.editReply({ content: `Done: ${targetUser.tag} has been warned.${dmStatus}` });
  }
};
