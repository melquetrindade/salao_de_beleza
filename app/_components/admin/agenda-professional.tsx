"use client"

import { ptBR } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { getDisponibilidade } from "@/app/_actions/getDisponibilidade";
import { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { DisponibilidadeForm, disponibilidadeSchema } from "@/app/schema/disponibilidade-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDisponibilidade } from "@/app/_actions/createDisponibilidade";
import { toast } from "sonner";
import FormDialogAgenda from "./form-dialog-agenda";
import ShowSchedulesAgenda from "./show-schedules-agenda";

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

interface AgendaProfessionalProps {
    id: string
}

const AgendaProfessional = ({id}: AgendaProfessionalProps) => {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [disponibilidade, setDisponibilidade] = useState<DisponibilidadeComAgendamentos[]>([]);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }

    const form = useForm<DisponibilidadeForm>({
        resolver: zodResolver(disponibilidadeSchema),
        defaultValues: {
          horaInicio: "",
          horaFim: "",
          intervalo: 30,
        },
    });

    useEffect(() => {
        const fetchDisponibilidade = async () => {
            if (!selectedDay) {
                setDisponibilidade([]);
            return;
            }

            const data = await getDisponibilidade({
                selectedDay,
                professionalId: id,
            });
            setDisponibilidade(data);
        };
        fetchDisponibilidade();
    }, [selectedDay, id]);

    const onSubmit = async (values: DisponibilidadeForm) => {
        if (!selectedDay) return;

        try {
            await createDisponibilidade({
                professionalId: id,
                selectedDay,
                horaInicio: values.horaInicio,
                horaFim: values.horaFim,
                intervalo: values.intervalo,
                horaInicioIntervalo: values.horaInicioIntervalo || undefined,
                horaFimIntervalo: values.horaFimIntervalo || undefined,
            });

            // Atualiza a lista local após criar
            const data = await getDisponibilidade({
                selectedDay,
                professionalId: id,
            });
            setDisponibilidade(data);

            form.reset();
            toast.success("Horários gerados com sucesso!", {
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Erro ao gerar horários.");
            }
        }
    };

    return (
        <div>
            <div className='px-5 pb-4 flex justify-center'>
                <div className="w-full max-w-[350px]">
                    <Calendar
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        locale={ptBR}
                        disabled={{before: new Date()}}
                        className='rounded-2xl w-full'
                        classNames={{
                            root: "w-full",
                            weekday: "flex-1 capitalize text-center font-medium text-sm py-1",
                            day: "flex-1",
                            month_caption: "flex justify-center items-center text-center capitalize font-semibold text-base py-1",
                            button_previous: "h-10 w-10",
                            button_next: "h-10 w-10",
                            week: "mt-2 flex w-full gap-1",
                            month_grid: "w-full border-collapse",
                        }}
                    />
                </div>
            </div>

            {selectedDay && disponibilidade.length > 0 ? (
                <ShowSchedulesAgenda 
                    selectedDay={selectedDay}
                    disponibilidade={disponibilidade}
                />
            ): selectedDay && (
                <FormDialogAgenda 
                    onSubmit={onSubmit}
                    setOpenDialog={setOpenDialog}
                    form={form}
                    openDialog={openDialog}
                />
            )}
        </div>
        
    );
}
 
export default AgendaProfessional;