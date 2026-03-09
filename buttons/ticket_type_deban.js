// buttons/ticket_type_deban.js — Ouvre le modal de déban style DonutSMP
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'ticket_type_deban',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal_deban')
      .setTitle('🔨 Demande de Déban');

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('pseudo')
          .setLabel('Ton pseudo Minecraft ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Steve')
          .setRequired(true)
          .setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('raison_ban')
          .setLabel('Raison du ban (selon toi) ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Quelle raison t\'a été donnée ? Que s\'est-il passé ?')
          .setRequired(true)
          .setMaxLength(500),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('pourquoi_deban')
          .setLabel('Pourquoi mérites-tu un déban ? ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Argumente ta demande. Sois honnête et précis.')
          .setRequired(true)
          .setMaxLength(800),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('preuves')
          .setLabel('Preuves — lien image / vidéo (optionnel)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('https://...')
          .setRequired(false)
          .setMaxLength(300),
      ),
    );

    await interaction.showModal(modal);
  },
};
