import { Card, CardContent } from "../_components/ui/card";
import Image from "next/image";
import ButtonSignin from "../_components/admin/button-signin";

export default function Admin() {
  return (
    <div className="w-full min-h-screen items-center flex justify-center bg-primary">
      <Card className="w-[80%]">
        <CardContent className="justify-center flex flex-col items-center py-4">
          <Image
            alt="logo"
            src="/logo-copia.png"
            height={18}
            width={120}
            priority
            style={{ width: "auto", height: "auto" }}
          />

          <h1 className="font-bold text-xl text-primary mt-6 uppercase">
            Bem-vindo
          </h1>

          <p className="font-semibold text-xs text-primary">
            Faça login para acessar a área administrativa
          </p>

          <ButtonSignin />
        </CardContent>
      </Card>
    </div>
  );
}
