import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import SiderbarSheetClient from "./_components/client/siderbar-sheet-client";
import Header from "./_components/client/header";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <Header/>

      {/*Mensagem de boas-vindas */}
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "bem-vindo"}!
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>{" "}
          de{" "}
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>
      </div>
    </div>
  );
}
