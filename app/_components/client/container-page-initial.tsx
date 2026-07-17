"use client"

import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { Barbearia, Profissional } from "@prisma/client";
import { getBarbearia } from "@/app/_actions/get-barbearia";
import { getProfessionals } from "@/app/_actions/get-professionals";
import ProfessionalItem from "./professional-item";

const ContainerPageInitial = () => {
    const [barbearia, setBarbearia] = useState<Barbearia>()
    const [professionals, setProfessionals] = useState<Profissional[]>([])

    const fetchBarbearia = async () => {
        const resp = await getBarbearia()
        setBarbearia(resp!)
    }

    const fetchProfessionals = async () => {
        const listProfessionals = await getProfessionals()
        setProfessionals(listProfessionals)
    }

    useEffect(() => {
        fetchBarbearia()
        fetchProfessionals()
    }, [])

    return (
        <div className="p-5">
            <div className="h-[180px] w-full flex justify-center mt-3">
                <div className="relative flex h-full w-full items-end">
                    <Image
                        alt={'Foto da barbearia'}
                        src={barbearia?.imgURL!}
                        fill
                        className="rounded-xl object-cover"
                    />

                    <Card className="z-50 mx-5 mb-3 w-full rounded-xl bg-secondary">
                        <CardContent className="flex items-center gap-3 px-5">
                            <div>
                                <h3 className="font-bold">{barbearia?.nome}</h3>
                                <p className="text-xs">{barbearia?.endereco}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {professionals.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase">
                        Profissionais
                    </h2>
                    <div className="flex gap-4 overflow-auto mb-10 [&::-webkit-scrollbar]:hidden">
                    {
                        professionals.map((professional) => <ProfessionalItem key={professional.id} professional={professional}/>)
                    }
                    </div>
                </>
                 
            ) : (
                <h2>Este salão de beleza ainda não possui profissionais</h2>
            )}
        </div>
        
        
    );
}
 
export default ContainerPageInitial;