# ToutPharma v2 — Spécification de conception

**Date :** 2026-05-20
**Statut :** Validé (brainstorming)
**Auteur :** tech@tontika.com + Claude

---

## 1. Contexte et objectif

ToutPharma est aujourd'hui un site mixte (pharmacie B2C + ébauche e-commerce) construit en
React + Vite + Express + SQLite, avec une authentification admin codée en dur et aucune gestion
structurée des commandes.

**Objectif de la refonte :** pivoter vers une **plateforme B2B de vente de consommables
pharmaceutiques** destinée aux pharmacies, hôpitaux et cliniques (zone Sénégal). Le site doit être
solide, robuste, moderne, facile à utiliser, puissant et rentable.

**Modèle d'affaires :** catalogue de **demande de devis** (pas d'e-commerce transactionnel). Le
client parcourt le catalogue, constitue un panier de demande, soumet sa demande. Le propriétaire
reçoit la demande (en base + WhatsApp) et recontacte le client avec un devis personnalisé sous 24h.

Le site sert aussi de **vitrine** (visibilité, SEO) pour l'activité.

---

## 2. Décisions structurantes

| Sujet | Décision | Raison |
|---|---|---|
| Périmètre | B2B + vitrine pharmacie légère | Crédibilité pro, message clair, garde l'identité |
| Modèle client | Commande anonyme (nom + tél + structure au checkout) | Démarrage rapide, zéro friction d'inscription |
| Prix | Tout sur devis, jamais affiché | Flexibilité tarifaire totale |
| Stock | Pas de gestion, confirmé au devis | Simplicité, cohérent avec le modèle devis |
| Notifications | Backend enregistre + lien WhatsApp client | Aucune demande perdue, coût zéro |
| Catalogue | 50–300 produits, catégorisé | Adapté au démarrage et à la croissance |
| Stack | Next.js 15 + PostgreSQL | SEO natif, robustesse, hébergement gratuit |
| Features B2C | Supprimées (RDV, ordonnances, horaires actifs) | Site net, code simple, message ciblé |
| Approche d'exécution | Big Bang propre + livraison par phases verticales | Code propre, chaque phase déployable |

---

## 3. Stack technique

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix, accessible)
- **PostgreSQL** managé (Neon, free tier)
- **Drizzle ORM**
- **Vercel Blob** pour images produits
- **Resend** pour emails (notification admin, confirmation client — bonus)
- **better-auth** (ou NextAuth v5) pour l'auth admin
- **Zod** pour la validation
- **@upstash/ratelimit** pour le rate limiting
- **Sonner** pour les toasts
- Déploiement **Vercel**

Nouveau projet dans `/Users/mac/Documents/site web/toutpharma-v2/` (l'ancien `toutpharma/` et
`toutpharma-backend/` restent intacts comme référence pendant la migration).

