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
   lint + build front, vérification + test de fumée backend.
   Sur `main`/`master`, elle publie aussi les images Docker sur
   **GitHub Container Registry** :
   - `ghcr.io/votre-user/votre-repo-front:latest`
   - `ghcr.io/votre-user/votre-repo-backend:latest`
3. Pour le déploiement automatique, créer 4 secrets GitHub
   (Settings → Secrets and variables → Actions) :
   `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`.

## 3. Préparer le serveur (une seule fois)

Sur n'importe quel VPS avec Docker (Hetzner, Contabo, OVH, Scaleway…) :

```bash
mkdir -p /opt/toutpharma && cd /opt/toutpharma
# copier docker-compose.prod.yml et .env.deploy.example depuis le repo
cp .env.deploy.example .env
nano .env    # ADMIN_PASSWORD, ADMIN_TOKEN_SECRET, PUBLIC_URL=https://votre-domaine,
             # FRONT_PORT=80, IMAGE_PREFIX=ghcr.io/votre-user/votre-repo

# si le repo GitHub est privé, se connecter à GHCR :
docker login ghcr.io -u VOTRE-USER   # mot de passe = un token GitHub (read:packages)

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

**HTTPS** : mettre le domaine derrière Cloudflare (le plus simple), ou ajouter
un reverse-proxy Caddy/Traefik devant `front`.

## 4. Déployer une nouvelle version

- **Automatique** : pousser sur `main` → CI verte → le workflow *Deploy*
  se connecte au serveur et relance la stack avec les nouvelles images.
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
