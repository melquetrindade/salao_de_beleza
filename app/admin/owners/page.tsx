import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import Header from "@/app/_components/admin/header";
import ListAdmin from "@/app/_components/admin/list-admin";

export default async function OwnersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  // Apenas administradores com role = "OWNER" podem acessar
  if (session.user.adminRole !== "OWNER") {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <Header />
      <ListAdmin/>
    </div>
  );
}
