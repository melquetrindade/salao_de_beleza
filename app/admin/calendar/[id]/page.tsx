import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import Header from "@/app/_components/admin/header";
import AgendaProfessional from "@/app/_components/admin/agenda-professional";

interface ServicePageProps{
    params: Promise<{
        id: string
    }>
}

export default async function Calendar({params}: ServicePageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  const { id } = await params;

  return (
    <div>
      <Header />
      <AgendaProfessional id={id}/>
    </div>
  );
}
