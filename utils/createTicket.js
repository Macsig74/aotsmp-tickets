// utils/createTicket.js — Logique partagée de création de salon ticket
const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const { getSetup, setTicket, getNextTicketId } = require('./db');

/**
 * Crée un salon ticket et envoie le message de bienvenue avec le récap du formulaire.
 * @param {Interaction} interaction
 * @param {'deban'|'staff'|'dev'|'autre'} type
 * @param {string} pseudo — pseudo Minecraft fourni dans le form
 * @param {Object} fields — { label, value }[] à afficher dans l'embed de récap
 * @param {Object} extraData — données supplémentaires à stocker en DB
 */
async function createTicket(interaction, type, pseudo, fields, extraData = {}) {
  const guild = interaction.guild;
  const user = interaction.user;
  const setup = getSetup(guild.id);

  if (!setup) throw new Error('Système non configuré. Utilisez `/setup`.');

  const ticketId = getNextTicketId(guild.id);
  // Format : type-pseudo-0001
  const cleanPseudo = pseudo.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  const channelName = `${type}-${cleanPseudo}-${String(ticketId).padStart(4, '0')}`;

  const typeConfig = config.ticketTypes[type];
  const staffRole = guild.roles.cache.get(setup.staffRoleId);

  const permOverwrites = [
    { id: guild.roles.everyone, deny: ['ViewChannel'] },
    { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'] },
  ];
  if (staffRole) {
    permOverwrites.push({
      id: staffRole.id,
      allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages', 'AttachFiles'],
    });
  }

  const ticketChannel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: setup.categoryOpenId || null,
    topic: `ticket-${user.id}`,
    permissionOverwrites,
  });

  // Sauvegarde DB
  setTicket(ticketChannel.id, {
    userId: user.id,
    guildId: guild.id,
    ticketId,
    type,
    pseudoMC: pseudo,
    status: 'open',
    createdAt: Date.now(),
    ...extraData,
  });

  // === Embed de bienvenue + récap formulaire ===
  const welcomeEmbed = new EmbedBuilder()
    .setColor(typeConfig.color)
    .setTitle(`${typeConfig.emoji} ${typeConfig.label} — #${String(ticketId).padStart(4, '0')}`)
    .setDescription(config.messages.ticketWelcome(user.toString(), typeConfig.label))
    .addFields(
      { name: '👤 Créateur Discord', value: `${user.tag}`, inline: true },
      { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
      { name: '📅 Ouvert le', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'AOTSMP • Support' })
    .setTimestamp();

  // Embed récap du formulaire
  const formEmbed = new EmbedBuilder()
    .setColor(typeConfig.color)
    .setTitle('📋 Récap de ta demande')
    .addFields(...fields)
    .setTimestamp();

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_close_btn')
      .setLabel('Fermer le ticket')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Danger),
  );

  await ticketChannel.send({
    content: `${user.toString()}${staffRole ? ` | ${staffRole.toString()}` : ''}`,
    embeds: [welcomeEmbed, formEmbed],
    components: [closeRow],
  });

  // LOG
  if (setup.logsChannelId) {
    const logsCh = guild.channels.cache.get(setup.logsChannelId);
    if (logsCh) {
      await logsCh.send({
        embeds: [new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle(`🟢 Nouveau Ticket — ${typeConfig.label}`)
          .addFields(
            { name: '📂 Salon', value: ticketChannel.toString(), inline: true },
            { name: '👤 Créateur', value: `<@${user.id}>`, inline: true },
            { name: '🎮 Pseudo MC', value: pseudo, inline: true },
            { name: '🆔 ID', value: `#${String(ticketId).padStart(4, '0')}`, inline: true },
            { name: '🏷️ Type', value: typeConfig.label, inline: true },
          )
          .setTimestamp()],
      });
    }
  }

  return ticketChannel;
}

module.exports = { createTicket };
