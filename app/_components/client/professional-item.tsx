import { Profissional } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProfessioanlItemProps {
  professional: Profissional;
}

const ProfessionalItem = ({professional}: ProfessioanlItemProps) => {

    return (
        <Card className="min-w-[167px] rounded-2xl border-secondary bg-secondary ring-0">
            <CardContent>
                
                {/*Imagem */}
                <div className="relative h-[179px] w-full">
                    {professional.imgURL ? (
                        <Image
                            alt="Imagem do Profissional"
                            src={professional.imgURL}
                            fill
                            priority
                            className="object-cover rounded-2xl object-top"
                        />
                    ) : (
                        <div className="h-full w-full rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                            Sem imagem
                        </div>
                    )}
                </div>

                {/*Texto */}
                <div className="py-3 px-1 flex justify-center">
                    <h3 className="truncate font-semibold text-xs">{professional.nome}</h3>
                </div>

                {/*Reservar */}
                <div className="flex justify-center">
                    <Button size="xs">
                        <Link href={`/services/${professional.id}`}><p className="text-xs">Serviços</p></Link>
                    </Button>
                </div>
                
            </CardContent>
    </Card>
  );
};

export default ProfessionalItem;
