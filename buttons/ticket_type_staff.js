// buttons/ticket_type_staff.js — Ouvre le modal candidature Staff — style DonutSMP
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'ticket_type_staff',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal_staff')
      .setTitle('👮 Candidature Staff');

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
          .setCustomId('age')
          .setLabel('Ton âge ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: 17')
          .setRequired(true)
          .setMaxLength(3),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('experience')
          .setLabel('Expérience / anciens serveurs ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Serveurs staff, durée, rôle occupé...')
          .setRequired(true)
          .setMaxLength(600),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('pourquoi')
          .setLabel('Pourquoi rejoindre le staff ? ')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Motive ta candidature de manière sérieuse...')
          .setRequired(true)
          .setMaxLength(600),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('dispos')
          .setLabel('Disponibilités ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Lun-Ven 17h-21h, week-end libre')
          .setRequired(true)
          .setMaxLength(200),
      ),
    );

    await interaction.showModal(modal);
  },
};
