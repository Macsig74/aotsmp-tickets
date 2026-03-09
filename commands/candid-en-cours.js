const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');
const { requireStaff, requireTicketChannel } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('candid-en-cours')
    .setDescription('📋 Marque la candidature comme en cours de traitement'),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;
    const ticket = await requireTicketChannel(interaction);
    if (!ticket) return;

    const channel = interaction.channel;
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    await interaction.deferReply();

    await channel.send({
      embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📋 Candidature en cours de traitement')
        .setDescription(`<@${ticket.userId}>, ta candidature est **en cours d'examen**.\n\n> Merci de patienter 🌟`)
        .addFields(
          { name: '👮 Prise en charge par', value: `<@${interaction.user.id}>`, inline: true },
          { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        ).setTimestamp()],
    });

    try {
      const member = await guild.members.fetch(ticket.userId);
      await member.user.send({
        embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📋 Ta candidature est en cours d\'examen !')
          .setDescription(`Ta candidature sur **${guild.name}** est **examinée** par notre équipe.\nTu seras contacté prochainement.`)
          .addFields(
            { name: '👮 En charge', value: `${interaction.user.tag}`, inline: true },
            { name: '🏠 Serveur', value: guild.name, inline: true },
          ).setFooter({ text: 'AOTSMP • Système de Support' }).setTimestamp()],
      });
    } catch (e) {}

    if (setup?.categoryCandidId) await channel.setParent(setup.categoryCandidId, { lockPermissions: false });
    const cleanName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`📋-${cleanName}`);
    setTicket(channel.id, { status: 'candid' });

    await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📋 Candidature en cours').setDescription('Déplacé dans **Candidatures** et le joueur notifié.').setTimestamp()],
    });

    if (setup?.logsChannelId) {
      const logsChannel = guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) await logsChannel.send({ embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📋 Candidature en Cours')
        .addFields(
          { name: '📂 Ticket', value: channel.toString(), inline: true },
          { name: '👤 Joueur', value: `<@${ticket.userId}>`, inline: true },
          { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
        ).setTimestamp()] });
    }
  },
};