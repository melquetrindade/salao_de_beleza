import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ServicePageProps{
    params: Promise<{
        id: string
    }>
}

const ServicePage = async ({params}: ServicePageProps) => {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
        redirect("/admin");
    }

    const { id } = await params;

    return (
        <h1>O ID do profissional é {id}</h1>
    );
}
 
export default ServicePage;
