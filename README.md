# 💊 ToutPharma

**Plateforme de vente d'équipements pharmaceutiques et médicaux** pour les pharmacies,
hôpitaux et cliniques (Dakar, Sénégal).

Le client parcourt le catalogue, constitue son panier et envoie sa demande : elle est
**enregistrée en base**, un **bon de commande PDF** est généré côté serveur, et un
message **WhatsApp pré-rempli** (avec le lien du PDF) part vers la pharmacie.
Modèle B2B « tout sur devis » : aucun prix n'est affiché au client — vous recontactez
chaque client avec un devis personnalisé.

[![CI](https://github.com/S3S4F/toutpharma/actions/workflows/ci.yml/badge.svg)](https://github.com/S3S4F/toutpharma/actions/workflows/ci.yml)

---

## 📦 Contenu du dépôt

| Dossier | Rôle | Stack |
|---|---|---|
| [`toutpharma/`](toutpharma/) | Site vitrine + boutique + **administration** | React 18, Vite, Tailwind CSS |
| [`toutpharma-backend/`](toutpharma-backend/) | API REST | Node.js, Express, SQLite |
| [`toutpharma-v2/`](toutpharma-v2/) | Refonte Next.js (en pause — phase 0 uniquement) | Next.js, PostgreSQL, Drizzle |
| [`docs/`](docs/) | Spécifications et plans | — |

> **Le produit actif est `toutpharma` + `toutpharma-backend`.**
> La v2 est conservée comme référence pour une future migration.

---

## ✨ Fonctionnalités

### Côté client (boutique)
- 🛍️ **Catalogue** d'équipements médicaux par catégories, avec filtres et recherche
- 📋 **Tout sur devis** : aucun prix affiché, flexibilité tarifaire totale
- 🛒 **Panier de demande** : quantités, coordonnées (nom + téléphone)
- ✅ **Commande fiable** : enregistrée en base *avant* l'envoi WhatsApp — aucune
  demande perdue, numéro séquentiel `CMD-AAAA-NNNN`
- 📄 **Bon de commande PDF** généré côté serveur et lié dans le message WhatsApp
- 💬 **Envoi WhatsApp** pré-rempli vers le numéro de la pharmacie (configurable)
- 📸 **Envoi d'ordonnance** en photo (préparation en pharmacie)
- 📅 **Prise de rendez-vous** (vaccination, conseils…)

### Côté administration (`/admin`)
- 🔐 Connexion par mot de passe, **token signé (HMAC)** vérifié sur toutes les routes
- 📊 **Tableau de bord** : commandes à traiter, totaux, raccourcis
- 📦 **Suivi des commandes** : pipeline *Reçue → Client contacté → Devis envoyé →
  Confirmée → Livrée / Annulée*, recherche et filtres, **notes internes**,
  bouton WhatsApp direct vers le client, retéléchargement du PDF
- 🛠️ **Produits** : création, **modification**, suppression, upload d'images,
  prix interne (jamais montré au client)
- 📅 **Rendez-vous** et 📋 **ordonnances** avec statuts modifiables
- ⚙️ **Paramètres** : numéro WhatsApp de réception **modifiable sans toucher au code**,
  ouverture/fermeture forcée de la boutique

---

## 🚀 Démarrage rapide

### Option A — Docker (recommandé)

```bash
cp .env.deploy.example .env      # puis éditer les valeurs (mot de passe admin, etc.)
docker compose up -d --build
```

→ Site : **http://localhost:8080** · Admin : **http://localhost:8080/admin/login**

Un seul port exposé : nginx sert le front **et** proxifie `/api` + `/uploads`
vers le backend (pas de CORS, liens PDF publics sur le même domaine).

### Option B — Développement local

**Backend** (port 3001) :
```bash
cd toutpharma-backend
npm install
cp .env.example .env             # ADMIN_PASSWORD, ADMIN_TOKEN_SECRET, PUBLIC_URL
node server.js
```

**Frontend** (port 5173) :
```bash
cd toutpharma
npm install
npm run dev
```

---

## ⚙️ Variables d'environnement

| Variable | Où | Description |
|---|---|---|
| `ADMIN_PASSWORD` | backend | Mot de passe de l'administration (**obligatoire en prod**) |
| `ADMIN_TOKEN_SECRET` | backend | Secret de signature des tokens de session (**obligatoire en prod**) |
| `PUBLIC_URL` | backend | URL publique du site — sert aux liens images + **PDF WhatsApp** (ex. `https://toutpharma.sn`) |
| `DB_PATH` | backend | Chemin de la base SQLite (défaut `./database.sqlite`, volume Docker en prod) |
| `PORT` | backend | Port de l'API (défaut `3001`) |
| `VITE_API_URL` | front (build) | URL de l'API ; **chaîne vide = même origine** (mode Docker/nginx) |
| `FRONT_PORT` | compose | Port exposé par nginx (défaut `8080` en local, `80` en prod) |

Modèle complet : [`.env.deploy.example`](.env.deploy.example).

---

## 🔌 API (aperçu)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| `GET` | `/api/products` | public | Catalogue |
| `POST/PUT/DELETE` | `/api/products[/:id]` | admin | Gestion produits |
| `POST` | `/api/orders` | public (rate-limité) | Créer une commande → PDF + lien WhatsApp |
| `GET/PATCH` | `/api/orders[/:id]` | admin | Liste, statut, notes internes |
| `POST` | `/api/appointments` | public | Prendre rendez-vous |
| `GET/PATCH` | `/api/appointments[/:id]` | admin | Suivi des rendez-vous |
| `POST` | `/api/prescriptions` | public | Envoyer une ordonnance (photo) |
| `GET/PATCH` | `/api/prescriptions[/:id]` | admin | Suivi des ordonnances (données de santé — jamais publiques) |
| `GET` | `/api/settings` | public | Numéro WhatsApp, horaires |
| `PUT` | `/api/settings` | admin | Modifier numéro WhatsApp / ouverture |
| `GET` | `/api/status` | public | Ouvert / Fermé |
| `GET` | `/api/stats` | admin | Statistiques du tableau de bord |
| `POST` | `/api/login` | public | Connexion admin → token |

Les routes admin exigent l'en-tête `Authorization: Bearer <token>`.
Uploads limités à 5 Mo, images uniquement.

---

## 🔄 CI/CD

À chaque push (`.github/workflows/ci.yml`) :
1. **Front** : `eslint` + `vite build`
2. **Backend** : vérification syntaxe + test de fumée (le serveur démarre et répond)
3. Sur `master` : build et publication des images Docker sur GHCR :
   - `ghcr.io/s3s4f/toutpharma-front:latest`
   - `ghcr.io/s3s4f/toutpharma-backend:latest`

Le workflow **Deploy** (`.github/workflows/deploy.yml`) se connecte ensuite au serveur
en SSH et relance la stack — automatiquement après une CI verte, ou à la main depuis
l'onglet *Actions*. Secrets requis : `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`,
`DEPLOY_PATH`.

**Guide de mise en production complet : [DEPLOIEMENT.md](DEPLOIEMENT.md)**
(VPS, domaine, HTTPS, sauvegardes des volumes). Le dépôt est aussi compatible avec
les plateformes type **Openship / Coolify / Dokploy** : elles consomment le
`docker-compose.yml` tel quel.

---

## 🗂️ Données & sauvegardes

Toutes les données vivent dans **deux volumes Docker** :

- `toutpharma-data` → base SQLite (commandes, produits, RDV, ordonnances, paramètres)
- `toutpharma-uploads` → images produits, photos d'ordonnances, **PDF des commandes**

Commandes de sauvegarde prêtes à l'emploi dans [DEPLOIEMENT.md](DEPLOIEMENT.md#sauvegardes).

---

## 🧭 Feuille de route

- [ ] **WhatsApp Business Cloud API** : réception automatique du PDF en pièce jointe
  (sans action du client) + confirmation au client
- [ ] Bouton « **Recommander** » : rejouer une commande précédente en 1 clic
- [ ] Fiches produit enrichies : référence fabricant, unité de vente, fiche technique PDF
- [ ] **Devis retour** : générer le devis chiffré en PDF depuis l'admin
- [ ] Acompte **Wave / Orange Money**
- [ ] Reprise de la **v2 Next.js** (SEO serveur, PostgreSQL) une fois le modèle validé

---

## 📄 Licence

Projet privé — tous droits réservés.
