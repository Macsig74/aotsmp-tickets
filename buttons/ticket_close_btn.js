// buttons/ticket_close_btn.js — Fermer via bouton (demande confirmation)
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');

module.exports = {
  customId: 'ticket_close_btn',

  async execute(interaction) {
    const ticket = getTicket(interaction.channelId);
    if (!ticket) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(config.colors.danger)
          .setDescription('❌ Ce salon n\'est pas un ticket.')],
        flags: 64,
      });
    }

    // Confirmation embed
    const confirmEmbed = new EmbedBuilder()
      .setColor(config.colors.warning)
      .setTitle('⚠️ Confirmer la fermeture')
      .setDescription('Es-tu sûr de vouloir fermer ce ticket ?\n\n> Cette action notifiera le joueur en DM.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_close_confirm')
        .setLabel('Confirmer la fermeture')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('ticket_close_cancel')
        .setLabel('Annuler')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [confirmEmbed], components: [row], flags: 64 });
  },
};
