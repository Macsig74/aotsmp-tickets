// buttons/ticket_type_dev.js — Ouvre le modal candidature Dev — style DonutSMP
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'ticket_type_dev',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal_dev')
      .setTitle('💻 Candidature Développeur');

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('pseudo')
          .setLabel('Ton pseudo Minecraft ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Notch')
          .setRequired(true)
          .setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('age')
          .setLabel('Ton âge ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: 19')
          .setRequired(true)
          .setMaxLength(3),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('experience')
          .setLabel('Langages & expérience dev ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Java, Spigot, Paper, BungeeCord, JS... Projets / GitHub ?')
          .setRequired(true)
          .setMaxLength(600),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('pourquoi')
          .setLabel('Pourquoi rejoindre AOTSMP ? ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Qu'est-ce que tu peux apporter concrètement ?")
          .setRequired(true)
          .setMaxLength(600),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('dispos')
          .setLabel('Disponibilités ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Lun-Ven soir, week-end')
          .setRequired(true)
          .setMaxLength(200),
      ),
    );

    await interaction.showModal(modal);
  },
};
