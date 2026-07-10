import { Button } from "@/app/_components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth";
import ButtonSigninLogout from "./_components/button-signIn-logout";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Olá, {session?.user ? session.user.name : "Visitante"}!</h1>
      <ButtonSigninLogout/>
    </div>
  )
}
