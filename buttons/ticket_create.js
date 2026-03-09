// buttons/ticket_create.js — Fallback si ancien panel
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const { getSetup } = require('../utils/db');

module.exports = {
  customId: 'ticket_create',
  async execute(interaction) {
    const setup = getSetup(interaction.guildId);
    if (!setup) return interaction.reply({
      embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Non configuré').setDescription('Un admin doit lancer `/setup`.')],
      ephemeral: true,
    });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_type_deban')    .setLabel('Ban Appeal')        .setEmoji('🔨').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('ticket_type_report')   .setLabel('Player Report')      .setEmoji('⚠️').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('ticket_type_media')    .setLabel('Media')              .setEmoji('🎬').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('ticket_type_bug')      .setLabel('Bug Report')         .setEmoji('🐛').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_type_achat')    .setLabel('Purchase Support')   .setEmoji('🛒').setStyle(ButtonStyle.Primary),
    );
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_type_connexion').setLabel('Connection Issues')  .setEmoji('📡').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_type_staff')    .setLabel('Candidature Staff')  .setEmoji('👮').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_type_dev')      .setLabel('Candidature Dev')    .setEmoji('💻').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_type_autre')    .setLabel('Autre / Support')    .setEmoji('📌').setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(config.colors.primary).setTitle('🎫 Quel type de ticket ?').setDescription('Sélectionne le type correspondant à ta demande.')],
      components: [row1, row2], ephemeral: true,
    });
  },
};
