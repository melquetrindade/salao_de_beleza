import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import { MenuIcon } from "lucide-react";
import SiderbarSheetAdmin from "@/app/_components/siderbar-sheet-admin";
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  return (
    <div>
      <Card className="rounded-none ring-0 bg-secondary"> 
        <CardContent className="flex flex-row items-center justify-between">
          <Image alt="Logo Salão de beleza" src="/logo.png" height={8} width={120}/>

          <Sheet>
            <SheetTrigger>
              <Button size="icon" variant='outline'>
                <MenuIcon/>
              </Button>
            </SheetTrigger>

            <SiderbarSheetAdmin/>
          </Sheet>
        </CardContent>
      </Card>

      {/*Mensagem de boas-vindas */}
      <div className="p-2">
        <h2 className="text-xl font-bold">Olá, {session?.user ? session.user.name : 'bem-vindo'}!</h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", {locale: ptBR})}
          </span>
          {" "}de{" "}
          <span className="capitalize">
            {format(new Date(), "MMMM", {locale: ptBR})}
          </span>
          </p>
      </div>
    </div>
  );
}
