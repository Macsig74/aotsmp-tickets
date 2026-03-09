# 🎫 AOTSMP — Système de Tickets

Bot Discord de gestion de tickets pour **AOTSMP**, inspiré du style DonutSMP.

---

## 📦 Installation

### 1. Prérequis
- Node.js v18+
- Un bot Discord (sur [discord.com/developers](https://discord.com/developers/applications))

### 2. Cloner et installer
```bash
# Extraire le dossier, puis :
npm install
```

### 3. Configurer le `.env`
```bash
cp .env.example .env
# Édite le fichier .env avec tes valeurs :
```

```env
DISCORD_TOKEN=ton_token_ici
CLIENT_ID=id_de_ton_application
GUILD_ID=id_de_ton_serveur
```

> 💡 **Où trouver ces infos ?**
> - `DISCORD_TOKEN` → [Discord Dev Portal](https://discord.com/developers/applications) → Ton app → Bot → Token
> - `CLIENT_ID` → Ton app → General Information → Application ID
> - `GUILD_ID` → Discord → Clic droit sur ton serveur → Copier l'identifiant

### 4. Déployer les commandes
```bash
npm run deploy
```

### 5. Lancer le bot
```bash
npm start
```

---

## ⚙️ Configuration du serveur

Dans Discord, utilise :
```
/setup staff:@TonRôleStaff
```

Cela va créer automatiquement :
| Catégorie | Usage |
|-----------|-------|
| 📂 TICKETS OUVERTS | Tickets actifs |
| 🔒 TICKETS FERMÉS | Tickets fermés |
| 📋 CANDIDATURES | Candidatures en cours |
| ⏳ EN ATTENTE | "On a retenu ta candidature" |

Et les salons :
- `📩・créer-un-ticket` — Panel avec bouton de création
- `📋・logs-tickets` — Logs de toutes les actions

---

## 🎯 Commandes disponibles

| Commande | Description | Réservé Staff |
|----------|-------------|:-------------:|
| `/setup` | Configure le système complet | ✅ Admin |
| `/close [raison]` | Ferme le ticket + DM au joueur | ✅ |
| `/rename <nom>` | Renomme le salon du ticket | ✅ |
| `/later [message]` | Met en attente ("on a retenu ta candidature") | ✅ |
| `/candid-en-cours` | Déplace dans la catégo Candidatures | ✅ |

---

## 🔄 Flux d'un ticket

```
Joueur clique 🎫 "Ouvrir un ticket"
        ↓
Salon créé dans 📂 TICKETS OUVERTS
        ↓
Staff répond
        ↓
    [Options staff]
    ├── /later        → ⏳ EN ATTENTE  (DM joueur: "on a retenu ta candidature")
    ├── /candid-en-cours → 📋 CANDIDATURES (DM joueur: "en cours d'examen")
    ├── /rename       → Renomme le salon
    └── /close raison → 🔒 TICKETS FERMÉS (DM joueur avec raison)
```

---

## 📁 Structure du projet

```
aotsmp-tickets/
├── index.js              # Point d'entrée
├── config.js             # Configuration centrale (couleurs, messages...)
├── deploy-commands.js    # Déploie les slash commands
├── commands/
│   ├── setup.js          # /setup
│   ├── close.js          # /close
│   ├── rename.js         # /rename
│   ├── later.js          # /later
│   └── candid-en-cours.js # /candid-en-cours
├── buttons/
│   ├── ticket_create.js       # Bouton "Ouvrir un ticket"
│   ├── ticket_close_btn.js    # Bouton "Fermer" (demande confirmation)
│   ├── ticket_close_confirm.js # Confirmation fermeture
│   └── ticket_close_cancel.js  # Annulation fermeture
├── events/
│   ├── ready.js           # Événement bot prêt
│   └── interactionCreate.js # Gestion des interactions
├── utils/
│   ├── db.js              # Base de données JSON locale
│   ├── embeds.js          # Embeds réutilisables
│   └── permissions.js     # Vérifications de permissions
└── data/                  # Créé automatiquement
    ├── tickets.json        # Stockage des tickets
    └── setup.json          # Config par serveur
```

---

## 🎨 Personnalisation

Tout est centralisé dans `config.js` :
- **Couleurs** des embeds
- **Noms** des catégories et salons
- **Messages** du panel et des tickets
- **Emojis**

---

## 🔐 Permissions bot requises

Dans le Discord Dev Portal → Bot, active les **Privileged Gateway Intents** :
- ✅ Server Members Intent
- ✅ Message Content Intent

Permissions OAuth2 nécessaires :
- `Manage Channels`
- `Manage Roles` (pour les permissions)
- `Send Messages`
- `Embed Links`
- `Read Message History`
- `View Channels`
