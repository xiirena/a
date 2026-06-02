const { ChannelType } = require('discord.js');

const repliedUsers = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.type !== ChannelType.DM) return;
    if (repliedUsers.has(message.author.id)) return;

    repliedUsers.add(message.author.id);

    try {
      await message.reply('Punisher does not accept direct messages. This bot is for moderation only.');
    } catch (error) {
      console.warn(`[Punisher] Could not send anti-chat reply to ${message.author.tag}: ${error.message}`);
    }
  }
};
