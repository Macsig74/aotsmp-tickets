// commands/setup.js
const {
  SlashCommandBuilder, PermissionFlagsBits, ChannelType,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} = require('discord.js');
const config = require('../config');
const { setSetup } = require('../utils/db');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('⚙️ Configure le système de tickets AOTSMP')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(o =>
      o.setName('staff').setDescription('Rôle staff qui gérera les tickets').setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });
    const guild = interaction.guild;
    const staffRole = interaction.options.getRole('staff');

    await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('⚙️ Setup en cours...').setDescription('Création des catégories et salons...')],
    });

    try {
      const mkCat = (name, staffAllow, extraDeny = []) => guild.channels.create({
        name, type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: ['ViewChannel', ...extraDeny] },
          { id: staffRole.id, allow: staffAllow },
        ],
      });

      const catOpen   = await mkCat(config.categories.ticketsOuverts, ['ViewChannel','ManageChannels','SendMessages','ReadMessageHistory']);
      const catClosed = await mkCat(config.categories.ticketsFermes,  ['ViewChannel','ReadMessageHistory']);
      const catCandid = await mkCat(config.categories.candid,         ['ViewChannel','ManageChannels','SendMessages','ReadMessageHistory']);
      const catAttente= await mkCat(config.categories.attente,        ['ViewChannel','ManageChannels','SendMessages','ReadMessageHistory']);

      const panelChannel = await guild.channels.create({
        name: config.channels.ticketPanel, type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.roles.everyone, allow: ['ViewChannel','ReadMessageHistory'], deny: ['SendMessages'] },
          { id: staffRole.id, allow: ['ViewChannel','SendMessages','ReadMessageHistory'] },
        ],
      });

      const logsChannel = await guild.channels.create({
        name: config.channels.logs, type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: ['ViewChannel'] },
          { id: staffRole.id, allow: ['ViewChannel','ReadMessageHistory'] },
        ],
      });

      setSetup(guild.id, {
        staffRoleId:       staffRole.id,
        categoryOpenId:    catOpen.id,
        categoryClosedId:  catClosed.id,
        categoryCandidId:  catCandid.id,
        categoryAttenteId: catAttente.id,
        panelChannelId:    panelChannel.id,
        logsChannelId:     logsChannel.id,
      });

      // ── PANEL EMBED ──
      const panelEmbed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle('AOTSMP | Support')
        .setDescription(
          'Les tickets vous permettent de contacter l\'équipe **AOTSMP**.\n' +
          '**N\'ouvrez un ticket que si vous avez besoin d\'aide, et évitez d\'en ouvrir plusieurs pour le même problème.**'
        )
        .setImage(guild.bannerURL({ size: 1024 }) || guild.iconURL({ size: 1024, dynamic: true }))
        .setFooter({ text: 'AOTSMP • Support', iconURL: guild.iconURL() });

      // ── BOUTONS — 3 rangées max (5 boutons par rangée) ──
      // Rangée 1 : Déban | Player Report | Media | Bug Report | Support Achat
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_type_deban')    .setLabel('Ban Appeal')          .setEmoji('🔨').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('ticket_type_report')   .setLabel('Player Report')        .setEmoji('⚠️').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('ticket_type_media')    .setLabel('Media')                .setEmoji('🎬').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('ticket_type_bug')      .setLabel('Bug Report')           .setEmoji('🐛').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('ticket_type_achat')    .setLabel('Purchase Support')     .setEmoji('🛒').setStyle(ButtonStyle.Primary),
      );

      // Rangée 2 : Connexion | Staff | Dev | Autre
      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_type_connexion') .setLabel('Connection Issues')   .setEmoji('📡').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('ticket_type_staff')     .setLabel('Candidature Staff')   .setEmoji('👮').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('ticket_type_dev')       .setLabel('Candidature Dev')     .setEmoji('💻').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('ticket_type_autre')     .setLabel('Autre / Support')     .setEmoji('📌').setStyle(ButtonStyle.Secondary),
      );

      await panelChannel.send({ embeds: [panelEmbed], components: [row1, row2] });

      await interaction.editReply({
        embeds: [new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle('✅ Setup terminé !')
          .setDescription('Le système de tickets a été configuré avec succès.')
          .addFields(
            { name: '📂 Tickets Ouverts', value: catOpen.toString(),    inline: true },
            { name: '🔒 Tickets Fermés',  value: catClosed.toString(),  inline: true },
            { name: '📋 Candidatures',    value: catCandid.toString(),  inline: true },
            { name: '⏳ En Attente',       value: catAttente.toString(), inline: true },
            { name: '📩 Panel',           value: panelChannel.toString(), inline: true },
            { name: '📋 Logs',            value: logsChannel.toString(), inline: true },
            { name: '👮 Rôle Staff',      value: staffRole.toString(),  inline: true },
          )
          .setTimestamp()],
      });
    } catch (err) {
      console.error('[SETUP]', err);
      await interaction.editReply({ embeds: [errorEmbed('Erreur Setup', `\`${err.message}\``)] });
    }
  },
};
