import ContainerPageServices from "@/app/_components/client/container-page-services";
import Header from "@/app/_components/client/header";

interface ServicesPageProps{
    params: Promise<{
        id: string
    }>
}

const ServicePage = async ({params}: ServicesPageProps) => {
    const { id } = await params;

    return (
        <div>
            <Header/>

            <ContainerPageServices id={id}/>
        </div>
        
    );
}
 
export default ServicePage;