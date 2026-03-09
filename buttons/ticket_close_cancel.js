
// buttons/ticket_close_cancel.js
module.exports = {
  customId: 'ticket_close_cancel',
  async execute(interaction) {
    await interaction.update({ content: '❌ Fermeture annulée.', embeds: [], components: [] });
  },
};