### Arborescence

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Accueil
│   │   ├── catalogue/            # Liste + filtre catégorie
│   │   ├── produit/[slug]/       # Fiche produit
│   │   ├── panier/               # Panier de demande
│   │   ├── commander/            # Checkout + confirmation/[orderNumber]
│   │   ├── a-propos/             # Vitrine
│   │   └── contact/
│   ├── admin/
│   │   ├── login/
│   │   ├── produits/
│   │   ├── categories/
│   │   ├── demandes/
│   │   └── parametres/
│   └── api/
├── components/{ui,catalogue,panier,admin}/
├── lib/{db,auth.ts,whatsapp.ts,validators.ts}
└── server/actions/
```

---

## 4. Modèle de données (PostgreSQL / Drizzle)

**categories** : id (uuid pk), name (unique), slug (unique), icon, display_order (int)

**products** : id (uuid pk), name, slug (unique), description, category_id (fk),
image_urls (jsonb, array), unit, reference, is_active (bool), is_featured (bool),
created_at, updated_at

**quote_requests** : id (uuid pk), order_number (unique, format `TP-YYYY-NNNNN`),
client_name, client_phone, client_structure, client_structure_type, client_city,
client_email (optionnel), client_notes, items (jsonb snapshot),
status (enum: received | contacted | quoted | confirmed | delivered | cancelled),
admin_notes, created_at, updated_at

**admin_users** : id (uuid pk), email (unique), password_hash (bcrypt), name, created_at

**sessions** : géré par better-auth

**audit_log** : id, admin_user_id, action, target, created_at (actions admin sensibles)

---

## 5. Sécurité

| Couche | Mesure |
|---|---|
| Auth admin | bcrypt, sessions HttpOnly cookies, expiration 7j, multi-admins possible |
| Secrets | `.env.local` (non commit), validation Zod au boot |
| Validation | Zod sur toutes API routes / server actions |
| Rate limiting | `@upstash/ratelimit` sur création de demande (5/min/IP) |
| CSRF | Server actions Next.js protégées par défaut |
| XSS | Pas de `dangerouslySetInnerHTML` sur contenu user |
| Upload | Whitelist mime, max 5 Mo |
| HTTPS | Forcé par Vercel |
| Logs | Vercel logs + table `audit_log` |

---

## 6. Pages publiques

**Accueil** — Hero B2B, 3 catégories phares, produits à la une, bandeau confiance, section
"Comment ça marche" (3 étapes), CTAs catalogue + devis.

**Catalogue** — Sidebar catégories + recherche nom, grille produits (photo, nom, catégorie, unité,
bouton "Ajouter au devis"), pagination 12/page, état vide propre, filtres en drawer sur mobile.

**Fiche produit** — Galerie photos, description, unité, référence, sélecteur quantité, "Ajouter au
devis", bandeau "Prix et disponibilité sous 24h", produits liés.

**Panier (demande de devis)** — Liste produits (image, nom, quantité éditable, supprimer), aucun
prix ni total, champ note libre (max 500 car), bouton "Passer au formulaire de devis".

**Checkout `/commander`** — Formulaire : nom contact (requis), téléphone (requis, format SN validé),
type de structure (Pharmacie/Hôpital/Clinique/Autre), nom structure (requis), ville (select),
email (optionnel). Récap + "Envoyer la demande".

**Confirmation `/commander/confirmation/[orderNumber]`** — "Demande TP-2026-00042 enregistrée",
bouton "Envoyer aussi sur WhatsApp" (wa.me pré-rempli), récap, "Recontacté sous 24h".

**À propos** — Présentation, histoire, valeurs, photo, engagements qualité.

**Contact** — Adresse, téléphone, WhatsApp, email, carte, horaires, formulaire libre.

---

## 7. Flow de demande de devis

```
Client clique "Envoyer la demande"
  → [Server Action]
      1. Valide (Zod)
      2. Génère order_number (TP-YYYY-NNNNN)
      3. INSERT quote_requests (status='received')
      4. Compose message WhatsApp
      5. (Optionnel) Email admin via Resend
  → Redirige /commander/confirmation/[orderNumber]
  → Page confirmation : récap + bouton "Envoyer sur WhatsApp" (wa.me)
