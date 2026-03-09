// utils/mysql.js — Connexion MySQL + requêtes AdvancedBan
const mysql = require('mysql2/promise');
const config = require('../config');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     config.mysql.host,
      port:     config.mysql.port,
      user:     config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

/**
 * Vérifie si un joueur est banni dans AdvancedBan.
 * AdvancedBan stocke les bans actifs dans la table `Punishments`
 * avec name (pseudo), punishmentType = 'BAN', et end = -1 (permanent) ou > now (temporaire).
 * @param {string} pseudo — pseudo Minecraft (case-insensitive)
 * @returns {{ banned: boolean, reason: string|null, operator: string|null, end: number|null, start: number|null }}
 */
async function getBanInfo(pseudo) {
  try {
    const db = getPool();
    const [rows] = await db.execute(
      `SELECT name, reason, operator, start, \`end\`, punishmentType
       FROM \`${config.mysql.banTable}\`
       WHERE LOWER(name) = LOWER(?)
         AND punishmentType = 'BAN'
         AND (\`end\` = -1 OR \`end\` > ?)
       LIMIT 1`,
      [pseudo, Date.now()]
    );

    if (!rows.length) return { banned: false };

    const row = rows[0];
    return {
      banned:    true,
      reason:    row.reason   || 'Aucune raison',
      operator:  row.operator || 'Console',
      start:     row.start,
      end:       row.end,
      permanent: row.end === -1,
    };
  } catch (err) {
    console.error('[MySQL] Erreur getBanInfo:', err.message);
    return { banned: null, error: err.message };
  }
}

/**
 * Teste la connexion MySQL au démarrage du bot.
 */
async function testConnection() {
  try {
    const db = getPool();
    await db.execute('SELECT 1');
    console.log('[MySQL] ✅ Connexion réussie à AdvancedBan DB');
    return true;
  } catch (err) {
    console.error('[MySQL] ❌ Échec de connexion:', err.message);
    return false;
  }
}

module.exports = { getBanInfo, testConnection, getPool };
