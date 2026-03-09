// buttons/ticket_type_media.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
  customId: 'ticket_type_media',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_media').setTitle('🎬 Candidature Média');
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('pseudo').setLabel('Ton pseudo Minecraft ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('ex: Steve').setRequired(true).setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('lien_video').setLabel('Lien vers ta vidéo / chaîne ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('https://youtube.com/...')
          .setRequired(true).setMaxLength(300),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('conditions').setLabel('Conditions remplies ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Liste les conditions du rang média que tu as remplies (abonnés, vues, etc.)...')
          .setRequired(true).setMaxLength(600),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('ip_complete').setLabel('La vidéo affiche-t-elle l\'IP complète ? ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('Oui / Non')
          .setRequired(true).setMaxLength(10),
      ),
    );
    await interaction.showModal(modal);
  },
};
