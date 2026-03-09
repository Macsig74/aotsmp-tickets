// buttons/ticket_type_achat.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
  customId: 'ticket_type_achat',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_achat').setTitle('🛒 Purchase Support');
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('pseudo').setLabel('Ton pseudo Minecraft ')
          .setStyle(TextInputStyle.Short).setPlaceholder('ex: Steve').setRequired(true).setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('plateforme').setLabel('Plateforme & version ')
          .setStyle(TextInputStyle.Short).setPlaceholder('ex: Java 1.21.1 ou Bedrock 1.20.80')
          .setRequired(true).setMaxLength(100),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('code_achat').setLabel('Code de transaction / reçu ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: TBX-XXXXXXXX — Renseigne une vraie valeur sinon aucune aide.')
          .setRequired(true).setMaxLength(100),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('probleme').setLabel('Décris ton problème ')
          .setStyle(TextInputStyle.Paragraph).setPlaceholder('Que s\'est-il passé avec ton achat ?')
          .setRequired(true).setMaxLength(600),
      ),
    );
    await interaction.showModal(modal);
  },
};
