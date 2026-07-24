"use client"

import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { Barbearia, Profissional, Prisma } from "@prisma/client";
import { getBarbearia } from "@/app/_actions/get-barbearia";
import { getProfessionals } from "@/app/_actions/get-professionals";
import ProfessionalItem from "./professional-item";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { getAgendamentosConfirmad } from "@/app/_actions/get-agendamentos-confirmad";
import AgendamentoItem from "./agendamentos-item";

type AgendamentoComIncludes = Prisma.AgendamentoGetPayload<{
    include: {
        servico: true,
        disponibilidade: {
            include: {
                profissional: true,
            },
        },
    },
}>

const ContainerPageInitial = () => {
    const {data} = useSession()
    const [barbearia, setBarbearia] = useState<Barbearia>()
    const [professionals, setProfessionals] = useState<Profissional[]>([])
    const [agendamentos, setAgendamentos] = useState<AgendamentoComIncludes[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingAgendamentos, setLoadingAgendamentos] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            const [barbeariaData, professionalsData] = await Promise.all([
                getBarbearia(),
                getProfessionals(),
            ])
            setBarbearia(barbeariaData!)
            setProfessionals(professionalsData)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchAgendamentos = async () => {
        try{
            setLoadingAgendamentos(true)
            const agendamentosConfirmad = await getAgendamentosConfirmad()
            setAgendamentos(agendamentosConfirmad)
        } finally {
            setLoadingAgendamentos(false)
        }
    }

    useEffect(() => {
        if(data?.user?.id){
            fetchAgendamentos()
        }
    },[data?.user?.id])

    return (
        <div className="p-5">
            {/* Banner da barbearia */}
            <div className="h-45 w-full flex justify-center mt-3">
                {loading || !barbearia ? (
                    <Skeleton className="h-full w-full rounded-xl bg-gray-200" />
                ) : (
                    <div className="relative flex h-full w-full items-end">
                        <Image
                            alt={'Foto da barbearia'}
                            src={barbearia.imgURL!}
                            fill
                            className="rounded-xl object-cover"
                        />

                        <Card className="z-50 mx-5 mb-3 w-full rounded-xl bg-secondary">
                            <CardContent className="flex items-center gap-3 px-5">
                                <div>
                                    <h3 className="font-bold">{barbearia.nome}</h3>
                                    <p className="text-xs">{barbearia.endereco}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/*Agendamentos Confirmados */}
            {loadingAgendamentos ? (
                <p>Carregando...</p>
            ) : agendamentos.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
                        Agendamentos
                    </h2>
                    <div className="gap-3 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {agendamentos.map(agendamento => (
                            <AgendamentoItem key={agendamento.id} agendamento={agendamento}/>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Profissionais */}
            {loading ? (
                <>
                    <Skeleton className="mb-3 mt-6 h-4 w-24 uppercase bg-gray-200" />
                    <div className="flex gap-4 overflow-auto mb-10 [&::-webkit-scrollbar]:hidden">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 min-w-30">
                                <Skeleton className="h-25 w-25 rounded-full bg-gray-200" />
                                <Skeleton className="h-4 w-20 bg-gray-200" />
                                <Skeleton className="h-3 w-24 bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </>
            ) : professionals.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase">
                        Profissionais
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-10 ">
                    {
                        professionals.map((professional) => <ProfessionalItem key={professional.id} professional={professional}/>)
                    }
                    </div>
                </>
                 
            ) : (
                <h2 className="mt-6">Este salão de beleza ainda não possui profissionais</h2>
            )}
        </div>
        
        
    );
}
 
export default ContainerPageInitial;