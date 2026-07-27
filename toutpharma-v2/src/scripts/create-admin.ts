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

  // On crée l'utilisateur via le contexte serveur interne de better-auth,
  // sans passer par l'endpoint public signUpEmail (désactivé par disableSignUp).
  const ctx = await auth.$context;

  // Idempotence : ne rien faire si l'admin existe déjà.
  const existing = await ctx.internalAdapter.findUserByEmail(email);
  if (existing) {
    console.log(`Admin déjà existant : ${email}`);
    process.exit(0);
  }

  const hash = await ctx.password.hash(password);
  const newUser = await ctx.internalAdapter.createUser({
    email,
    name,
    emailVerified: false,
  });
  await ctx.internalAdapter.createAccount({
    userId: newUser.id,
    providerId: "credential",
    accountId: newUser.id,
    password: hash,
  });

  console.log(`Admin créé : ${email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
