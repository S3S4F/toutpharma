import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixe la racine du workspace : plusieurs lockfiles existent en dehors du
  // projet (ex. ~/pnpm-lock.yaml), ce qui faisait inférer une mauvaise racine
  // à Turbopack. On force la racine sur ce dossier.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
