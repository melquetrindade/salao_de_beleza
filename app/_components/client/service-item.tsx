import { Servico, User } from "@prisma/client";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Image from "next/image"
import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import SignInDialog from "./sign-in-dialog";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import { getUser } from "@/app/_actions/get-user";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneClientSchema, phoneClientSchema } from "@/app/schema/phone-client-schema";
import { toast } from "sonner";
import { createPhone } from "@/app/_actions/create-phone-client";

interface ServiceItemProps {
    service: Servico
}

const ServiceItem = ({service}: ServiceItemProps) => {
    const {data} = useSession()
    const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [client, setClient] = useState<User | null>()
    const [signInDialogIsOpenPhone, setSignInDialogIsOpenPhone] = useState(false)
    //const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

    const form = useForm<PhoneClientSchema>({
        resolver: zodResolver(phoneClientSchema),
        defaultValues: {
          telefone: "",
        },
    });

    const onSubmit = async (dataPhone: PhoneClientSchema) => {
        try {
            if (!data?.user?.id) {
                toast.error("Usuário não identificado.");
                return;
            }

            const formData = new FormData();
            formData.append("telefone", dataPhone.telefone ?? "");
        
            const phone = await createPhone(formData, data.user.id);
            setClient((old) => {
                if (!old) return old;

                return {
                    ...old,
                    telefone: phone,
                };
            });
        
            form.reset();
            toast.success("Telefone cadastrado com sucesso!", {
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
                toast.error("Erro ao cadastrar telefone.");
            }
        }
    };

    const handleBookingSheetOpenChange = () => {
        setBookingSheetIsOpen(false)
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }

    const handleBookingClick = () => {
        if(data?.user && client?.telefone){
            return setBookingSheetIsOpen(true)
        } else if(!data?.user) {
            return setSignInDialogIsOpen(true)
        } return setSignInDialogIsOpenPhone(true)
        
    }

    const fetchUser = async (id: string) => {
        const client = await getUser(id);
        setClient(client);
    };

    useEffect(() => {
        if(data?.user?.id) {
            fetchUser(data.user.id)
        }
    }, [data?.user?.id])

    
    
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

            <Dialog open={signInDialogIsOpenPhone} onOpenChange={(open) => setSignInDialogIsOpenPhone(open)}>
                <DialogContent className='w-[90%]'>
                    <DialogHeader>
                        <DialogTitle>Informe seu telefone</DialogTitle>
                        <DialogDescription>
                        Antes de reservar um serviço, cadastre seu telefone para contato!
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FieldGroup>
                            
                            <Field>
                                <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                                <FieldContent>
                                    <Input
                                    id="telefone"
                                    placeholder="(84) 99999-9999"
                                    {...form.register("telefone")}
                                    />

                                    <FieldError>{form.formState.errors.telefone?.message}</FieldError>
                                </FieldContent>
                            </Field>

                        </FieldGroup>

                        <Button type="submit" className="w-full">
                            Cadastrar telefone
                        </Button>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    );
}
 
export default ServiceItem;







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