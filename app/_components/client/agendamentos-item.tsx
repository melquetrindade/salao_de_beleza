"use client"

import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarImage } from "../ui/avatar"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Button } from "../ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { toast } from "sonner"
import { useState } from "react"
import { Prisma } from "@prisma/client"
import SummaryReserva from "./summary-reserva"
import { SmartphoneIcon } from "lucide-react"


interface AgendamentoItemProps {
    agendamento: Prisma.AgendamentoGetPayload<{
        include: {
            servico: true,
            disponibilidade: {
                include: {
                    profissional: true,
                },
            },
        },
    }>
} 

const AgendamentoItem = ({ agendamento }: AgendamentoItemProps) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const isConfirmed = isFuture(agendamento.disponibilidade.data)

    const handleCancelBooking = async () => {
        console.log("Cancelar Reserva")
        // try {
        //     await deleteBooking(booking.id)
        //     setIsAlertDialogOpen(false)
        //     toast.success("Reserva cancelada com sucesso!")
        // } catch (error) {
        //     console.error(error)
        //     toast.error("Erro ao cancelar reserva. Tente novamente.")
        // }
    }

    const handleSheetOpenChange = (isOpen: boolean) => {
        setIsAlertDialogOpen(isOpen)
    }

    const handleCopyPhoneClick = (phone: string) => {
        navigator.clipboard.writeText(phone)
        toast.success("Telefone copiado com sucesso!", {
            style: {
            background: "#22c55e",
            color: "#fff",
            },
        },)
    }

    return (
        <Sheet open={isAlertDialogOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger className="w-full min-w-[90%]">
                <Card className="min-w-[90%] ring-0">
                    <CardContent className="flex justify-between">
                        {/*Esquerda */}
                        <div className="flex flex-col gap-2 py-5 pl-5">
                            <Badge
                                variant={isConfirmed ? "default" : "secondary"}
                                className="w-fit rounded-xl"
                            >
                                {isConfirmed ? "Confirmado" : "Finalizado"}
                            </Badge>
                            <h3 className="font-bold">{agendamento.servico.nome}</h3>

                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={agendamento.disponibilidade.profissional.imgURL!} className="object-top"/>
                                </Avatar>
                                <p className="text-sm">{agendamento.disponibilidade.profissional.nome}</p>
                            </div>
                        </div>

                        {/*Direita */}
                        <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                            <p className="text-sm capitalize">
                                {format(agendamento.disponibilidade.data, "MMMM", { locale: ptBR })}
                            </p>
                            <p className="text-2xl">
                                {format(agendamento.disponibilidade.data, "dd", { locale: ptBR })}
                            </p>
                            <p className="text-sm">
                                {format(agendamento.disponibilidade.horaInicio, "HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>

            <SheetContent className="w-[80%]! max-w-none!">
                {" "}
                {/*O "!" server para ele desconsiderar a formatação padrão do shadcn, permitindo colocar a largura que a gente quiser */}
                <SheetHeader>
                    <SheetTitle className="text-left">Informções da Reserva</SheetTitle>

                    <div className="mt-6">
                        <Badge
                        variant={isConfirmed ? "default" : "secondary"}
                        className="w-fit rounded-xl"
                        >
                        {isConfirmed ? "Confirmado" : "Finalizado"}
                        </Badge>

                        <div className="mb-6 mt-3">
                            <SummaryReserva
                                service={agendamento.servico} 
                                selectedDate={agendamento.disponibilidade.data}
                                professionalName={agendamento.disponibilidade.profissional.nome}
                            />
                        </div>
                        

                        <div className="flex justify-between">
                            <div className='flex items-center gap-2'>
                                <SmartphoneIcon/>
                                <p className='text-sm'>{agendamento.disponibilidade.profissional.telefone}</p>
                            </div>
                            <Button onClick={() => handleCopyPhoneClick(agendamento.disponibilidade.profissional.telefone!)} variant='destructive' size='sm'>Copiar</Button>
                        </div>
                    </div>

                    <SheetFooter className="mt-6 pl-0 pr-3">
                        <div className="flex w-full items-center gap-3">
                            <Button
                                variant="outline"
                                className={isConfirmed ? `w-[50%]` : `w-full`}
                                render={<SheetClose/>}
                            >
                            Voltar
                            </Button>

                            {isConfirmed && (
                                <AlertDialog>
                                    <Button 
                                        className="w-[50%] bg-destructive text-white"
                                        render={<AlertDialogTrigger/>}
                                    >
                                    Cancelar reserva
                                    </Button>

                                <AlertDialogContent className="w-full ring-1 ring-secondary">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Você quer cancelar a reserva?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Ao cancelar, você perderá sua reserva e não poderá
                                        recuperá-la. Essa ação é irreversível.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">
                                        Voltar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="text-white"
                                        style={{ backgroundColor: "#dc2626" }}
                                        onClick={handleCancelBooking}
                                    >
                                        Confirmar
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </SheetFooter>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default AgendamentoItem