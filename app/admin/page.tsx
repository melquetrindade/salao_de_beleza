import { Card, CardContent } from "../_components/ui/card";
import Image from "next/image";
import ButtonSignin from "../_components/button-signin";


export default function Admin() {

  return (
    <div className="w-full min-h-screen items-center flex justify-center bg-gray-200">
      <Card className="w-[80%]">
        <CardContent className="justify-center flex flex-col items-center">
          <Image alt="logo" src="/logo2.png" height={18} width={120} />

          <h1 className="font-bold text-xl text-primary mt-6 uppercase">
            Bem-vindo
          </h1>

          <p className="font-semibold text-xs text-gray-400">
            Faça login para acessar a área administrativa
          </p>

          <ButtonSignin />
        </CardContent>
      </Card>
    </div>
  );
}