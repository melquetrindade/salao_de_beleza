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

{/* <h3>Cadastrar profissional</h3>
            <div className="w-[20px] h-[40px]">
                <Image alt="melque" src="https://glorious-sapphire-jnquc9mg.edgeone.dev/MAR_3338.jpg" width={20} height={40} priority/>
            </div> */}