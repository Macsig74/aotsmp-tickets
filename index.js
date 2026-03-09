const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();
client.buttons  = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(commandsPath, file));
  if (cmd.data && cmd.execute) {
    client.commands.set(cmd.data.name, cmd);
    console.log(`[CMD] ${cmd.data.name}`);
  }
}

// Load buttons
const buttonsPath = path.join(__dirname, 'buttons');
for (const file of fs.readdirSync(buttonsPath).filter(f => f.endsWith('.js'))) {
  const btn = require(path.join(buttonsPath, file));
  if (btn.customId && btn.execute) {
    client.buttons.set(btn.customId, btn);
    console.log(`[BTN] ${btn.customId}`);
  }
}

// Load events (supporte plusieurs listeners sur le même événement)
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  const fn = (...args) => event.execute(...args, client);
  event.once ? client.once(event.name, fn) : client.on(event.name, fn);
  console.log(`[EVT] ${event.name} (${file})`);
}

client.login(process.env.DISCORD_TOKEN);
