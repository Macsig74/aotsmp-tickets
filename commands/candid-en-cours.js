// commands/candid-en-cours.js — Déplace le ticket dans la catégo "Candidatures"
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

    // === Embed dans le ticket ===
    const candidEmbed = new EmbedBuilder()
      .setColor(config.colors.candid)
      .setTitle('📋 Candidature en cours de traitement')
      .setDescription(
        `<@${ticket.userId}>, ta candidature est actuellement **en cours d'examen** par l'équipe staff.\n\n` +
        `> Merci de patienter, tu seras contacté prochainement. 🌟`
      )
      .addFields(
        { name: '👮 Prise en charge par', value: `<@${interaction.user.id}>`, inline: true },
        { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
      )
      .setTimestamp();

    await channel.send({ embeds: [candidEmbed] });

    // === DM au joueur ===
    try {
      const member = await guild.members.fetch(ticket.userId);
      const dmEmbed = new EmbedBuilder()
        .setColor(config.colors.candid)
        .setTitle('📋 Ta candidature est en cours d\'examen !')
        .setDescription(
          `Bonne nouvelle ! Ta candidature sur **${guild.name}** est actuellement **examinée** par notre équipe staff.\n\n` +
          `Tu seras contacté prochainement avec la décision finale.`
        )
        .addFields(
          { name: '👮 En charge', value: `${interaction.user.tag}`, inline: true },
          { name: '🏠 Serveur', value: guild.name, inline: true },
        )
        .setFooter({ text: 'AOTSMP • Système de Support' })
        .setTimestamp();

      await member.user.send({ embeds: [dmEmbed] });
    } catch (e) {
      console.log(`[CANDID] DM impossible: ${e.message}`);
    }

    // === Déplacer dans catégo "Candidatures" ===
    if (setup?.categoryCandidId) {
      await channel.setParent(setup.categoryCandidId, { lockPermissions: false });
    }

    // Renommer avec emoji 📋
    const cleanName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`📋-${cleanName}`);

    // Update DB
    setTicket(channel.id, { status: 'candid' });

    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setColor(config.colors.candid)
        .setTitle('📋 Candidature en cours')
        .setDescription(`Le ticket a été déplacé dans **Candidatures** et le joueur a été notifié en DM.`)
        .setTimestamp()],
    });

    // LOG
    if (setup?.logsChannelId) {
      const logsChannel = guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) {
        await logsChannel.send({
          embeds: [new EmbedBuilder()
            .setColor(config.colors.candid)
            .setTitle('📋 Candidature en Cours')
            .addFields(
              { name: '📂 Ticket', value: channel.toString(), inline: true },
              { name: '👤 Joueur', value: `<@${ticket.userId}>`, inline: true },
              { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
            )
            .setTimestamp()],
        });
      }
    }
  },
};
