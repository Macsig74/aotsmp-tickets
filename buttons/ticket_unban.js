const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../config');
const { isStaff } = require('../utils/permissions');
const { getTicket } = require('../utils/db');

module.exports = {
  customId: 'ticket_unban',
  async execute(interaction) {
    const ok = await isStaff(interaction.member, interaction.guildId);
    if (!ok) return interaction.reply({ content: '❌ Réservé au staff.', flags: 64 });

    const ticket = getTicket(interaction.channelId);
    const pseudo = ticket?.pseudoMC || '';

    const modal = new ModalBuilder().setCustomId('modal_unban_confirm').setTitle('🔓 Unban Ingame');
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('pseudo_unban')
          .setLabel('Pseudo Minecraft à unban *')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Steve')
          .setValue(pseudo)
          .setRequired(true)
          .setMaxLength(20),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('raison_unban')
          .setLabel('Raison du déban *')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ex: Appel accepté')
          .setRequired(true)
          .setMaxLength(100),
      ),
    );
    await interaction.showModal(modal);
  },
};