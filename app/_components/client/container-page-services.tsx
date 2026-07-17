"use client"

import { Profissional, Servico } from "@prisma/client";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { getProfessional } from "@/app/_actions/get-professionals";
import { toast } from "sonner";
import { SmartphoneIcon } from "lucide-react";
import { Button } from "../ui/button";
import { getServices } from "@/app/_actions/get-service";
import ServiceItem from "./service-item";

interface ContainerPageServicesProps {
    id: string
}

const ContainerPageServices = ({id}: ContainerPageServicesProps) => {
    const [services, setServices] = useState<Servico[]>([])
    const [professional, setProfessional] = useState<Profissional>()

    const fetchServices = async () => {
        const listServices = await getServices(id)
        setServices(listServices as unknown as Servico[])
    }

    const fetchProfessional = async () => {
        const resp = await getProfessional(id)
        setProfessional(resp!)
    }

    useEffect(() => {
        fetchServices()
        fetchProfessional()
    }, [])

    const handleCopyPhoneClick = () => {
        navigator.clipboard.writeText(professional?.telefone!)
        toast.success("Telefone copiado com sucesso!", {
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        },)
    }

    return (
        <div className="p-5">
            
            {/*Card Informaçõs do profissional */}
            <div className="flex flex-col gap-3 w-full mb-3 pb-3 border-b border-gray-300">
                <div className="flex gap-2 items-center">
                    <Avatar size="lg">
                        <AvatarImage src={professional?.imgURL!} className="object-top"/>
                    </Avatar>
                    <div>
                        <h3 className="font-bold">{professional?.nome}</h3>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className='flex items-center gap-2'>
                        <SmartphoneIcon/>
                        <p className='text-sm'>{professional?.telefone}</p>
                    </div>
                    <Button onClick={handleCopyPhoneClick} variant='destructive' size='sm'>Copiar</Button>
                </div>

            </div>
            
            {/*Serviços */}
            {services.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase">
                        Serviços
                    </h2>
                    <div className="space-y-3">
                        {services.map((service) => (
                            <ServiceItem key={service.id} service={service}/>
                        ))}
                    </div>
                </>
            ) : (
                <h2>Não existe serviços</h2>
            )}

        </div>
    );
}
 
export default ContainerPageServices;