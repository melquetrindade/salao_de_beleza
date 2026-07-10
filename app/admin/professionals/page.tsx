import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Header from "@/app/_components/admin/header";

const Profissionais = async () => {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
        redirect("/admin");
    }

    return (
        <div>
            <Header/>
            <h3>Cadastrar profissional</h3>
        </div>
    );
}
 
export default Profissionais;