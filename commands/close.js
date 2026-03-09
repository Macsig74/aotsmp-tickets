// commands/close.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');
const { requireStaff, requireTicketChannel } = require('../utils/permissions');
const { logEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('🔒 Ferme le ticket avec une raison (envoyée en MP au joueur)')
    .addStringOption(o =>
      o.setName('raison').setDescription('Raison de la fermeture').setRequired(false)
    ),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;
    const ticket = await requireTicketChannel(interaction);
    if (!ticket) return;

    const raison = interaction.options.getString('raison') || 'Aucune raison fournie.';
    const channel = interaction.channel;
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    await interaction.deferReply();

    // DM au joueur
    try {
      const ticketUser = await guild.members.fetch(ticket.userId);
      const dmEmbed = new EmbedBuilder()
        .setColor(config.colors.danger)
        .setTitle('🔒 Ton ticket a été fermé')
        .setDescription(`Ton ticket **#${channel.name}** sur **${guild.name}** a été fermé par <@${interaction.user.id}>.`)
        .addFields(
          { name: '📝 Raison', value: raison, inline: false },
          { name: '👮 Fermé par', value: `${interaction.user.tag}`, inline: true },
          { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        )
        .setFooter({ text: 'AOTSMP • Système de Support' })
        .setTimestamp();
      await ticketUser.user.send({ embeds: [dmEmbed] });
    } catch (e) {}

    const confirmEmbed = new EmbedBuilder()
      .setColor(config.colors.danger)
      .setTitle('🔒 Ticket en cours de fermeture...')
      .addFields(
        { name: '📝 Raison', value: raison, inline: false },
        { name: '👮 Fermé par', value: `<@${interaction.user.id}>`, inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [confirmEmbed] });
    await new Promise(r => setTimeout(r, 2000));

    if (setup?.categoryClosedId) {
      await channel.setParent(setup.categoryClosedId, { lockPermissions: false });
    }

    const oldName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`🔴-${oldName}`);

    setTicket(channel.id, { status: 'closed', closedBy: interaction.user.id, closeReason: raison, closedAt: Date.now() });

    if (setup?.logsChannelId) {
      const logsChannel = guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) {
        await logsChannel.send({ embeds: [logEmbed('Fermé', { ...ticket, name: channel.name }, interaction.user, raison)] });
      }
    }
  },
};