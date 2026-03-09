const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  customId: 'ticket_close_btn',
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_close_confirm').setLabel('Confirmer').setEmoji('✅').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('ticket_close_cancel').setLabel('Annuler').setEmoji('❌').setStyle(ButtonStyle.Secondary),
    );
    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(config.colors.warning).setTitle('⚠️ Confirmer la fermeture ?').setDescription('Es-tu sûr de vouloir fermer ce ticket ?')],
      components: [row],
      flags: 64,
    });
  },
};