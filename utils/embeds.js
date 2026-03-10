const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function successEmbed(title, description) {
  return new EmbedBuilder().setColor(config.colors.success).setTitle(`✅ ${title}`).setDescription(description).setTimestamp();
}
function errorEmbed(title, description) {
  return new EmbedBuilder().setColor(config.colors.danger).setTitle(`❌ ${title}`).setDescription(description).setTimestamp();
}
function infoEmbed(title, description) {
  return new EmbedBuilder().setColor(config.colors.info).setTitle(`ℹ️ ${title}`).setDescription(description).setTimestamp();
}
function logEmbed(action, ticket, executor, reason = null) {
  const colorMap = { 'Ouvert': config.colors.success, 'Fermé': config.colors.danger, 'Renommé': config.colors.info, 'En Attente': config.colors.later };
  const embed = new EmbedBuilder()
    .setColor(colorMap[action] || config.colors.primary)
    .setTitle(`🎫 Ticket ${action}`)
    .addFields(
      { name: 'Ticket', value: `#${ticket.name || ticket.channelId}`, inline: true },
      { name: 'Utilisateur', value: `<@${ticket.userId}>`, inline: true },
      { name: 'Staff', value: executor ? `<@${executor.id}>` : 'Système', inline: true },
    ).setTimestamp();
  if (reason) embed.addFields({ name: '📝 Raison', value: reason, inline: false });
  return embed;
}

module.exports = { successEmbed, errorEmbed, infoEmbed, logEmbed };