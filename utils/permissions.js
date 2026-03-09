// utils/permissions.js
const { getSetup } = require('./db');

async function isStaff(member, guildId) {
  const setup = getSetup(guildId);
  if (!setup) return member.permissions.has('ManageChannels');

  if (member.permissions.has('Administrator')) return true;

  if (setup.staffRoleId) {
    return member.roles.cache.has(setup.staffRoleId);
  }

  // Fallback: ManageChannels
  return member.permissions.has('ManageChannels');
}

async function requireStaff(interaction) {
  const ok = await isStaff(interaction.member, interaction.guildId);
  if (!ok) {
    const { errorEmbed } = require('./embeds');
    await interaction.reply({
      embeds: [errorEmbed('Accès refusé', 'Tu dois être **staff** pour utiliser cette commande.')],
      ephemeral: true,
    });
    return false;
  }
  return true;
}

async function requireTicketChannel(interaction) {
  const { getTicket } = require('./db');
  const ticket = getTicket(interaction.channelId);
  if (!ticket) {
    const { errorEmbed } = require('./embeds');
    await interaction.reply({
      embeds: [errorEmbed('Pas un ticket', 'Cette commande doit être utilisée dans un salon de ticket.')],
      ephemeral: true,
    });
    return null;
  }
  return ticket;
}

module.exports = { isStaff, requireStaff, requireTicketChannel };
