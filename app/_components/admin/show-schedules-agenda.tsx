"use client"

import { ClockIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Prisma } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { blockTime, unlockTime } from "@/app/_actions/handle-time";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type DisponibilidadeComAgendamentos = Prisma.DisponibilidadeGetPayload<{
  include: {
    agendamentos: {
      include: {
        usuario: {
          select: {
            id: true;
            name: true;
            telefone: true;
            email: true
          };
        };
      };
    };
  };
}>;

interface ShowSchedulesAgendaProps {
    selectedDay: Date | undefined
    setDisponibilidade: Dispatch<SetStateAction<DisponibilidadeComAgendamentos[]>>
    disponibilidade: DisponibilidadeComAgendamentos[]
}

const ShowSchedulesAgenda = ({selectedDay, disponibilidade, setDisponibilidade}: ShowSchedulesAgendaProps) => {
    const [selectedSlot, setSelectedSlot] = useState<DisponibilidadeComAgendamentos | null>(null);

    const titleDialog = (slot: DisponibilidadeComAgendamentos) => {
        if(slot.status === "RESERVADO"){
            return 'Informação do Cliente'
        } else if (slot.status === "BLOQUEADO"){
            return 'Desbloquear horário'
        } return 'Bloquear horário'
    }

    const descriptionDialog = (slot: DisponibilidadeComAgendamentos) => {
        if(slot.status === "RESERVADO"){
            return <div className="p-4 flex flex-col items-start">
                <p><span className="font-semibold">Nome: </span>{slot.agendamentos[0]?.usuario?.name}</p>
                <p><span className="font-semibold">Telefone: </span>{slot.agendamentos[0]?.usuario?.telefone}</p>
                <p><span className="font-semibold">E-mail: </span>{slot.agendamentos[0]?.usuario?.email}</p>
            </div>
        }
        else if(slot.status === "LIVRE"){
            return <p>Ao bloquear, seus clientes não poderão reservar este horário. Você pode desbloquear a qualquer momento!</p>
        }
        return <p>Ao desbloquear, seus clientes poderão reservar este horário. Você pode bloquear a qualquer momento!</p>
    }

    const labelButton = (slot: DisponibilidadeComAgendamentos) => {
        if(slot.status === "RESERVADO"){
            return 'Copiar telefone'
        } else if (slot.status === "BLOQUEADO"){
            return 'Desbloquear'
        } return 'Bloquear'
    }

    const handleBlock = async (slot: DisponibilidadeComAgendamentos) => {
        try{
            const upTime = await blockTime(slot.id, slot.profissionalId)
            setDisponibilidade((old) =>
                old.map((d) => (d.id === slot.id ? { ...d, status: upTime.status as any } : d)),
            );

            setSelectedSlot(null);
            toast.success("Horário bloqueado com sucesso!", {
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        } catch (error){
            if (error instanceof Error) {
                toast.error(error.message, {
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Erro ao bloquear horário.");
            }
        }
    }

    const handleUnlock = async (slot: DisponibilidadeComAgendamentos) => {
        try{
            const upTime = await unlockTime(slot.id, slot.profissionalId)
            setDisponibilidade((old) =>
                old.map((d) => (d.id === slot.id ? { ...d, status: upTime.status as any } : d)),
            );

            setSelectedSlot(null);
            toast.success("Horário desbloqueado com sucesso!", {
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        } catch (error){
            if (error instanceof Error) {
                toast.error(error.message, {
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Erro ao desbloquear horário.");
            }
        }
    }

    const copyPhone = () => {
        console.log('Copia telefone')
    }

    return (
        <div className="px-5 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold mb-3">
                Horários disponíveis em {format(selectedDay!, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <Card className="ring-0 border-secondary">
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {disponibilidade.map((slot) => (
                            <Dialog 
                                key={slot.id} 
                                open={selectedSlot?.id === slot.id} 
                                onOpenChange={(open) => {
                                    if (!open) setSelectedSlot(null);
                                    }}
                                >
                                <DialogTrigger onClick={() => setSelectedSlot(slot)}>
                                    <div
                                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${slot.status === "LIVRE" ? 'bg-green-400/80' : slot.status === "RESERVADO" ?'bg-primary/50' : 'bg-gray-400'}`}
                                    >
                                        <ClockIcon size={14} className="text-white" />
                                        <span className="text-white">
                                            {format(slot.horaInicio, "HH:mm")} - {format(slot.horaFim, "HH:mm")}
                                        </span>
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="w-[90%] text-center">
                                    <DialogHeader>
                                        <DialogTitle>{titleDialog(slot)}</DialogTitle>
                                        
                                        <DialogDescription>
                                            {descriptionDialog(slot)}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Button className="gap-2 font-bold" onClick={slot.status === "RESERVADO" ? () => copyPhone() : slot.status === "BLOQUEADO" ? () => handleUnlock(slot) : () => handleBlock(slot)}>
                                        {labelButton(slot)}
                                    </Button>
                                </DialogContent>
                            </Dialog>
                            
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
 
export default ShowSchedulesAgenda;