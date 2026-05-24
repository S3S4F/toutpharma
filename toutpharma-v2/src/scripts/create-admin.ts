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
