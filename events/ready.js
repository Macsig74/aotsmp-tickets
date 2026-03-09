// events/ready.js
const { testConnection } = require('../utils/mysql');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`\n✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} serveur(s) | ${client.commands.size} commande(s) | ${client.buttons.size} bouton(s)`);
    await testConnection();
    console.log('');
    client.user.setPresence({
      activities: [{ name: '🎫 AOTSMP Tickets', type: 3 }],
      status: 'online',
    });
  },
};
