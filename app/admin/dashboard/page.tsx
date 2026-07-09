import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import ButtonLogout from "@/app/_components/button-logout";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin");
  }

  return (
    <div>
      Bem-vindo {session.user.name}
      <ButtonLogout/>
    </div>
  );
}