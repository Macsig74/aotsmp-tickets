// events/interactionCreate.js
const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // === SLASH COMMANDS ===
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(`[CMD ERROR] /${interaction.commandName}:`, err);
        const embed = new EmbedBuilder()
          .setColor(config.colors.danger)
          .setTitle('❌ Erreur')
          .setDescription(`\`${err.message}\``);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [embed], flags: 64 }).catch(() => {});
        } else {
          await interaction.reply({ embeds: [embed], flags: 64 }).catch(() => {});
        }
      }
      return;
    }

    // === BUTTONS ===
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(`[BTN ERROR] ${interaction.customId}:`, err);
        const embed = new EmbedBuilder()
          .setColor(config.colors.danger)
          .setTitle('❌ Erreur')
          .setDescription(`\`${err.message}\``);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [embed], flags: 64 }).catch(() => {});
        } else {
          await interaction.reply({ embeds: [embed], flags: 64 }).catch(() => {});
        }
      }
    }
    // Les modals sont gérés dans events/modalSubmit.js
  },
};
