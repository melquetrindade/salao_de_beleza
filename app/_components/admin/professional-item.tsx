import { Profissional } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { EditIcon, EyeOff } from "lucide-react";

interface ProfessioanlItemProps {
    professional: Profissional
}

const ProfessionalItem = ({professional}: ProfessioanlItemProps) => {
    return (
        <Card className="min-w-[167px] rounded-2xl border border-primary bg-secondary">
            <CardContent>
                {/*Imagem */}
                <div className="relative h-[159px] w-full">
                    {professional.imgURL ? (
                        <Image 
                            alt="Imagem do Profissional" 
                            src={professional.imgURL} 
                            fill
                            priority
                            className="object-cover rounded-2xl"
                        />
                    ) : (
                        <div className="h-full w-full rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                            Sem imagem
                        </div>
                    )}
                </div>

                {/*Texto */}
                <div className="py-3 px-1">
                    <h3 className="truncate font-semibold">{professional.nome}</h3>
                </div>

                <div className="w-full">
                    <Button className="w-[100%]" variant="destructive">Ver agenda</Button>
                    <div className="flex flex-row justify-between gap-2 w-full mt-2 pr-1">
                        <Button className="w-[50%]" variant="outline">
                            <EditIcon/>
                        </Button>

                        <Button className="w-[48%]" variant="outline">
                            <EyeOff/>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default ProfessionalItem;
