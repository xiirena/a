require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const deployGlobal = process.env.DEPLOY_GLOBAL === '1';

if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
  throw new Error('BOT_TOKEN is not configured in .env');
}

if (!clientId || clientId === 'YOUR_BOT_CLIENT_ID_HERE') {
  throw new Error('CLIENT_ID is not configured in .env');
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if (!command.data) {
    console.warn(`[Punisher] Skipping invalid command file: ${file}`);
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  const route = !deployGlobal && guildId && guildId !== 'YOUR_GUILD_ID_HERE'
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

  try {
    await rest.put(route, { body: commands });
    console.log(`[Punisher] Deployed ${commands.length} slash command(s).`);
  } catch (error) {
    if (error.code === 50001) {
      console.error('[Punisher] Missing Access. Make sure the bot is invited to the guild and BOT_TOKEN, CLIENT_ID, and GUILD_ID all match.');
    }

    throw error;
  }
})();
