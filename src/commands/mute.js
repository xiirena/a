const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildPunishmentEmbed } = require('../embeds/punishmentEmbed');
const { sendDM } = require('../utils/sendDM');
const { sendLog } = require('../utils/sendLog');
const { parseDuration } = require('../utils/parseDuration');
const { addPunishment } = require('../database/db');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout/mute a user')
    .addUserOption(option => option.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the mute').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration such as 30m, 2h, or 7d. Max 28 days.').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const parsed = parseDuration(interaction.options.getString('duration'));

    if (!parsed) return interaction.reply({ content: 'Provide a valid duration like 30m, 2h, or 7d.', ephemeral: true });
    if (parsed.ms > MAX_TIMEOUT_MS) return interaction.reply({ content: 'Mute duration cannot exceed 28 days.', ephemeral: true });

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    if (targetUser.id === interaction.user.id) return interaction.reply({ content: 'You cannot mute yourself.', ephemeral: true });
    if (targetUser.id === interaction.client.user.id) return interaction.reply({ content: 'I cannot mute myself.', ephemeral: true });
    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'You cannot mute a member with an equal or higher role.', ephemeral: true });
    }
    if (!targetMember.moderatable) {
      return interaction.reply({ content: 'I cannot mute this user. Move my role above their highest role and make sure I have Moderate Members.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const expiresAt = Date.now() + parsed.ms;
    const dmEmbed = buildPunishmentEmbed({
      guildName: interaction.guild.name,
      action: 'Mute',
      reason,
      duration: parsed.human,
      expiresAt,
      appealLink: process.env.APPEAL_LINK || null
    });

    const dmResult = await sendDM(targetUser, { embeds: [dmEmbed] });
    await targetMember.timeout(parsed.ms, `${reason} | By: ${interaction.user.tag}`.slice(0, 512));

    const result = addPunishment({
      guild_id: interaction.guild.id,
      user_id: targetUser.id,
      type: 'mute',
      reason,
      moderator_id: interaction.user.id,
      duration_ms: parsed.ms,
      dm_sent: dmResult.success
    });

    await sendLog(interaction.client, {
      action: 'Mute',
      target: { id: targetUser.id, tag: targetUser.tag },
      moderator: { id: interaction.user.id, tag: interaction.user.tag },
      reason,
      duration: parsed.human,
      dmSent: dmResult.success,
      guildName: interaction.guild.name,
      caseId: result.lastInsertRowid
    });

    const dmStatus = dmResult.success ? '' : '\nWarning: Could not DM user.';
    return interaction.editReply({ content: `Done: ${targetUser.tag} has been muted. Expires: <t:${Math.floor(expiresAt / 1000)}:R>${dmStatus}` });
  }
};
