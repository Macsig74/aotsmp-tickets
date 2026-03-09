// config.js — Configuration centrale du bot AOTSMP Tickets
module.exports = {
  colors: {
    primary:    0x5865F2,
    success:    0x57F287,
    danger:     0xED4245,
    warning:    0xFEE75C,
    info:       0x5DADE2,
    closed:     0x95A5A6,
    later:      0xE67E22,
    // Types
    deban:      0xE74C3C,  // Rouge
    staff:      0x9B59B6,  // Violet
    dev:        0x3498DB,  // Bleu
    media:      0xE67E22,  // Orange
    bug:        0xF39C12,  // Jaune-orange
    achat:      0x2ECC71,  // Vert
    connexion:  0x5DADE2,  // Bleu clair
    report:     0xE74C3C,  // Rouge vif
    autre:      0x95A5A6,  // Gris
  },

  categories: {
    ticketsOuverts: '📂 • TICKETS OUVERTS',
    ticketsFermes:  '🔒 • TICKETS FERMÉS',
    candid:         '📋 • CANDIDATURES',
    attente:        '⏳ • EN ATTENTE',
  },

  channels: {
    ticketPanel: '📩・créer-un-ticket',
    logs:        '📋・logs-tickets',
  },

  mysql: {
    host:     process.env.MYSQL_HOST     || 'localhost',
    port:     parseInt(process.env.MYSQL_PORT) || 3306,
    user:     process.env.MYSQL_USER     || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'advancedban',
    banTable: process.env.MYSQL_BAN_TABLE || 'Punishments',
  },

  // Types de tickets — format du nom : type-pseudo-0001
  ticketTypes: {
    deban:     { label: 'Demande de Déban',       emoji: '🔨', color: 0xE74C3C },
    staff:     { label: 'Candidature Staff',       emoji: '👮', color: 0x9B59B6 },
    dev:       { label: 'Candidature Dev',         emoji: '💻', color: 0x3498DB },
    media:     { label: 'Candidature Média',       emoji: '🎬', color: 0xE67E22 },
    bug:       { label: 'Bug Report',              emoji: '🐛', color: 0xF39C12 },
    achat:     { label: 'Support Achat',           emoji: '🛒', color: 0x2ECC71 },
    connexion: { label: 'Problème de Connexion',   emoji: '📡', color: 0x5DADE2 },
    report:    { label: 'Player Report',           emoji: '⚠️', color: 0xE74C3C },
    autre:     { label: 'Autre / Support',         emoji: '📌', color: 0x95A5A6 },
  },

  messages: {
    panelTitle: 'AOTSMP | Support',
    panelDescription:
      'Les tickets vous permettent de contacter l\'équipe **AOTSMP**.\n' +
      '**N\'ouvrez un ticket que si vous avez besoin d\'aide, et évitez d\'en ouvrir plusieurs pour le même problème.**',
    ticketWelcome: (user, type) =>
      `Bonjour ${user} ! 👋\n\nMerci d'avoir ouvert un ticket **${type}**.\nUn membre du **staff AOTSMP** va prendre en charge ta demande.\n\n> Merci de rester disponible dans ce salon.`,
  },
};