```

**Invariant clé :** la demande est persistée en base AVANT l'étape WhatsApp. Une demande n'est
jamais perdue même si le client n'envoie pas le message WhatsApp.

**Format message WhatsApp** (vers 221781669777) : en-tête (n°, date), bloc client (contact, tél,
structure, ville), liste produits (numéro, nom, quantité), note éventuelle, demande de confirmation
disponibilité/prix/délais.

---

## 8. Admin back-office

**Login** — email + mot de passe (bcrypt), session 7j.

**Dashboard** — cards (demandes jour/semaine/en attente, produits actifs), 5 dernières demandes,
graphique demandes/jour (30j).

**Demandes** (vue principale) — liste paginée tri date desc, filtres (statut, période, recherche
nom/tél/structure), détail en drawer/page : infos + items, édition statut, notes admin privées,
bouton "Ouvrir WhatsApp avec ce client", export PDF (optionnel).

**Produits** — tableau (miniature, nom, catégorie, statut, date), recherche/filtres, formulaire
(nom, slug auto, description, catégorie + création inline, unité, référence, upload multi-images
drag&drop, toggles actif/à la une), suppression soft (is_active=false).

**Catégories** — CRUD (nom, slug, icône, ordre), drag & drop réordonnancement.

**Paramètres** — numéro WhatsApp, email notification, textes À propos/Contact, horaires vitrine,
gestion des admins (ajout/retrait, changement mdp).

---

## 9. Identité visuelle

**Ton :** médical pro mais accessible (crédibilité + clarté + chaleur).

**Palette :** primaire teal `#0F766E`, accent orange `#EA580C`, neutres slate 50→900,
sémantiques success/warning/danger.

**Typo :** Inter (corps), Manrope ou Plus Jakarta Sans (titres) — via next/font.

**Composants :** shadcn/ui modifiés Tailwind (boutons, cards produit, inputs, toasts Sonner,
drawer/modal Radix).

**Responsive :** mobile-first, catalogue 1/2/3-4 colonnes, navbar hamburger mobile, panier drawer
desktop / plein écran mobile.

**Accessibilité :** contraste WCAG AA, labels inputs, focus visible, alt images, aria-labels,
navigation clavier complète.

---

## 10. SEO & performance

**SEO :** SSR/SSG par défaut, Metadata API par route (title, description, OG, Twitter),
Schema.org (Organization, Product, BreadcrumbList, LocalBusiness), sitemap XML auto, robots.txt,
URLs slug, canonical, 404/500 customisées.

**Performance :** next/image (WebP, lazy, responsive), next/font (zéro CLS), caching serveur avec
revalidation à la demande, streaming SSR catalogue, loading.tsx skeletons, objectif Lighthouse ≥ 95.

**Analytics :** Vercel Analytics + Plausible/Umami (sans cookies), tracking ajout panier /
soumission demande / clic WhatsApp.

---

## 11. Plan de livraison par phases

| Phase | Contenu | Livrable testable |
|---|---|---|
| 0 — Fondations | Setup Next.js+TS+Tailwind+Drizzle+shadcn+Vercel+Neon+auth admin de base | App tourne, login admin OK, DB connectée |
| 1 — Catalogue public | Schéma products/categories, accueil, catalogue, fiche produit, seed 10 produits | Visiteur parcourt le catalogue |
| 2 — Demande de devis | Panier (localStorage), checkout, server action, confirmation, WhatsApp | Visiteur envoie une demande complète |
| 3 — Admin produits | CRUD produits + catégories, upload images (Vercel Blob) | Gestion catalogue sans code |
| 4 — Admin demandes | Liste, détail, statut, notes, recherche/filtres | Gestion des demandes en autonomie |
| 5 — Vitrine | À propos, Contact, formulaire, paramètres éditables | Site complet niveau contenu |
| 6 — SEO & perf | Metadata, sitemap, schema.org, optim images, audit Lighthouse | Lighthouse ≥ 95 |
| 7 — Durcissement | Rate limiting, validation, logs, audit log, emails, pages erreur | Prêt prod |
| 8 — Mise en prod | Domaine, DNS, SSL, migration données, QA final | En ligne |

---

## 12. Hors-scope (volontaire)

Paiement en ligne, comptes clients, gestion stock numérique, app mobile native, multi-langues.
Génération PDF de devis : optionnelle, ajoutable en phase 4+ si demande forte.

---

## 13. Coûts mensuels estimés

Vercel Hobby, Neon free, Vercel Blob, Resend free : **0 FCFA**. Domaine ~6 000 FCFA/an.
WhatsApp via wa.me : 0 FCFA. **Total ≈ 500 FCFA/mois** (domaine amorti). Scalable vers Vercel Pro
(~20 $/mois) si le trafic l'exige.
