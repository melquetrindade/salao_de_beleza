"use client"

import { ptBR } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { useEffect, useMemo, useState } from "react";
import { getDisponibilidade } from "@/app/_actions/getDisponibilidade";
import { Disponibilidade } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { DisponibilidadeForm, disponibilidadeSchema } from "@/app/schema/disponibilidade-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDisponibilidade } from "@/app/_actions/createDisponibilidade";
import { toast } from "sonner";

interface AgendaProfessionalProps {
    id: string
}

const AgendaProfessional = ({id}: AgendaProfessionalProps) => {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);
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
            console.log("Troquei de data")
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

    // const disponibilidade = useMemo(() => {
    //     if(!selectedDay) return []

    //     return getDisponibilidade({selectedDay: selectedDay, professionalId: id})
    // }, [selectedDay])

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
                <h1>Já tem horários cadastrados para este dia.</h1>
            ): selectedDay && (
                <div>
                    <Button onClick={() => setOpenDialog(true)}>
                        Cadastrar Horários
                    </Button>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        <DialogHeader>
                            <DialogTitle>Preencha as informações</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Horário Inicial</FieldLabel>

                                    <FieldContent>
                                        <Input
                                        type="time"
                                        {...form.register("horaInicio")}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Horário Final</FieldLabel>

                                    <FieldContent>
                                        <Input
                                        type="time"
                                        {...form.register("horaFim")}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Intervalo (minutos)</FieldLabel>

                                    <FieldContent>
                                    <Input
                                        type="number"
                                        min={5}
                                        step={5}
                                        {...form.register("intervalo", {
                                        valueAsNumber: true,
                                        })}
                                    />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Início do Intervalo (opcional)</FieldLabel>
                                    <FieldContent>
                                        <Input
                                        type="time"
                                        {...form.register("horaInicioIntervalo")}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Fim do Intervalo (opcional)</FieldLabel>
                                    <FieldContent>
                                        <Input
                                        type="time"
                                        {...form.register("horaFimIntervalo")}
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>

                            <Button type="submit" className="w-full">
                                Gerar Horários
                            </Button>
                        </form>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
        
    );
}
 
export default AgendaProfessional;

// Agora você pode enviar para o banco
        // await createDisponibilidade({
        //     inicio,
        //     fim,
        //     intervalo: values.intervalo,
        // });