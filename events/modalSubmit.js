// events/modalSubmit.js — Traitement de tous les modals — style DonutSMP
const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { createTicket } = require('../utils/createTicket');
const { getBanInfo } = require('../utils/mysql');

function getField(interaction, id) {
  try { return interaction.fields.getTextInputValue(id) || ''; }
  catch { return ''; }
}

function warningEmbed() {
  return new EmbedBuilder()
    .setColor(0xFEE75C)
    .setDescription('⚠️ **Ce formulaire a été transmis à AOTSMP. Ne donne pas de mot de passe ni toute autre information sensible.**');
}

async function finish(interaction, ticketChannel) {
  await ticketChannel.send({ embeds: [warningEmbed()] });
  return interaction.editReply({
    embeds: [new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('✅ Ticket créé !')
      .setDescription(`Ton ticket a été ouvert : ${ticketChannel.toString()}`)],
  });
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;
    const { customId } = interaction;

    // ── DÉBAN ──
    if (customId === 'modal_deban') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo        = getField(interaction, 'pseudo');
      const raisonBan     = getField(interaction, 'raison_ban');
      const pourquoi      = getField(interaction, 'pourquoi_deban');
      const preuves       = getField(interaction, 'preuves');

      const banInfo = await getBanInfo(pseudo);
      let banWarnEmbed = null;

      if (banInfo.error) {
        banWarnEmbed = new EmbedBuilder().setColor(config.colors.warning)
          .setDescription(`⚠️ Impossible de vérifier le ban de **${pseudo}** (erreur DB). Ticket créé malgré tout.`);
      } else if (banInfo.banned === false) {
        return interaction.editReply({
          embeds: [new EmbedBuilder().setColor(config.colors.danger)
            .setTitle('❌ Tu n\'es pas banni')
            .setDescription(`Le pseudo **${pseudo}** n'est pas banni sur AOTSMP.\nSi tu penses que c'est une erreur, contacte un administrateur.`)],
        });
      }

      const fields = [
        { name: '🎮 Pseudo banni', value: pseudo, inline: true },
        { name: '📝 Raison du ban (selon toi)', value: raisonBan, inline: false },
        { name: '🙏 Pourquoi mérites-tu un déban ?', value: pourquoi, inline: false },
      ];
      if (preuves) fields.push({ name: '🔗 Preuves', value: preuves, inline: false });
      if (banInfo.banned) fields.push({
        name: '🗃️ Infos ban (AdvancedBan)',
        value: `**Raison officielle :** ${banInfo.reason}\n**Banni par :** ${banInfo.operator}\n**Date :** <t:${Math.floor(banInfo.start/1000)}:F>\n**Expiration :** ${banInfo.permanent ? '♾️ Permanent' : `<t:${Math.floor(banInfo.end/1000)}:F>`}`,
        inline: false,
      });

      try {
        const ch = await createTicket(interaction, 'deban', pseudo, fields, { raisonBan, pourquoi, preuves });
        await ch.send({ embeds: [warningEmbed()] });
        if (banWarnEmbed) await ch.send({ embeds: [banWarnEmbed] });
        return interaction.editReply({
          embeds: [new EmbedBuilder().setColor(config.colors.success).setTitle('✅ Demande de déban créée !').setDescription(`Ton ticket : ${ch.toString()}`)],
        });
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── PLAYER REPORT ──
    if (customId === 'modal_report') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo    = getField(interaction, 'pseudo');
      const userId    = getField(interaction, 'user_id');
      const lienPreuve= getField(interaction, 'lien_preuve');
      const raison    = getField(interaction, 'raison');

      const fields = [
        { name: '🎮 Joueur signalé', value: pseudo, inline: true },
        userId ? { name: '🆔 ID Discord', value: userId, inline: true } : null,
        { name: '🔗 Lien preuve', value: lienPreuve, inline: false },
        { name: '📋 Règle enfreinte', value: raison, inline: false },
      ].filter(Boolean);

      try {
        const ch = await createTicket(interaction, 'report', pseudo, fields, { userId, lienPreuve, raison });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── MEDIA ──
    if (customId === 'modal_media') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo     = getField(interaction, 'pseudo');
      const lienVideo  = getField(interaction, 'lien_video');
      const conditions = getField(interaction, 'conditions');
      const ipComplete = getField(interaction, 'ip_complete');

      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🎬 Lien vidéo / chaîne', value: lienVideo, inline: false },
        { name: '✅ Conditions remplies', value: conditions, inline: false },
        { name: '🌐 IP complète affichée ?', value: ipComplete, inline: true },
      ];

      try {
        const ch = await createTicket(interaction, 'media', pseudo, fields, { lienVideo, conditions, ipComplete });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── BUG REPORT ──
    if (customId === 'modal_bug') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo       = getField(interaction, 'pseudo');
      const descBug      = getField(interaction, 'description_bug');
      const lienVideo    = getField(interaction, 'lien_video');
      const whereami     = getField(interaction, 'whereami');

      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🐛 Description du bug', value: descBug, inline: false },
        { name: '🎥 Lien vidéo / preuve', value: lienVideo, inline: false },
        { name: '📍 /whereami', value: whereami, inline: false },
      ];

      try {
        const ch = await createTicket(interaction, 'bug', pseudo, fields, { descBug, lienVideo, whereami });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── PURCHASE SUPPORT ──
    if (customId === 'modal_achat') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo      = getField(interaction, 'pseudo');
      const plateforme  = getField(interaction, 'plateforme');
      const codeAchat   = getField(interaction, 'code_achat');
      const probleme    = getField(interaction, 'probleme');

      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🖥️ Plateforme & version', value: plateforme, inline: true },
        { name: '🧾 Code transaction', value: codeAchat, inline: false },
        { name: '❓ Problème', value: probleme, inline: false },
      ];

      try {
        const ch = await createTicket(interaction, 'achat', pseudo, fields, { plateforme, codeAchat, probleme });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── CONNEXION ──
    if (customId === 'modal_connexion') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo     = getField(interaction, 'pseudo');
      const plateforme = getField(interaction, 'plateforme');
      const whereami   = getField(interaction, 'whereami');
      const probleme   = getField(interaction, 'probleme');

      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🖥️ Plateforme & version', value: plateforme, inline: true },
        { name: '📍 /whereami', value: whereami, inline: false },
        { name: '❓ Problème', value: probleme, inline: false },
      ];

      try {
        const ch = await createTicket(interaction, 'connexion', pseudo, fields, { plateforme, whereami, probleme });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── STAFF ──
    if (customId === 'modal_staff') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo = getField(interaction, 'pseudo'), age = getField(interaction, 'age'),
            experience = getField(interaction, 'experience'), pourquoi = getField(interaction, 'pourquoi'),
            dispos = getField(interaction, 'dispos');
      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🎂 Âge', value: age, inline: true },
        { name: '📅 Disponibilités', value: dispos, inline: false },
        { name: '🏆 Expérience / anciens serveurs', value: experience, inline: false },
        { name: '💬 Pourquoi rejoindre le staff ?', value: pourquoi, inline: false },
      ];
      try {
        const ch = await createTicket(interaction, 'staff', pseudo, fields, { age, experience, pourquoi, dispos });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── DEV ──
    if (customId === 'modal_dev') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo = getField(interaction, 'pseudo'), age = getField(interaction, 'age'),
            experience = getField(interaction, 'experience'), pourquoi = getField(interaction, 'pourquoi'),
            dispos = getField(interaction, 'dispos');
      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🎂 Âge', value: age, inline: true },
        { name: '📅 Disponibilités', value: dispos, inline: false },
        { name: '💻 Langages & Expérience dev', value: experience, inline: false },
        { name: '🚀 Pourquoi rejoindre AOTSMP ?', value: pourquoi, inline: false },
      ];
      try {
        const ch = await createTicket(interaction, 'dev', pseudo, fields, { age, experience, pourquoi, dispos });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── MEDIA ──
    if (customId === 'modal_media') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo = getField(interaction, 'pseudo'), lienVideo = getField(interaction, 'lien_video'),
            conditions = getField(interaction, 'conditions'), ipComplete = getField(interaction, 'ip_complete');
      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '🎬 Lien vidéo / chaîne', value: lienVideo, inline: false },
        { name: '✅ Conditions remplies', value: conditions, inline: false },
        { name: '🌐 IP complète affichée ?', value: ipComplete, inline: true },
      ];
      try {
        const ch = await createTicket(interaction, 'media', pseudo, fields, { lienVideo, conditions, ipComplete });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }

    // ── AUTRE ──
    if (customId === 'modal_autre') {
      await interaction.deferReply({ ephemeral: true });
      const pseudo = getField(interaction, 'pseudo'), sujet = getField(interaction, 'sujet'),
            description = getField(interaction, 'description');
      const fields = [
        { name: '🎮 Pseudo Minecraft', value: pseudo, inline: true },
        { name: '📌 Sujet', value: sujet, inline: true },
        { name: '📝 Description', value: description, inline: false },
      ];
      try {
        const ch = await createTicket(interaction, 'autre', pseudo, fields, { sujet, description });
        return finish(interaction, ch);
      } catch (e) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle('❌ Erreur').setDescription(e.message)] });
      }
    }
  },
};
