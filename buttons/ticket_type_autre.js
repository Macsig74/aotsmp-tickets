// buttons/ticket_type_autre.js — Ouvre le modal Autre / Support — style DonutSMP
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'ticket_type_autre',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal_autre')
      .setTitle('📌 Autre demande / Support');

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
          .setCustomId('sujet')
          .setLabel('Sujet de ta demande ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Problème de connexion, item perdu...')
          .setRequired(true)
          .setMaxLength(100),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('description')
          .setLabel('Description complète ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Explique ton problème en détail. Plus tu es précis, plus on peut t\'aider rapidement.')
          .setRequired(true)
          .setMaxLength(800),
      ),
    );

    await interaction.showModal(modal);
  },
};
