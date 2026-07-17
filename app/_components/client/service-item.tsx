import { Servico } from "@prisma/client";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Image from "next/image"
import { useState } from "react";
import { ClockIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "../ui/dialog";
import SignInDialog from "./sign-in-dialog";

interface ServiceItemProps {
    service: Servico
}

const ServiceItem = ({service}: ServiceItemProps) => {
    const {data} = useSession()
    const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)

    const handleBookingSheetOpenChange = () => {
        setBookingSheetIsOpen(false)
    }

    const handleBookingClick = () => {
        if(data?.user){
            return setBookingSheetIsOpen(true)
        }
        return setSignInDialogIsOpen(true)
    }

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
                                
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Fazer Reserva</SheetTitle>
                                    </SheetHeader>
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