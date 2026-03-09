const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../config');
const { getTicket, getSetup } = require('../utils/db');
const { isStaff } = require('../utils/permissions');

module.exports = {
  customId: 'ticket_transcript',
  async execute(interaction) {
    const ok = await isStaff(interaction.member, interaction.guildId);
    if (!ok) return interaction.reply({ content: '❌ Réservé au staff.', flags: 64 });

    await interaction.deferReply({ flags: 64 });

    const channel = interaction.channel;
    const ticket = getTicket(channel.id);
    const guild = interaction.guild;
    const setup = getSetup(guild.id);

    // Récupérer tous les messages
    let messages = [];
    let lastId = null;
    while (true) {
      const opts = { limit: 100 };
      if (lastId) opts.before = lastId;
      const batch = await channel.messages.fetch(opts);
      if (batch.size === 0) break;
      messages = messages.concat([...batch.values()]);
      lastId = batch.last().id;
      if (batch.size < 100) break;
    }
    messages.reverse();

    // Générer le TXT
    const lines = [];
    lines.push(`========================================`);
    lines.push(`  TRANSCRIPT — #${channel.name}`);
    lines.push(`  ${messages.length} messages`);
    lines.push(`  Exporté le ${new Date().toLocaleString('fr-FR')}`);
    if (ticket) lines.push(`  Ticket de : ${ticket.pseudoMC || ticket.userId}`);
    lines.push(`========================================`);
    lines.push('');

    for (const m of messages) {
      const time = new Date(m.createdTimestamp).toLocaleString('fr-FR');
      const tag = m.author.bot ? ' [BOT]' : '';
      lines.push(`[${time}] ${m.author.username}${tag}`);
      if (m.content) lines.push(`  ${m.content}`);
      for (const e of m.embeds) {
        if (e.title) lines.push(`  [EMBED] ${e.title}`);
        if (e.description) lines.push(`  ${e.description.replace(/\n/g, '\n  ')}`);
        for (const f of e.fields || []) lines.push(`  • ${f.name}: ${f.value}`);
      }
      lines.push('');
    }

    lines.push(`========================================`);
    lines.push(`  AOTSMP • Support Transcript`);
    lines.push(`========================================`);

    const buffer = Buffer.from(lines.join('\n'), 'utf-8');
    const attachment = new AttachmentBuilder(buffer, { name: `transcript-${channel.name}.txt` });

    await channel.send({
      embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📄 Transcript généré')
        .setDescription(`${messages.length} messages exportés.`).setTimestamp()],
      files: [attachment],
    });

    // DM au créateur
    if (ticket) {
      try {
        const member = await guild.members.fetch(ticket.userId);
        const attachment2 = new AttachmentBuilder(buffer, { name: `transcript-${channel.name}.txt` });
        await member.user.send({
          embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📄 Transcript de ton ticket')
            .setDescription(`Voici le transcript de ton ticket **#${channel.name}** sur **${guild.name}**.`)
            .setFooter({ text: 'AOTSMP • Support' }).setTimestamp()],
          files: [attachment2],
        });
      } catch (e) {}
    }

    // Logs
    if (setup?.logsChannelId) {
      try {
        const logsChannel = guild.channels.cache.get(setup.logsChannelId);
        if (logsChannel) {
          const attachment3 = new AttachmentBuilder(buffer, { name: `transcript-${channel.name}.txt` });
          await logsChannel.send({
            embeds: [new EmbedBuilder().setColor(config.colors.info).setTitle('📄 Transcript')
              .addFields(
                { name: '📂 Ticket', value: `\`${channel.name}\``, inline: true },
                { name: '👮 Généré par', value: `<@${interaction.user.id}>`, inline: true },
              ).setTimestamp()],
            files: [attachment3],
          });
        }
      } catch (e) {}
    }

    await interaction.editReply({ content: '✅ Transcript généré !' });
  },
};