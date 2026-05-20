# ToutPharma v2 — Plan d'implémentation Phase 0 + Phase 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place les fondations techniques (Next.js 15 + TS + Tailwind + Drizzle + Neon + better-auth + Vercel) et livrer un catalogue public navigable (accueil, catalogue filtrable, fiche produit) avec données réelles.

**Architecture:** Application Next.js 15 (App Router) full-stack. Données dans PostgreSQL (Neon) via Drizzle ORM. Auth admin par better-auth (email/mot de passe, sessions cookies). Rendu serveur (SSR/SSG) pour le SEO. UI via Tailwind + shadcn/ui. Tests unitaires des fonctions pures via Vitest ; vérification visuelle des pages dans le navigateur.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL (Neon), Drizzle ORM, better-auth, Zod, Vitest, Vercel.

**Répertoire projet :** `/Users/mac/Documents/site web/toutpharma-v2/`
**Repo git :** déjà initialisé à `/Users/mac/Documents/site web/`

---

## Structure des fichiers (cible fin Phase 1)

```
toutpharma-v2/
├── .env.local                      # Secrets (non commit)
├── .env.example                    # Modèle des variables
├── drizzle.config.ts               # Config Drizzle Kit
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── components.json                 # Config shadcn
├── drizzle/                        # Migrations SQL générées
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, providers)
│   │   ├── globals.css
│   │   ├── (public)/
│   │   │   ├── layout.tsx          # Navbar + Footer
│   │   │   ├── page.tsx            # Accueil
│   │   │   ├── catalogue/page.tsx  # Liste + filtre + recherche
│   │   │   └── produit/[slug]/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx          # Garde de session
│   │   └── api/auth/[...all]/route.ts  # Handler better-auth
│   ├── components/
│   │   ├── ui/                     # Primitives shadcn
│   │   ├── layout/{Navbar,Footer}.tsx
│   │   └── catalogue/{ProductCard,CategoryFilter,SearchBar}.tsx
│   ├── lib/
│   │   ├── db/{index.ts,schema.ts,queries.ts}
│   │   ├── auth.ts                 # Instance better-auth (serveur)
│   │   ├── auth-client.ts          # Client better-auth
│   │   ├── slug.ts                 # Génération de slug
│   │   └── utils.ts                # cn() shadcn
│   └── scripts/seed.ts             # Données initiales
└── tests/
    └── lib/{slug.test.ts}
```

---

# PHASE 0 — FONDATIONS

### Task 0.1 : Scaffolder le projet Next.js 15

