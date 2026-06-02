const { ActivityType } = require('discord.js');
const { getExpiredPunishments, deactivatePunishment } = require('../database/db');
const { buildExpirationEmbed } = require('../embeds/expirationEmbed');
const { sendDM } = require('../utils/sendDM');
const { sendLog } = require('../utils/sendLog');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[Punisher] Logged in as ${client.user.tag}`);
    console.log(`[Punisher] Serving ${client.guilds.cache.size} guild(s)`);

    client.user.setPresence({
      status: 'dnd',
      activities: [{ name: 'Protecting the server', type: ActivityType.Watching }]
    });

    setInterval(() => checkExpirations(client), 60_000);
    checkExpirations(client);
  }
};

async function checkExpirations(client) {
  const expired = getExpiredPunishments();

  for (const record of expired) {
    try {
      const guild = await client.guilds.fetch(record.guild_id).catch(() => null);
      if (!guild) {
        deactivatePunishment(record.id);
        continue;
      }

      const user = await client.users.fetch(record.user_id).catch(() => null);

      if (record.type === 'ban') {
        await guild.members.unban(record.user_id, 'Temporary ban expired')
          .catch(error => console.warn(`[Punisher] Could not unban ${record.user_id}: ${error.message}`));
      }

      if (record.type === 'mute') {
        const member = await guild.members.fetch(record.user_id).catch(() => null);
        if (member && member.communicationDisabledUntilTimestamp) {
          await member.timeout(null, 'Mute expired')
            .catch(error => console.warn(`[Punisher] Could not unmute ${record.user_id}: ${error.message}`));
        }
      }

      let dmSent = false;
      if (user) {
        const dmEmbed = buildExpirationEmbed({
          type: record.type,
          guildName: guild.name,
          reason: record.reason,
          createdAt: record.created_at,
          expiresAt: record.expires_at
        });

        const result = await sendDM(user, { embeds: [dmEmbed] });
        dmSent = result.success;
      }

      await sendLog(client, {
        action: record.type === 'ban' ? 'Ban Expired' : 'Mute Expired',
        target: { id: record.user_id, tag: user ? user.tag : `Unknown (${record.user_id})` },
        moderator: null,
        reason: record.reason,
        duration: 'Expired',
        dmSent,
        guildName: guild.name
      });

      deactivatePunishment(record.id);
      console.log(`[Punisher] Expired ${record.type} for user ${record.user_id} in guild ${record.guild_id}`);
    } catch (error) {
      console.error(`[Punisher] Error processing expiration for record ${record.id}:`, error);
      deactivatePunishment(record.id);
    }
  }
}
