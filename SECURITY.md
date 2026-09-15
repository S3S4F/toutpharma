# Politique de sécurité

## Signaler une vulnérabilité

Merci de signaler toute vulnérabilité **en privé**, jamais dans une issue publique :

- GitHub → onglet *Security* → *Report a vulnerability* (advisory privé), ou
- WhatsApp au numéro de contact du site en précisant « sécurité ».

Nous accusons réception sous 72 h et corrigeons en priorité.

## Mesures en place

| Domaine | Mesure |
|---|---|
| Authentification admin | Token HMAC signé + expiration 7 j ; mot de passe ≥ 12 caractères et secret ≥ 32 caractères **exigés en production** (démarrage refusé sinon) |
| Anti-bruteforce | Rate limit connexion : 5 tentatives / 15 min / IP |
| Données de santé | Photos d'ordonnances stockées hors du statique public, servies uniquement via endpoint authentifié |
| Uploads | Formats whitelist (JPG/PNG/WebP), 15 Mo max, re-encodage systématique WebP par sharp (le décodage vaut validation), garde anti-bombe de décompression (40 MP), noms UUID |
| Injections | Requêtes SQL 100 % paramétrées ; validation/troncature des entrées ; prix jamais acceptés du client |
| En-têtes HTTP | CSP, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy (nginx) + nosniff/DENY côté API |
| CORS | Fermé par défaut en production (`CORS_ORIGINS` en liste blanche si API exposée séparément) |
| Anti-spam | Rate limits sur commandes, ordonnances et rendez-vous |
| Chaîne d'approvisionnement | Dependabot (npm, Actions, Docker) + CI obligatoire (lint, build, tests d'intégration) |
| Secrets | Jamais commités (.env ignoré) ; variables d'environnement ; images Docker non-root |

## Périmètre

Le code des dossiers `toutpharma/` et `toutpharma-backend/` de ce dépôt, ainsi que
les images Docker publiées sur GHCR.
