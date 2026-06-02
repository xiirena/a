const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildPunishmentEmbed } = require('../embeds/punishmentEmbed');
const { sendDM } = require('../utils/sendDM');
const { sendLog } = require('../utils/sendLog');
const { parseDuration } = require('../utils/parseDuration');
const { addPunishment } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration such as 1h, 7d, or 30d. Leave empty for permanent.').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const parsed = parseDuration(interaction.options.getString('duration'));
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (targetUser.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot ban yourself.', ephemeral: true });
    }
    if (targetUser.id === interaction.client.user.id) {
      return interaction.reply({ content: 'I cannot ban myself.', ephemeral: true });
    }
    if (targetMember) {
      if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ content: 'You cannot ban a member with an equal or higher role.', ephemeral: true });
      }
      if (!targetMember.bannable) {
        return interaction.reply({ content: 'I cannot ban this user. Move my role above their highest role and make sure I have Ban Members.', ephemeral: true });
      }
    }

    await interaction.deferReply({ ephemeral: true });

    const expiresAt = parsed ? Date.now() + parsed.ms : null;
    const dmEmbed = buildPunishmentEmbed({
      guildName: interaction.guild.name,
      action: 'Ban',
      reason,
      duration: parsed ? parsed.human : 'Permanent',
      expiresAt,
      appealLink: process.env.APPEAL_LINK || null
    });

    const dmResult = await sendDM(targetUser, { embeds: [dmEmbed] });

    await interaction.guild.members.ban(targetUser.id, {
      reason: `${reason} | By: ${interaction.user.tag}`.slice(0, 512),
      deleteMessageSeconds: 0
    });

    const result = addPunishment({
      guild_id: interaction.guild.id,
      user_id: targetUser.id,
      type: 'ban',
      reason,
      moderator_id: interaction.user.id,
      duration_ms: parsed ? parsed.ms : null,
      dm_sent: dmResult.success
    });

    await sendLog(interaction.client, {
      action: 'Ban',
      target: { id: targetUser.id, tag: targetUser.tag },
      moderator: { id: interaction.user.id, tag: interaction.user.tag },
      reason,
      duration: parsed ? parsed.human : 'Permanent',
      dmSent: dmResult.success,
      guildName: interaction.guild.name,
      caseId: result.lastInsertRowid
    });

    const dmStatus = dmResult.success ? '' : '\nWarning: Could not DM user.';
    const expiryText = expiresAt ? `Expires: <t:${Math.floor(expiresAt / 1000)}:R>` : 'Permanent.';
    return interaction.editReply({ content: `Done: ${targetUser.tag} has been banned. ${expiryText}${dmStatus}` });
  }
};
