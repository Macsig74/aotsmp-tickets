const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { isStaff } = require('../utils/permissions');

module.exports = {
  customId: 'ticket_delete',
  async execute(interaction) {
    const ok = await isStaff(interaction.member, interaction.guildId);
    if (!ok) return interaction.reply({ content: '❌ Réservé au staff.', flags: 64 });

    await interaction.update({ components: [] });
    await interaction.channel.send({
      embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('🗑️ Suppression dans 5 secondes...').setTimestamp()],
    });

    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  },
};