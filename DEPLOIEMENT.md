# ToutPharma — Guide de déploiement

Stack : **front** (React/Vite servi par nginx, qui proxifie aussi l'API) +
**backend** (Express + SQLite). Un seul port exposé, pas de CORS à gérer,
les liens PDF envoyés sur WhatsApp passent par le même domaine.

```
Internet ──► front (nginx :80) ──► /api, /uploads ──► backend (:3001)
                    │                                    │
                    └── fichiers statiques React         ├── volume data     (base SQLite)
                                                         └── volume uploads  (images + PDF)
```

## 1. Tester en local

```bash
cp .env.deploy.example .env      # puis éditer ADMIN_PASSWORD etc.
docker compose up -d --build
# → http://localhost:8080  (admin : http://localhost:8080/admin/login)
```

## 2. Mettre en place la CI/CD (une seule fois)

1. Créer un dépôt GitHub et pousser ce repo :
   ```bash
   git remote add origin git@github.com:VOTRE-USER/VOTRE-REPO.git
   git push -u origin main
   ```
2. La CI (`.github/workflows/ci.yml`) tourne à chaque push :
   lint + build front, vérification syntaxique backend.
   Sur `main`/`master`, elle publie aussi les images Docker sur
   **Docker Hub** :
   - `votre-user-dockerhub/toutpharma-front:latest`
   - `votre-user-dockerhub/toutpharma-backend:latest`
3. Créer les secrets GitHub suivants (Settings → Secrets and variables →
   Actions) — le workflow *Deploy* (`.github/workflows/deploy.yml`) les
   utilise pour se connecter au VPS **et** pour régénérer le `.env` de prod
   à chaque déploiement :

   | Secret | Rôle |
   |---|---|
   | `VPS_HOST` | IP ou domaine du VPS |
   | `VPS_PORT` | port SSH (ex. `22`) |
   | `VPS_USERNAME` | utilisateur SSH (doit pouvoir lancer `docker`) |
   | `VPS_SSH_KEY` | clé privée SSH correspondante |
   | `DOCKERHUB_USER` | utilisateur Docker Hub |
   | `DOCKERHUB_PASSWORD` | mot de passe ou access token Docker Hub |
   | `ADMIN_PASSWORD` | mot de passe de l'admin ToutPharma |
   | `ADMIN_TOKEN_SECRET` | secret de signature des tokens admin |
   | `FRONTEND_URL` | URL publique du site (ex. `https://toutpharma.sn`) |

## 3. Préparer le serveur (une seule fois)

Sur n'importe quel VPS avec Docker installé (Hetzner, Contabo, OVH, Scaleway…) :

```bash
mkdir -p ~/toutpharma
```

C'est tout — le workflow *Deploy* copie lui-même `docker-compose.prod.yml`
et génère le `.env` à partir des secrets GitHub à chaque déploiement
(voir §4). Rien à écrire à la main sur le serveur.

**Port** : le VPS héberge plusieurs projets, les ports sont attribués à
partir de 8101. ToutPharma est exposé sur `FRONT_PORT=8101`
(`http://VPS_HOST:8101`), à mettre derrière le reverse-proxy/domaine final.

Si vous préférez tester manuellement sans passer par la CI, vous pouvez
toujours copier `docker-compose.prod.yml` + `.env.deploy.example` vous-même,
remplir `.env` (voir le fichier pour le détail des variables), puis :

```bash
cd ~/toutpharma
docker login -u VOTRE-USER-DOCKERHUB   # si les images sont privées
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

**HTTPS** : mettre le domaine derrière Cloudflare (le plus simple), ou ajouter
un reverse-proxy Caddy/Traefik devant `front`.

## 4. Déployer une nouvelle version

- **Automatique** : pousser sur `main` → CI verte → le workflow *Deploy*
  se connecte au VPS, régénère `.env`, relance la stack avec les nouvelles
  images.
- **Manuel** : onglet *Actions* → *Deploy* → *Run workflow*,
  ou sur le serveur : `docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d`.

## Sauvegardes

Toutes les données vivent dans deux volumes Docker :

```bash
# base SQLite (commandes, produits, ordonnances…)
docker run --rm -v toutpharma_toutpharma-data:/data -v "$PWD":/backup alpine \
  tar czf /backup/toutpharma-data-$(date +%F).tar.gz -C /data .
# uploads (images produits, photos d'ordonnances, PDF de commandes)
docker run --rm -v toutpharma_toutpharma-uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/toutpharma-uploads-$(date +%F).tar.gz -C /data .
```

À mettre dans un cron quotidien sur le serveur.
