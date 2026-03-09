// commands/rename.js
const { SlashCommandBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket } = require('../utils/db');
const { getSetup } = require('../utils/db');
const { requireStaff, requireTicketChannel } = require('../utils/permissions');
const { successEmbed, errorEmbed, logEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('✏️ Renomme le salon du ticket')
    .addStringOption(o =>
      o.setName('nom').setDescription('Nouveau nom du ticket').setRequired(true)
    ),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;
    const ticket = await requireTicketChannel(interaction);
    if (!ticket) return;

    const newName = interaction.options.getString('nom')
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 90);

    const channel = interaction.channel;
    const oldName = channel.name;
    const setup = getSetup(interaction.guildId);

    // Préserver l'emoji de statut s'il est présent
    let prefix = '';
    if (oldName.startsWith('🟢')) prefix = '🟢-';
    else if (oldName.startsWith('🔴')) prefix = '🔴-';
    else if (oldName.startsWith('⏳')) prefix = '⏳-';

    await channel.setName(`${prefix}${newName}`);
    setTicket(channel.id, { name: `${prefix}${newName}` });

    await interaction.reply({
      embeds: [successEmbed('Ticket renommé', `Le ticket a été renommé en \`${prefix}${newName}\`.`)],
      ephemeral: true,
    });

    // LOG
    if (setup?.logsChannelId) {
      const logsChannel = interaction.guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) {
        const { EmbedBuilder } = require('discord.js');
        await logsChannel.send({
          embeds: [new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle('✏️ Ticket Renommé')
            .addFields(
              { name: '📛 Ancien nom', value: `\`${oldName}\``, inline: true },
              { name: '📛 Nouveau nom', value: `\`${prefix}${newName}\``, inline: true },
              { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
              { name: '👤 Propriétaire', value: `<@${ticket.userId}>`, inline: true },
            )
            .setTimestamp()],
        });
      }
    }
  },
};
