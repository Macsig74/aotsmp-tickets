const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');
const { requireStaff, requireTicketChannel } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('✏️ Renomme le salon du ticket')
    .addStringOption(o => o.setName('nom').setDescription('Nouveau nom').setRequired(true)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;
    const ticket = await requireTicketChannel(interaction);
    if (!ticket) return;

    const newName = interaction.options.getString('nom').toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').slice(0, 90);
    const channel = interaction.channel;
    const oldName = channel.name;
    const setup = getSetup(interaction.guildId);

    let prefix = '';
    if (oldName.startsWith('🟢')) prefix = '🟢-';
    else if (oldName.startsWith('🔴')) prefix = '🔴-';
    else if (oldName.startsWith('⏳')) prefix = '⏳-';
    else if (oldName.startsWith('📋')) prefix = '📋-';

    await channel.setName(`${prefix}${newName}`);
    setTicket(channel.id, { name: `${prefix}${newName}` });

    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(config.colors.success).setTitle('✅ Ticket renommé').setDescription(`Renommé en \`${prefix}${newName}\`.`).setTimestamp()],
      flags: 64,
    });

    if (setup?.logsChannelId) {
      const logsChannel = interaction.guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) await logsChannel.send({ embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('✏️ Ticket Renommé')
        .addFields(
          { name: '📛 Ancien', value: `\`${oldName}\``, inline: true },
          { name: '📛 Nouveau', value: `\`${prefix}${newName}\``, inline: true },
          { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
        ).setTimestamp()] });
    }
  },
};