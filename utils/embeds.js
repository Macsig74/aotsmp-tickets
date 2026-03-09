// utils/embeds.js — Embeds réutilisables
const { EmbedBuilder } = require('discord.js');
const config = require('../config');

const { colors, emojis } = config;

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(colors.success)
    .setTitle(`${emojis.success} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(colors.danger)
    .setTitle(`${emojis.error} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(colors.info)
    .setTitle(`${emojis.info} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function ticketEmbed(title, description, color = colors.primary) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function logEmbed(action, ticket, executor, reason = null) {
  const colorMap = {
    'Ouvert': colors.success,
    'Fermé': colors.danger,
    'Renommé': colors.info,
    'En Attente': colors.later,
    'Candidature': colors.candid,
  };

  const embed = new EmbedBuilder()
    .setColor(colorMap[action] || colors.primary)
    .setTitle(`${emojis.ticket} Ticket ${action}`)
    .addFields(
      { name: '🆔 Ticket', value: `#${ticket.name || ticket.channelId}`, inline: true },
      { name: '👤 Utilisateur', value: `<@${ticket.userId}>`, inline: true },
      { name: '👮 Staff', value: executor ? `<@${executor.id}>` : 'Système', inline: true },
    )
    .setTimestamp();

  if (reason) embed.addFields({ name: '📝 Raison', value: reason, inline: false });
  return embed;
}

module.exports = { successEmbed, errorEmbed, infoEmbed, ticketEmbed, logEmbed };
