// commands/later.js — Met le ticket en attente + déplace dans catégo "En Attente"
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');
const { requireStaff, requireTicketChannel } = require('../utils/permissions');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('later')
    .setDescription('⏳ Met le ticket en attente (on a retenu ta candidature)')
    .addStringOption(o =>
      o.setName('raison').setDescription('Message à envoyer au joueur (optionnel)').setRequired(false)
    ),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;
    const ticket = await requireTicketChannel(interaction);
    if (!ticket) return;

    const raison = interaction.options.getString('raison') || null;
    const channel = interaction.channel;
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    await interaction.deferReply();

    // === Embed dans le ticket ===
    const inTicketEmbed = new EmbedBuilder()
      .setColor(config.colors.later)
      .setTitle('⏳ Candidature mise en attente')
      .setDescription(
        `<@${ticket.userId}>, nous avons **retenu ta candidature** et nous te recontacterons prochainement.\n\n` +
        `> Merci pour ta patience ! 🙏`
      )
      .addFields(
        raison ? { name: '📝 Message du staff', value: raison, inline: false } : null,
        { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
        { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
      )
      .filter(f => f !== null)
      .setTimestamp();

    // Workaround: rebuild without null
    const fields = [
      { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
      { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
    ];
    if (raison) fields.unshift({ name: '📝 Message du staff', value: raison, inline: false });

    const laterEmbed = new EmbedBuilder()
      .setColor(config.colors.later)
      .setTitle('⏳ Candidature mise en attente')
      .setDescription(
        `<@${ticket.userId}>, nous avons **retenu ta candidature** et nous te recontacterons prochainement.\n\n` +
        `> Merci pour ta patience ! 🙏`
      )
      .addFields(...fields)
      .setTimestamp();

    await channel.send({ embeds: [laterEmbed] });

    // === DM au joueur ===
    try {
      const member = await guild.members.fetch(ticket.userId);
      const dmEmbed = new EmbedBuilder()
        .setColor(config.colors.later)
        .setTitle('⏳ On a retenu ta candidature !')
        .setDescription(
          `Bonne nouvelle ! Ta candidature sur **${guild.name}** a été **mise en attente** par le staff.\n\n` +
          `Cela signifie que nous avons **retenu ton dossier** et nous te recontacterons prochainement.`
        )
        .addFields(
          raison ? { name: '📝 Message du staff', value: raison, inline: false } : { name: '\u200b', value: '\u200b' },
          { name: '🏠 Serveur', value: guild.name, inline: true },
        )
        .setFooter({ text: 'AOTSMP • Système de Support' })
        .setTimestamp();

      await member.user.send({ embeds: [dmEmbed] });
    } catch (e) {
      console.log(`[LATER] DM impossible: ${e.message}`);
    }

    // === Déplacer dans catégo "En Attente" ===
    if (setup?.categoryAttenteId) {
      await channel.setParent(setup.categoryAttenteId, { lockPermissions: false });
    }

    // Renommer avec emoji ⏳
    const cleanName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`⏳-${cleanName}`);

    // Update DB
    setTicket(channel.id, { status: 'later' });

    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setColor(config.colors.later)
        .setTitle('⏳ Ticket mis en attente')
        .setDescription(`Le ticket a été déplacé en **"En Attente"** et le joueur a reçu un DM.`)
        .setTimestamp()],
    });

    // LOG
    if (setup?.logsChannelId) {
      const logsChannel = guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) {
        await logsChannel.send({
          embeds: [new EmbedBuilder()
            .setColor(config.colors.later)
            .setTitle('⏳ Ticket En Attente')
            .addFields(
              { name: '📂 Ticket', value: channel.toString(), inline: true },
              { name: '👤 Joueur', value: `<@${ticket.userId}>`, inline: true },
              { name: '👮 Staff', value: `<@${interaction.user.id}>`, inline: true },
              raison ? { name: '📝 Raison', value: raison, inline: false } : { name: '\u200b', value: '\u200b' },
            )
            .setTimestamp()],
        });
      }
    }
  },
};