**Files:**
- Create: `toutpharma-v2/` (tout l'arbre via create-next-app)

- [ ] **Step 1: Créer le projet Next.js**

Run (depuis `/Users/mac/Documents/site web/`) :
```bash
npx create-next-app@latest toutpharma-v2 \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack --use-npm
```
Répondre `No` si on demande de personnaliser davantage. Attendu : dossier `toutpharma-v2/` créé.

- [ ] **Step 2: Vérifier que le projet démarre**

Run :
```bash
cd toutpharma-v2 && npm run dev
```
Attendu : serveur sur `http://localhost:3000`, page d'accueil Next.js par défaut visible. Arrêter avec Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "/Users/mac/Documents/site web"
git add toutpharma-v2 -f
git commit -m "chore: scaffold Next.js 15 project (toutpharma-v2)"
```
> Note : `-f` car le `.gitignore` racine ignore `node_modules/` (correct) ; le reste du projet doit être suivi.

---

### Task 0.2 : Installer les dépendances cœur

**Files:**
- Modify: `toutpharma-v2/package.json`

- [ ] **Step 1: Installer les libs runtime**

Run (depuis `toutpharma-v2/`) :
```bash
npm install drizzle-orm postgres better-auth zod lucide-react sonner clsx tailwind-merge class-variance-authority
```

- [ ] **Step 2: Installer les libs de dev**

```bash
npm install -D drizzle-kit vitest @vitejs/plugin-react dotenv tsx
```

- [ ] **Step 3: Vérifier l'installation**

Run : `npm ls drizzle-orm better-auth vitest`
Attendu : versions affichées sans erreur `UNMET`.

- [ ] **Step 4: Commit**

```bash
git add toutpharma-v2/package.json toutpharma-v2/package-lock.json
git commit -m "chore: add core dependencies (drizzle, better-auth, zod, vitest)"
```

---

### Task 0.3 : Configurer shadcn/ui

**Files:**
- Create: `toutpharma-v2/components.json`, `toutpharma-v2/src/lib/utils.ts`
- Modify: `toutpharma-v2/src/app/globals.css`, `toutpharma-v2/tailwind.config.ts`

- [ ] **Step 1: Initialiser shadcn**

Run (depuis `toutpharma-v2/`) :
```bash
npx shadcn@latest init -d
```
Attendu : `components.json` créé, `src/lib/utils.ts` avec `cn()`, variables CSS dans `globals.css`.

- [ ] **Step 2: Ajouter les composants de base nécessaires**

```bash
npx shadcn@latest add button card input label badge sonner skeleton sheet
```
Attendu : fichiers créés dans `src/components/ui/`.

- [ ] **Step 3: Vérifier le build**

Run : `npm run build`
Attendu : build réussit sans erreur TypeScript.

- [ ] **Step 4: Commit**

```bash
git add toutpharma-v2
git commit -m "chore: configure shadcn/ui and base components"
```

---

### Task 0.4 : Configurer Vitest

**Files:**
- Create: `toutpharma-v2/vitest.config.ts`
- Modify: `toutpharma-v2/package.json` (script `test`)

- [ ] **Step 1: Écrire la config Vitest**

Create `toutpharma-v2/vitest.config.ts` :
```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 2: Ajouter le script de test**

Modify `toutpharma-v2/package.json`, dans `"scripts"`, ajouter :
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Test de fumée**

Create `toutpharma-v2/tests/smoke.test.ts` :
```ts
import { expect, test } from "vitest";

test("vitest fonctionne", () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 4: Lancer le test**

Run : `npm test`
Attendu : `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add toutpharma-v2/vitest.config.ts toutpharma-v2/package.json toutpharma-v2/tests/smoke.test.ts
git commit -m "chore: configure Vitest with smoke test"
```

---

### Task 0.5 : Variables d'environnement et connexion Neon

**Files:**
- Create: `toutpharma-v2/.env.example`, `toutpharma-v2/.env.local`, `toutpharma-v2/src/lib/db/index.ts`

> **Prérequis manuel :** créer un projet sur https://neon.tech (gratuit), copier la chaîne de connexion `postgres://...`. Générer un secret : `openssl rand -base64 32`.

- [ ] **Step 1: Écrire le modèle d'env**

Create `toutpharma-v2/.env.example` :
```
DATABASE_URL=postgres://user:password@host/dbname?sslmode=require
BETTER_AUTH_SECRET=changeme-32-chars-min
BETTER_AUTH_URL=http://localhost:3000
```

- [ ] **Step 2: Créer le .env.local réel**

Create `toutpharma-v2/.env.local` (valeurs réelles Neon + secret généré). Vérifier qu'il est ignoré :
Run : `git check-ignore toutpharma-v2/.env.local`
Attendu : la ligne `.env.local` est retournée (donc ignoré).

- [ ] **Step 3: Écrire le client DB**

Create `toutpharma-v2/src/lib/db/index.ts` :
```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquant dans l'environnement");
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

- [ ] **Step 4: Commit**

```bash
git add toutpharma-v2/.env.example toutpharma-v2/src/lib/db/index.ts
git commit -m "chore: add env template and Drizzle db client"
```

---

### Task 0.6 : Schéma `admin_users` et configuration Drizzle Kit

**Files:**
- Create: `toutpharma-v2/src/lib/db/schema.ts`, `toutpharma-v2/drizzle.config.ts`

- [ ] **Step 1: Écrire le schéma initial (tables better-auth + admin)**

Create `toutpharma-v2/src/lib/db/schema.ts` :
```ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Tables requises par better-auth (email/password)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

- [ ] **Step 2: Écrire la config Drizzle Kit**

Create `toutpharma-v2/drizzle.config.ts` :
```ts
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

- [ ] **Step 3: Ajouter les scripts DB**

Modify `toutpharma-v2/package.json`, dans `"scripts"` :
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "dotenv -e .env.local -- drizzle-kit migrate",
"db:push": "dotenv -e .env.local -- drizzle-kit push"
```

- [ ] **Step 4: Pousser le schéma vers Neon**

Run : `npm run db:push`
Attendu : tables `user`, `session`, `account`, `verification` créées sur Neon (message de succès).

- [ ] **Step 5: Commit**

```bash
git add toutpharma-v2/src/lib/db/schema.ts toutpharma-v2/drizzle.config.ts toutpharma-v2/package.json
git commit -m "feat: add better-auth schema and Drizzle Kit config"
```

---

### Task 0.7 : Instance better-auth et handler API

**Files:**
- Create: `toutpharma-v2/src/lib/auth.ts`, `toutpharma-v2/src/lib/auth-client.ts`, `toutpharma-v2/src/app/api/auth/[...all]/route.ts`

- [ ] **Step 1: Écrire l'instance serveur better-auth**

Create `toutpharma-v2/src/lib/auth.ts` :
```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // pas d'inscription publique : admins créés via script
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
  },
});
```

- [ ] **Step 2: Écrire le client better-auth**

Create `toutpharma-v2/src/lib/auth-client.ts` :
```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const { signIn, signOut, useSession } = authClient;
```

- [ ] **Step 3: Écrire le handler API route**

Create `toutpharma-v2/src/app/api/auth/[...all]/route.ts` :
```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

- [ ] **Step 4: Ajouter la variable publique**

Modify `toutpharma-v2/.env.local` et `.env.example`, ajouter :
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 5: Vérifier que le handler répond**

Run : `npm run dev` puis dans un autre terminal :
```bash
curl -s http://localhost:3000/api/auth/ok
```
Attendu : réponse JSON de better-auth (ex : `{"ok":true}`). Arrêter le serveur.

- [ ] **Step 6: Commit**

```bash
git add toutpharma-v2/src/lib/auth.ts toutpharma-v2/src/lib/auth-client.ts "toutpharma-v2/src/app/api/auth/[...all]/route.ts" toutpharma-v2/.env.example
git commit -m "feat: configure better-auth server, client and API handler"
```

---

### Task 0.8 : Script de création d'un admin

**Files:**
- Create: `toutpharma-v2/src/scripts/create-admin.ts`
- Modify: `toutpharma-v2/package.json`

- [ ] **Step 1: Écrire le script**

Create `toutpharma-v2/src/scripts/create-admin.ts` :
```ts
import "dotenv/config";
import { auth } from "@/lib/auth";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] ?? "Admin";
  if (!email || !password) {
    console.error("Usage: tsx src/scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }
  await auth.api.signUpEmail({ body: { email, password, name } });
  console.log(`Admin créé : ${email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Ajouter le script npm**

Modify `toutpharma-v2/package.json`, dans `"scripts"` :
```json
"create-admin": "dotenv -e .env.local -- tsx src/scripts/create-admin.ts"
```
> Note : `signUpEmail` fonctionne même avec `disableSignUp` côté API publique, car appelé en interne. Si bloqué, retirer temporairement `disableSignUp`, créer l'admin, le remettre.

- [ ] **Step 3: Créer le premier admin**

Run : `npm run create-admin -- admin@toutpharma.sn "MotDePasseFort123!" "Propriétaire"`
Attendu : `Admin créé : admin@toutpharma.sn`. Vérifier sur Neon : 1 ligne dans `user` et `account`.

- [ ] **Step 4: Commit**

```bash
git add toutpharma-v2/src/scripts/create-admin.ts toutpharma-v2/package.json
git commit -m "feat: add create-admin script"
```

---

### Task 0.9 : Page de login admin

**Files:**
- Create: `toutpharma-v2/src/app/admin/login/page.tsx`, `toutpharma-v2/src/app/admin/layout.tsx`, `toutpharma-v2/src/app/admin/page.tsx`

- [ ] **Step 1: Écrire le layout admin (garde de session)**

Create `toutpharma-v2/src/app/admin/layout.tsx` :
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  // La page login est rendue hors de cette garde via un check côté composant
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
```
> Note : la redirection fine par route protégée est gérée Task 0.10 (middleware). Ici le layout enveloppe simplement l'admin.

- [ ] **Step 2: Écrire la page login**

Create `toutpharma-v2/src/app/admin/login/page.tsx` :
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="mb-6 text-xl font-bold text-teal-800">Administration ToutPharma</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Écrire une page admin d'accueil minimale**

Create `toutpharma-v2/src/app/admin/page.tsx` :
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminHome() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-2 text-slate-600">Connecté en tant que {session.user.email}</p>
    </div>
  );
}
```

- [ ] **Step 4: Vérifier le flux dans le navigateur**

Run : `npm run dev`. Ouvrir `http://localhost:3000/admin` → doit rediriger vers `/admin/login`. Se connecter avec l'admin créé → doit afficher le tableau de bord avec l'email. Tester un mauvais mot de passe → toast d'erreur.

- [ ] **Step 5: Commit**

```bash
git add toutpharma-v2/src/app/admin
git commit -m "feat: admin login page with session-guarded dashboard"
```

---

### Task 0.10 : Déploiement Vercel

**Files:**
- Create: `toutpharma-v2/.env.example` (déjà fait), aucune modif code

> **Prérequis manuel :** compte Vercel (gratuit), Vercel CLI : `npm i -g vercel`.

- [ ] **Step 1: Lier le projet à Vercel**

Run (depuis `toutpharma-v2/`) : `vercel link`
Suivre les prompts (créer un nouveau projet `toutpharma-v2`).

- [ ] **Step 2: Configurer les variables d'environnement sur Vercel**

Run, pour chaque variable (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`) :
```bash
vercel env add DATABASE_URL production
```
> Mettre `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` = l'URL Vercel de prod (connue après le 1er déploiement ; redéployer après mise à jour).

- [ ] **Step 3: Déployer**

Run : `vercel --prod`
Attendu : URL de prod retournée, page admin accessible (login fonctionne avec la même base Neon).

- [ ] **Step 4: Vérifier en prod**

Ouvrir `<url-vercel>/admin/login`, se connecter. Attendu : tableau de bord affiché.

- [ ] **Step 5: Commit (config locale Vercel)**

```bash
cd "/Users/mac/Documents/site web"
echo ".vercel" >> .gitignore
git add .gitignore
git commit -m "chore: ignore .vercel directory"
```

**FIN PHASE 0.** Livrable : app Next.js déployée, login admin fonctionnel, DB Neon connectée.

---

# PHASE 1 — CATALOGUE PUBLIC

### Task 1.1 : Schéma `categories` et `products`

**Files:**
- Modify: `toutpharma-v2/src/lib/db/schema.ts`

- [ ] **Step 1: Ajouter les tables au schéma**

Modify `toutpharma-v2/src/lib/db/schema.ts`, ajouter en fin de fichier :
```ts
import { pgTable, text, timestamp, boolean, integer, jsonb, uuid } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull().default("LayoutGrid"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  imageUrls: jsonb("image_urls").$type<string[]>().notNull().default([]),
  unit: text("unit").notNull().default(""),
  reference: text("reference").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
```
> Note : fusionner la ligne `import { pgTable, ... }` existante avec les nouveaux types (`integer`, `jsonb`, `uuid`) plutôt que dupliquer l'import.

- [ ] **Step 2: Pousser le schéma**

Run : `npm run db:push`
Attendu : tables `categories` et `products` créées sur Neon.

- [ ] **Step 3: Commit**

```bash
git add toutpharma-v2/src/lib/db/schema.ts
git commit -m "feat: add categories and products schema"
```

---

### Task 1.2 : Fonction de génération de slug (TDD)

**Files:**
- Create: `toutpharma-v2/src/lib/slug.ts`, `toutpharma-v2/tests/lib/slug.test.ts`

- [ ] **Step 1: Écrire le test qui échoue**

Create `toutpharma-v2/tests/lib/slug.test.ts` :
```ts
import { expect, test } from "vitest";
import { slugify } from "@/lib/slug";

test("met en minuscules et remplace espaces par tirets", () => {
  expect(slugify("Gants Nitrile")).toBe("gants-nitrile");
});

test("retire les accents", () => {
  expect(slugify("Désinfectant Hôpital")).toBe("desinfectant-hopital");
});

test("retire les caractères spéciaux", () => {
  expect(slugify("Seringue 5ml (stérile)")).toBe("seringue-5ml-sterile");
});

test("évite les tirets multiples et en bordure", () => {
  expect(slugify("  Masque  --  FFP2  ")).toBe("masque-ffp2");
});
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run : `npm test -- slug`
Attendu : FAIL — `slugify` non défini.

- [ ] **Step 3: Implémenter**

Create `toutpharma-v2/src/lib/slug.ts` :
```ts
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 4: Lancer le test (succès attendu)**

Run : `npm test -- slug`
Attendu : 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add toutpharma-v2/src/lib/slug.ts toutpharma-v2/tests/lib/slug.test.ts
git commit -m "feat: add slugify utility with tests"
```

---

### Task 1.3 : Requêtes catalogue

**Files:**
- Create: `toutpharma-v2/src/lib/db/queries.ts`

- [ ] **Step 1: Écrire les fonctions de requête**

Create `toutpharma-v2/src/lib/db/queries.ts` :
```ts
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "./index";
import { categories, products, type Category, type Product } from "./schema";

export async function getActiveCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(categories.displayOrder, categories.name);
}

export async function getProducts(opts: { categorySlug?: string; search?: string } = {}): Promise<Product[]> {
  const conditions = [eq(products.isActive, true)];
  if (opts.categorySlug) {
    const cat = await db.select().from(categories).where(eq(categories.slug, opts.categorySlug)).limit(1);
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
  }
  if (opts.search) {
    conditions.push(ilike(products.name, `%${opts.search}%`));
  }
  return db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, limit = 4): Promise<Product[]> {
  if (!categoryId) return [];
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.categoryId, categoryId)))
    .limit(limit + 1)
    .then((rows) => rows.filter((p) => p.id !== excludeId).slice(0, limit));
}
```

- [ ] **Step 2: Vérifier la compilation**

Run : `cd toutpharma-v2 && npx tsc --noEmit`
Attendu : aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add toutpharma-v2/src/lib/db/queries.ts
git commit -m "feat: add catalogue query functions"
```

---

### Task 1.4 : Script de seed (données initiales)

**Files:**
- Create: `toutpharma-v2/src/scripts/seed.ts`
- Modify: `toutpharma-v2/package.json`

- [ ] **Step 1: Écrire le script de seed**

Create `toutpharma-v2/src/scripts/seed.ts` :
```ts
import "dotenv/config";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

const CATEGORIES = [
  { name: "Gants & Protection", icon: "HandMetal", order: 1 },
  { name: "Seringues & Aiguilles", icon: "Syringe", order: 2 },
  { name: "Pansements & Bandages", icon: "Bandage", order: 3 },
  { name: "Désinfection & Hygiène", icon: "Droplets", order: 4 },
  { name: "Matériel médical", icon: "Stethoscope", order: 5 },
];

const PRODUCTS = [
  { cat: "Gants & Protection", name: "Gants nitrile non poudrés (taille M)", unit: "Boîte de 100", desc: "Gants d'examen en nitrile, sans latex, non poudrés." },
  { cat: "Gants & Protection", name: "Masques chirurgicaux 3 plis", unit: "Boîte de 50", desc: "Masques type IIR, élastiques auriculaires." },
  { cat: "Seringues & Aiguilles", name: "Seringue 5ml stérile", unit: "Carton de 100", desc: "Seringue à usage unique, stérile, embout Luer." },
  { cat: "Seringues & Aiguilles", name: "Aiguilles 21G", unit: "Boîte de 100", desc: "Aiguilles hypodermiques stériles 21G." },
  { cat: "Pansements & Bandages", name: "Compresses stériles 10x10", unit: "Boîte de 100", desc: "Compresses de gaze stériles, 10x10 cm." },
  { cat: "Pansements & Bandages", name: "Bande de crêpe 10cm", unit: "Lot de 12", desc: "Bande de maintien élastique, 10 cm x 4 m." },
  { cat: "Désinfection & Hygiène", name: "Solution hydroalcoolique 500ml", unit: "Flacon", desc: "Gel désinfectant pour les mains, 70% alcool." },
  { cat: "Désinfection & Hygiène", name: "Alcool à 70° 1L", unit: "Bidon", desc: "Alcool modifié pour désinfection de surfaces." },
  { cat: "Matériel médical", name: "Thermomètre infrarouge frontal", unit: "Unité", desc: "Mesure sans contact, affichage digital." },
  { cat: "Matériel médical", name: "Tensiomètre électronique brassard", unit: "Unité", desc: "Tensiomètre automatique au bras, écran LCD." },
];

async function main() {
  const catMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const [row] = await db
      .insert(categories)
      .values({ name: c.name, slug: slugify(c.name), icon: c.icon, displayOrder: c.order })
      .onConflictDoNothing()
      .returning();
    if (row) catMap.set(c.name, row.id);
  }
  // Récupérer les ids (au cas où certains existaient déjà)
  const allCats = await db.select().from(categories);
  for (const c of allCats) catMap.set(c.name, c.id);

  for (const p of PRODUCTS) {
    await db
      .insert(products)
      .values({
        name: p.name,
        slug: slugify(p.name),
        description: p.desc,
        categoryId: catMap.get(p.cat) ?? null,
        unit: p.unit,
        imageUrls: [],
        isActive: true,
        isFeatured: PRODUCTS.indexOf(p) < 4,
      })
      .onConflictDoNothing();
  }
  console.log(`Seed terminé : ${CATEGORIES.length} catégories, ${PRODUCTS.length} produits.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Ajouter le script npm**

Modify `toutpharma-v2/package.json`, dans `"scripts"` :
```json
"db:seed": "dotenv -e .env.local -- tsx src/scripts/seed.ts"
```

- [ ] **Step 3: Lancer le seed**

Run : `npm run db:seed`
Attendu : `Seed terminé : 5 catégories, 10 produits.`

- [ ] **Step 4: Commit**

```bash
git add toutpharma-v2/src/scripts/seed.ts toutpharma-v2/package.json
git commit -m "feat: add catalogue seed script with initial data"
```

---

### Task 1.5 : Layout public (Navbar + Footer)

**Files:**
- Create: `toutpharma-v2/src/components/layout/Navbar.tsx`, `toutpharma-v2/src/components/layout/Footer.tsx`, `toutpharma-v2/src/app/(public)/layout.tsx`

- [ ] **Step 1: Écrire la Navbar**

Create `toutpharma-v2/src/components/layout/Navbar.tsx` :
```tsx
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-teal-800">
          Tout<span className="text-orange-600">Pharma</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/catalogue" className="hover:text-teal-700">Catalogue</Link>
          <Link href="/a-propos" className="hover:text-teal-700">À propos</Link>
          <Link href="/contact" className="hover:text-teal-700">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Écrire le Footer**

Create `toutpharma-v2/src/components/layout/Footer.tsx` :
```tsx
export function Footer() {
  return (
    <footer className="mt-16 border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">
        <p className="font-bold text-teal-800">ToutPharma</p>
        <p className="mt-2">Fournisseur de consommables médicaux — Sénégal.</p>
        <p className="mt-4 text-xs text-slate-400">© {new Date().getFullYear()} ToutPharma. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Écrire le layout public**

Create `toutpharma-v2/src/app/(public)/layout.tsx` :
```tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Déplacer la home par défaut dans le groupe public**

Supprimer `toutpharma-v2/src/app/page.tsx` (home par défaut Next.js) — sera recréée Task 1.7 dans `(public)`.
Run : `rm toutpharma-v2/src/app/page.tsx`

- [ ] **Step 5: Commit**

```bash
git add toutpharma-v2/src/components/layout "toutpharma-v2/src/app/(public)/layout.tsx"
git rm toutpharma-v2/src/app/page.tsx
git commit -m "feat: add public layout with navbar and footer"
```

---

### Task 1.6 : Composant ProductCard

**Files:**
- Create: `toutpharma-v2/src/components/catalogue/ProductCard.tsx`

- [ ] **Step 1: Écrire le composant**

Create `toutpharma-v2/src/components/catalogue/ProductCard.tsx` :
```tsx
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/db/schema";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.imageUrls[0];
  return (
    <Link href={`/produit/${product.slug}`}>
      <Card className="group h-full overflow-hidden transition hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-slate-100">
          {cover ? (
            <Image src={cover} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">Pas d'image</div>
          )}
          {product.isFeatured && (
            <Badge className="absolute left-2 top-2 bg-orange-600">À la une</Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-teal-700">{product.name}</h3>
          {product.unit && <p className="mt-1 text-sm text-slate-500">{product.unit}</p>}
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Autoriser les domaines d'images distants**

Modify `toutpharma-v2/next.config.ts` :
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Vérifier la compilation**

Run : `cd toutpharma-v2 && npx tsc --noEmit`
Attendu : aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add toutpharma-v2/src/components/catalogue/ProductCard.tsx toutpharma-v2/next.config.ts
git commit -m "feat: add ProductCard component and image config"
```

---

### Task 1.7 : Page d'accueil

**Files:**
- Create: `toutpharma-v2/src/app/(public)/page.tsx`

- [ ] **Step 1: Écrire la page d'accueil (server component)**

Create `toutpharma-v2/src/app/(public)/page.tsx` :
```tsx
import Link from "next/link";
import { getFeaturedProducts, getActiveCategories } from "@/lib/db/queries";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "ToutPharma — Consommables médicaux pour pharmacies et hôpitaux au Sénégal",
  description:
    "Fournisseur de consommables médicaux : gants, seringues, pansements, désinfection, matériel médical. Demandez votre devis en ligne, réponse sous 24h.",
};

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(4), getActiveCategories()]);

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 to-orange-50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Votre fournisseur de <span className="text-teal-700">consommables médicaux</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Pharmacies, hôpitaux et cliniques : commandez vos consommables en quelques clics.
            Devis personnalisé sous 24h.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg"><Link href="/catalogue">Voir le catalogue</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/contact">Nous contacter</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-slate-900">Nos catégories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalogue?categorie=${c.slug}`}
              className="rounded-xl border bg-white p-6 text-center transition hover:border-teal-300 hover:shadow">
              <span className="font-medium text-slate-800">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">Produits à la une</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">Comment ça marche</h2>
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              ["1", "Choisissez", "Parcourez le catalogue et ajoutez vos produits à la demande de devis."],
              ["2", "Demandez", "Envoyez votre demande avec vos coordonnées en 1 minute."],
              ["3", "Recevez", "Nous vous recontactons sous 24h avec prix et disponibilité."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-lg font-bold text-white">{n}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Vérifier dans le navigateur**

Run : `npm run dev`. Ouvrir `http://localhost:3000`. Attendu : hero, 5 catégories, 4 produits à la une, section "Comment ça marche". Cliquer une catégorie → URL `/catalogue?categorie=...` (page créée Task 1.8).

- [ ] **Step 3: Commit**

```bash
git add "toutpharma-v2/src/app/(public)/page.tsx"
git commit -m "feat: add home page with hero, categories and featured products"
```

---

### Task 1.8 : Page catalogue avec filtre et recherche

**Files:**
- Create: `toutpharma-v2/src/app/(public)/catalogue/page.tsx`, `toutpharma-v2/src/components/catalogue/CategoryFilter.tsx`, `toutpharma-v2/src/components/catalogue/SearchBar.tsx`

- [ ] **Step 1: Écrire le filtre de catégories**

Create `toutpharma-v2/src/components/catalogue/CategoryFilter.tsx` :
```tsx
import Link from "next/link";
import type { Category } from "@/lib/db/schema";

export function CategoryFilter({ categories, active }: { categories: Category[]; active?: string }) {
  return (
    <nav className="space-y-1">
      <Link href="/catalogue"
        className={`block rounded-lg px-3 py-2 text-sm ${!active ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
        Tous les produits
      </Link>
      {categories.map((c) => (
        <Link key={c.id} href={`/catalogue?categorie=${c.slug}`}
          className={`block rounded-lg px-3 py-2 text-sm ${active === c.slug ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Écrire la barre de recherche**

Create `toutpharma-v2/src/components/catalogue/SearchBar.tsx` :
```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (value) next.set("q", value);
    else next.delete("q");
    router.push(`/catalogue?${next.toString()}`);
  }

  return (
    <form onSubmit={submit}>
      <Input placeholder="Rechercher un produit..." value={value} onChange={(e) => setValue(e.target.value)} />
    </form>
  );
}
```

- [ ] **Step 3: Écrire la page catalogue**

Create `toutpharma-v2/src/app/(public)/catalogue/page.tsx` :
```tsx
import { getProducts, getActiveCategories } from "@/lib/db/queries";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { CategoryFilter } from "@/components/catalogue/CategoryFilter";
import { SearchBar } from "@/components/catalogue/SearchBar";
import { Suspense } from "react";

export const metadata = {
  title: "Catalogue — ToutPharma",
  description: "Parcourez notre catalogue de consommables médicaux : gants, seringues, pansements, désinfection, matériel.",
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { categorie, q } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: categorie, search: q }),
    getActiveCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Catalogue</h1>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <Suspense><SearchBar /></Suspense>
          <CategoryFilter categories={categories} active={categorie} />
        </aside>
        <div>
          {products.length === 0 ? (
            <p className="py-20 text-center text-slate-500">Aucun produit trouvé.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Vérifier dans le navigateur**

Run : `npm run dev`. Ouvrir `/catalogue` → 10 produits. Cliquer une catégorie → filtré. Taper une recherche (ex "gants") → résultats filtrés. Recherche sans résultat → "Aucun produit trouvé".

- [ ] **Step 5: Commit**

```bash
git add "toutpharma-v2/src/app/(public)/catalogue" toutpharma-v2/src/components/catalogue/CategoryFilter.tsx toutpharma-v2/src/components/catalogue/SearchBar.tsx
git commit -m "feat: add catalogue page with category filter and search"
```

---

### Task 1.9 : Page fiche produit

**Files:**
- Create: `toutpharma-v2/src/app/(public)/produit/[slug]/page.tsx`

- [ ] **Step 1: Écrire la page fiche produit**

Create `toutpharma-v2/src/app/(public)/produit/[slug]/page.tsx` :
```tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/queries";
import { ProductCard } from "@/components/catalogue/ProductCard";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable — ToutPharma" };
  return {
    title: `${product.name} — ToutPharma`,
    description: product.description || `${product.name} disponible chez ToutPharma. Demandez votre devis.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const cover = product.imageUrls[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {cover ? (
            <Image src={cover} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">Pas d'image</div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          {product.unit && <p className="mt-2 text-slate-500">Conditionnement : {product.unit}</p>}
          {product.reference && <p className="text-sm text-slate-400">Réf. {product.reference}</p>}
          <p className="mt-6 whitespace-pre-line text-slate-700">{product.description}</p>
          <div className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
            Prix et disponibilité communiqués sous 24h après réception de votre demande de devis.
          </div>
          {/* Bouton "Ajouter au devis" : ajouté en Phase 2 */}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Produits similaires</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Vérifier dans le navigateur**

Run : `npm run dev`. Depuis `/catalogue`, cliquer un produit → fiche affichée (nom, unité, description, bandeau devis, produits similaires). Tester une URL inexistante `/produit/nimporte` → page 404.

- [ ] **Step 3: Commit**

```bash
git add "toutpharma-v2/src/app/(public)/produit"
git commit -m "feat: add product detail page with related products"
```

---

### Task 1.10 : Déploiement Phase 1 et vérification finale

- [ ] **Step 1: Build local**

Run : `cd toutpharma-v2 && npm run build`
Attendu : build réussit, pages `(public)` listées en statique/dynamique.

- [ ] **Step 2: Lancer les tests**

Run : `npm test`
Attendu : tous les tests PASS (smoke + slug).

- [ ] **Step 3: Déployer**

Run : `vercel --prod`
Attendu : URL prod. Ouvrir → accueil, catalogue, fiche produit fonctionnels avec les données seed.

- [ ] **Step 4: Vérifier le SEO de base**

Ouvrir le code source de la page d'accueil en prod (clic droit → afficher source). Attendu : `<title>` et `<meta name="description">` présents dans le HTML serveur (pas vides).

**FIN PHASE 1.** Livrable : site public déployé, catalogue navigable, filtrable, recherchable, fiches produits avec SEO de base.

---

## Auto-revue (couverture spec Phase 0–1)

- **Stack fondations** (spec §3) → Tasks 0.1–0.4 ✓
- **Sécurité auth admin bcrypt + sessions** (spec §5) → better-auth Tasks 0.6–0.9 ✓
- **Variables env non commit** (spec §5) → Task 0.5 ✓
- **Schéma categories/products** (spec §4) → Task 1.1 ✓
- **URLs slug** (spec §10) → Task 1.2 + slugs en seed/queries ✓
- **Accueil** (spec §6) → Task 1.7 ✓
- **Catalogue filtre + recherche + état vide** (spec §6) → Task 1.8 ✓
- **Fiche produit + bandeau devis + produits liés** (spec §6) → Task 1.9 ✓
- **SSR + Metadata API + next/image** (spec §10) → Tasks 1.7–1.9, 1.6 ✓
- **Déploiement Vercel** (spec §11 Phase 0/1) → Tasks 0.10, 1.10 ✓

**Hors périmètre de ce plan** (phases ultérieures) : panier/checkout/WhatsApp (Phase 2), CRUD admin produits + upload (Phase 3), admin demandes (Phase 4), vitrine À propos/Contact (Phase 5), SEO avancé/sitemap/schema.org (Phase 6), durcissement/rate-limit (Phase 7), domaine prod (Phase 8).
