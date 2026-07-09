import { Button } from "../_components/ui/button";
import { Card, CardContent } from "../_components/ui/card"
import Image from "next/image"

const Admin = () => {
    return (
        <div className="w-full min-h-screen items-center flex justify-center bg-gray-200">
            <Card className="w-[80%]">
                <CardContent className="justify-center flex flex-col items-center">
                    <Image alt='logo' src="/logo2.png" height={18} width={120} />
                    <h1 className="font-bold text-xl text-primary mt-6 uppercase">Bem-vindo</h1>
                    <p className="font-semibold text-xs text-gray-400">Faça login para acessar a área administrativa</p>
                    <Button className="mt-6 gap-3">
                        <Image alt="logo_google" src="/google.svg" height={20} width={20} />
                        Google
                    </Button>
                </CardContent>
            </Card>
        </div>
        
    );
}
 
export default Admin;