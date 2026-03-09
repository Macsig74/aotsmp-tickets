// utils/db.js — Stockage JSON simple pour les tickets
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'tickets.json');
const SETUP_PATH = path.join(__dirname, '..', 'data', 'setup.json');

// Ensure data directory exists
function ensureDir() {
  const dir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// === TICKETS ===
function loadTickets() {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveTickets(data) {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getTicket(channelId) {
  const db = loadTickets();
  return db[channelId] || null;
}

function setTicket(channelId, data) {
  const db = loadTickets();
  db[channelId] = { ...db[channelId], ...data, channelId };
  saveTickets(db);
}

function deleteTicket(channelId) {
  const db = loadTickets();
  delete db[channelId];
  saveTickets(db);
}

function getNextTicketId(guildId) {
  const db = loadTickets();
  let max = 0;
  for (const t of Object.values(db)) {
    if (t.guildId === guildId && t.ticketId > max) max = t.ticketId;
  }
  return max + 1;
}

// === SETUP ===
function loadSetup() {
  ensureDir();
  if (!fs.existsSync(SETUP_PATH)) return {};
  return JSON.parse(fs.readFileSync(SETUP_PATH, 'utf8'));
}

function saveSetup(data) {
  ensureDir();
  fs.writeFileSync(SETUP_PATH, JSON.stringify(data, null, 2));
}

function getSetup(guildId) {
  return loadSetup()[guildId] || null;
}

function setSetup(guildId, data) {
  const setup = loadSetup();
  setup[guildId] = { ...setup[guildId], ...data };
  saveSetup(setup);
}

module.exports = {
  getTicket, setTicket, deleteTicket, getNextTicketId,
  getSetup, setSetup,
};
