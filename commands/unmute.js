const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { getSetup } = require('../utils/db');
const { requireStaff } = require('../utils/permissions');
const { rconCommand } = require('../utils/rcon');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute un joueur ingame')
    .addStringOption(o => o.setName('pseudo').setDescription('Pseudo exact du joueur').setRequired(true)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const pseudo = interaction.options.getString('pseudo');
    const setup = getSetup(interaction.guildId);

    await interaction.deferReply();

    try {
      const result = await rconCommand(`unmute ${pseudo}`);

      await interaction.editReply({
        embeds: [new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle('✅ Joueur unmute ingame')
          .addFields(
            { name: 'Pseudo', value: pseudo, inline: true },
            { name: 'Par', value: `<@${interaction.user.id}>`, inline: true },
            { name: 'Réponse RCON', value: result || 'OK', inline: false },
          ).setTimestamp()],
      });

      if (setup?.logsChannelId) {
        const logsChannel = interaction.guild.channels.cache.get(setup.logsChannelId);
        if (logsChannel) await logsChannel.send({
          embeds: [new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle('✅ unmute Ingame')
            .addFields(
              { name: 'Pseudo', value: pseudo, inline: true },
              { name: 'Staff', value: `<@${interaction.user.id}>`, inline: true },
            ).setTimestamp()],
        });
      }
      await sendDM(guild, ticket.userId, new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle('Tu as été unmute !')
          .setDescription('Tu peux revenir sur AOTSMP.net et réessayer de te connecter au serveur. Si tu as été unmute, c\'est que le staff a considéré que tu méritais une seconde chance, alors fais en sorte de ne pas la gâcher !')
          );

    } catch (err) {
      await interaction.editReply({
        embeds: [new EmbedBuilder()
          .setColor(config.colors.danger)
          .setTitle('❌ Erreur RCON')
          .setDescription(`\`${err.message}\``)],
      });
    }
  },
};