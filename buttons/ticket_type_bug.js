// buttons/ticket_type_bug.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
  customId: 'ticket_type_bug',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_bug').setTitle('🐛 Bug Report');
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('pseudo').setLabel('Ton pseudo Minecraft ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('ex: Steve').setRequired(true).setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('description_bug').setLabel('Décris le bug ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Paragraph).setPlaceholder('Explique le bug que tu rencontres en détail...')
          .setRequired(true).setMaxLength(700),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('lien_video').setLabel('Lien vidéo / enregistrement ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('Lien YouTube non répertorié de préférence')
          .setRequired(true).setMaxLength(300),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('whereami').setLabel('Résultat de /whereami en jeu ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('Copie le résultat de la commande /whereami')
          .setRequired(true).setMaxLength(200),
      ),
    );
    await interaction.showModal(modal);
  },
};
