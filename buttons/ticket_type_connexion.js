
// buttons/ticket_type_connexion.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
  customId: 'ticket_type_connexion',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_connexion').setTitle('📡 Problème de Connexion');
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
        new TextInputBuilder().setCustomId('whereami').setLabel('Résultat de /whereami ')
          .setStyle(TextInputStyle.Paragraph).setPlaceholder('Copie tout le texte affiché par /whereami en jeu')
          .setRequired(true).setMaxLength(400),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('probleme').setLabel('Décris le problème ')
          .setStyle(TextInputStyle.Paragraph).setPlaceholder('Erreur affichée, depuis quand, que faisais-tu ?')
          .setRequired(true).setMaxLength(600),
      ),
    );
    await interaction.showModal(modal);
  },
};
