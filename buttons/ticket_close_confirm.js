// buttons/ticket_close_confirm.js
const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, setTicket, getSetup } = require('../utils/db');

module.exports = {
  customId: 'ticket_close_confirm',

  async execute(interaction) {
    const ticket = getTicket(interaction.channelId);
    if (!ticket) return interaction.reply({ content: '❌ Ticket introuvable.', ephemeral: true });

    const channel = interaction.channel;
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    await interaction.update({ content: '🔒 Fermeture en cours...', embeds: [], components: [] });

    // DM au joueur
    try {
      const member = await guild.members.fetch(ticket.userId);
      const dmEmbed = new EmbedBuilder()
        .setColor(config.colors.danger)
        .setTitle('🔒 Ton ticket a été fermé')
        .setDescription(
          `Ton ticket **#${channel.name}** sur **${guild.name}** a été fermé.`
        )
        .addFields(
          { name: '👤 Fermé par', value: `${interaction.user.tag}`, inline: true },
          { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        )
        .setFooter({ text: 'AOTSMP • Système de Support' })
        .setTimestamp();
      await member.user.send({ embeds: [dmEmbed] });
    } catch (e) {}

    // Déplacer + lock
    if (setup?.categoryClosedId) {
      await channel.setParent(setup.categoryClosedId, { lockPermissions: true });
    }
    try {
      await channel.permissionOverwrites.edit(ticket.userId, { SendMessages: false, ViewChannel: false });
    } catch (e) {}

    const cleanName = channel.name.replace(/^[🟢🔴⏳📋]-?/, '');
    await channel.setName(`🔴-${cleanName}`);
    setTicket(channel.id, { status: 'closed', closedBy: interaction.user.id, closedAt: Date.now() });

    await channel.send({
      embeds: [new EmbedBuilder()
        .setColor(config.colors.danger)
        .setTitle('🔒 Ticket Fermé')
        .setDescription(`Ce ticket a été fermé par <@${interaction.user.id}>.`)
        .setTimestamp()],
    });

    // LOG
    if (setup?.logsChannelId) {
      const logsChannel = guild.channels.cache.get(setup.logsChannelId);
      if (logsChannel) {
        await logsChannel.send({
          embeds: [new EmbedBuilder()
            .setColor(config.colors.danger)
            .setTitle('🔴 Ticket Fermé')
            .addFields(
              { name: '📂 Ticket', value: `\`${channel.name}\``, inline: true },
              { name: '👤 Joueur', value: `<@${ticket.userId}>`, inline: true },
              { name: '👮 Fermé par', value: `<@${interaction.user.id}>`, inline: true },
            )
            .setTimestamp()],
        });
      }
    }
  },
};
