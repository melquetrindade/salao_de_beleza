import { Servico } from "@prisma/client";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Image from "next/image"
import { useMemo, useState } from "react";
import { ClockIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "../ui/dialog";
import SignInDialog from "./sign-in-dialog";
import { toast } from "sonner";
import router from "next/router";
import { set } from "date-fns";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";

interface ServiceItemProps {
    service: Servico
}

const ServiceItem = ({service}: ServiceItemProps) => {
    const {data} = useSession()
    const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

    const handleBookingSheetOpenChange = () => {
        setBookingSheetIsOpen(false)
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }

    const handleBookingClick = () => {
        if(data?.user){
            return setBookingSheetIsOpen(true)
        }
        return setSignInDialogIsOpen(true)
    }

    /*
    const handleCreateBooking = async () => {
        // 1. Não exibir horários que já foram agendados
        // 2. Salvar o agendamento para o usuário logado
        // 3. Não exibir o botão de "Reservar" se o usuário não estiver logado
        try{
            if(!selectedDate){
                return
            }
            await createBooking({
                serviceId: service.id,
                date: selectedDate,
            })
            handleBookingSheetOpenChange()
            toast.success("Reserva criada com sucesso!", {
                action: {
                    label: "Ver agendamentos",
                    onClick: () => router.push("/bookings")
                }
            })
        } catch (error) {
            console.log(error)
            toast.error("Error ao criar reserva!")
        }
    }
    */

    /*
    const handleTimeSelect = (time: string | undefined) => {
        setSelectedTime(time)
    }
    */

    /*
    const timeList = useMemo(() => {
        if (!selectedDay) return []
        return getTimeList({ bookings: dayBookings, selectedDay: selectedDay })
    }, [dayBookings, selectedDay])
    */

    /*
    const selectedDate = useMemo(() => {
        if(!selectedDay || !selectedTime) return
        return set(selectedDay, {
            hours: Number(selectedTime?.split(":")[0]),
            minutes: Number(selectedTime?.split(":")[1])
        })
    }, [selectedDay, selectedTime])
    */
    
    return (
        <>
            <Card className="ring-0">
                <CardContent  className='flex items-center gap-3'>
                    
                    {/*Imagem */}
                    <div className='relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]'>
                        <Image alt={service.nome} src={service.imgURL!} fill className='object-cover rounded-lg'/>
                    </div>

                    {/*Direita */}
                    <div className='space-y-2 w-full'>
                        <h3 className='font-semibold text-sm'>{service.nome}</h3>
                        <div className="flex gap-2">
                            <ClockIcon className="text-gray-500" size={20}/>
                            <p className='text-sm text-gray-500'>{service.tempo}</p>
                        </div>
                        
                        <div className='flex items-center justify-between w-full'>
                            <p className='text-sm font-bold text-primary'>
                                {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(Number(service.preco))}
                            </p>

                            <Sheet open={bookingSheetIsOpen} onOpenChange={handleBookingSheetOpenChange}>
                                
                                <Button 
                                    onClick={handleBookingClick}
                                    variant='secondary' 
                                    size='sm'>Reservar
                                </Button>
                                
                                <SheetContent className='px-0 flex h-full flex-col'>
                                    <SheetHeader>
                                        <SheetTitle className="text-center font-bold text-lg">Fazer Reserva</SheetTitle>
                                    </SheetHeader>

                                    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
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
                                    </div>
                                </SheetContent>
                            </Sheet>
                            
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={signInDialogIsOpen} onOpenChange={(open) => setSignInDialogIsOpen(open)}>
                <DialogContent className='w-[90%]'>
                    <SignInDialog/>
                </DialogContent>
            </Dialog>
        </>
    );
}
 
export default ServiceItem;

/*
{selectedDay && (
                                            <div className='py-4 border border-solid px-5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden gap-2'>
                                                {timeList.length > 0 ? timeList.map((time) => (
                                                    <Button 
                                                        key={time}
                                                        variant={selectedTime === time ? 'default' : 'outline'}
                                                        className='rounded-full'
                                                        onClick={() => handleTimeSelect(time)}
                                                    >{time}</Button>
                                                )) : 
                                                    <p className='text-xs'>Não há horários disponíveis para este dia.</p>
                                                }
                                            </div>
                                        )}
                                        
                                        {selectedDate && (
                                            <div className='p-5'>
                                                <BookingSummary 
                                                    service={service} 
                                                    barbershop={barbershop} 
                                                    selectedDate={selectedDate} />
                                            </div>
                                        )}
*/