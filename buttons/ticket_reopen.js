const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');

module.exports = {
  customId: 'ticket_reopen',
  async execute(interaction) {
    const ticket = getTicket(interaction.channelId);
    if (!ticket) return interaction.reply({ content: '❌ Ticket introuvable.', flags: 64 });

    const channel = interaction.channel;
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    await interaction.update({ components: [] });

    if (setup?.categoryOpenId) await channel.setParent(setup.categoryOpenId, { lockPermissions: false });
    const cleanName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`🟢-${cleanName}`);
    setTicket(channel.id, { status: 'open' });

    await channel.send({
      embeds: [new EmbedBuilder().setColor(config.colors.success).setTitle('🔓 Ticket Réouvert')
        .setDescription(`Réouvert par <@${interaction.user.id}>.`).setTimestamp()],
    });
  },
};