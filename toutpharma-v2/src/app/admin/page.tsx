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
