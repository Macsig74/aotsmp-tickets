const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');
const { requireStaff, requireTicketChannel } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('later')
    .setDescription('⏳ Met le ticket en attente')
    .addStringOption(o => o.setName('message').setDescription('Message pour le joueur (optionnel)').setRequired(false)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;
    const ticket = await requireTicketChannel(interaction);
    if (!ticket) return;

    const msg = interaction.options.getString('message') || null;
    const channel = interaction.channel;
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    await interaction.deferReply();

    const fields = [
      { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
      { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
    ];
    if (msg) fields.unshift({ name: '📝 Message du staff', value: msg, inline: false });

    await channel.send({
      embeds: [new EmbedBuilder().setColor(config.colors.later).setTitle('⏳ Candidature mise en attente')
        .setDescription(`<@${ticket.userId}>, nous avons **retenu ta candidature** et nous te recontacterons prochainement.\n\n> Merci pour ta patience ! 🙏`)
        .addFields(...fields).setTimestamp()],
    });

    try {
      const member = await guild.members.fetch(ticket.userId);
      const dmFields = [{ name: '🏠 Serveur', value: guild.name, inline: true }];
      if (msg) dmFields.unshift({ name: '📝 Message du staff', value: msg, inline: false });
      await member.user.send({
        embeds: [new EmbedBuilder().setColor(config.colors.later).setTitle('⏳ On a retenu ta candidature !')
          .setDescription(`Ta candidature sur **${guild.name}** a été **mise en attente**.\nNous te recontacterons prochainement.`)
          .addFields(...dmFields).setFooter({ text: 'AOTSMP • Système de Support' }).setTimestamp()],
      });
    } catch (e) {}

    if (setup?.categoryAttenteId) await channel.setParent(setup.categoryAttenteId, { lockPermissions: false });
    const cleanName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`⏳-${cleanName}`);
    setTicket(channel.id, { status: 'later' });

    await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(config.colors.later).setTitle('⏳ Ticket mis en attente').setDescription('Déplacé en **En Attente** et le joueur notifié.').setTimestamp()],
    });

    if (setup?.logsChannelId) {
      const logsChannel = guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) {
        const logFields = [
          { name: '📂 Ticket', value: channel.toString(), inline: true },
          { name: '👤 Joueur', value: `<@${ticket.userId}>`, inline: true },
          { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
        ];
        if (msg) logFields.push({ name: '📝 Message', value: msg, inline: false });
        await logsChannel.send({ embeds: [new EmbedBuilder().setColor(config.colors.later).setTitle('⏳ Ticket En Attente').addFields(...logFields).setTimestamp()] });
      }
    }
  },
};