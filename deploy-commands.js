// deploy-commands.js — Déploie les slash commands sur Discord
require('dotenv').config();
const { REST, Routes } = require('@discordjs/rest');
const { ApplicationCommandType } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data) {
    commands.push(command.data.toJSON());
    console.log(`[+] ${command.data.name}`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`\n🚀 Déploiement de ${commands.length} commande(s)...`);

    // Global deployment (prend ~1h pour se propager)
    // await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    // Guild deployment (instantané — recommandé pour le dev)
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('✅ Commandes déployées avec succès !');
    console.log('📋 Commandes déployées :');
    commands.forEach(c => console.log(`   • /${c.name}`));
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();
