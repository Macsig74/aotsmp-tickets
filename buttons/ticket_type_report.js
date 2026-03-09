// buttons/ticket_type_report.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
  customId: 'ticket_type_report',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_report').setTitle('⚠️ Player Report');
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('pseudo').setLabel('Pseudo du joueur signalé ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('Pseudo Minecraft du joueur à signaler')
          .setRequired(true).setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('user_id').setLabel('ID Discord du joueur (si connu)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Si tu ne sais pas, recherche "how to get discord user id" sur Google')
          .setRequired(false).setMaxLength(30),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('lien_preuve').setLabel('Lien vidéo / preuve ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Short).setPlaceholder('URL — requis pour que le report soit traité')
          .setRequired(true).setMaxLength(300),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('raison').setLabel('Quelle règle a-t-il enfreinte ? ✦ OBLIGATOIRE')
          .setStyle(TextInputStyle.Paragraph).setPlaceholder('Indique quelle règle a été violée et comment')
          .setRequired(true).setMaxLength(500),
      ),
    );
    await interaction.showModal(modal);
  },
};
