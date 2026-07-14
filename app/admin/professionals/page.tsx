import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Header from "@/app/_components/admin/header";
import ListProfessionals from "@/app/_components/admin/list-professionals";

const Profissionais = async () => {
    const session = await getServerSession(authOptions);
    
    
    if (!session || session.user.role !== "admin") {
        redirect("/admin");
    }

    return (
        <div>
            <Header/>

            <ListProfessionals/>
            
        </div>
    );
}
 
export default Profissionais;