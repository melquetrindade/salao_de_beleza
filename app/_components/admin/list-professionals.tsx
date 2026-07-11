"use client"

import { getProfessionals } from "@/app/_actions/get-professionals";
import { Profissional } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserRoundPlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { createProfessional } from "@/app/_actions/create-professional";
import ProfessionalItem from "./professional-item";

const professionalSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  telefone: z
    .string()
    .min(10, "Telefone inválido."),

  imagemUrl: z
    .string()
    .url("Informe uma URL válida."),
});

type ProfessionalSchema = z.infer<typeof professionalSchema>;

const ListProfessionals = () => {
    const [professionals, setProfessionals] = useState<Profissional[]>([])
    const [openDialog, setOpenDialog] = useState(false)

    const form = useForm<ProfessionalSchema>({
        resolver: zodResolver(professionalSchema),
        defaultValues: {
        nome: "",
        telefone: "",
        imagemUrl: "",
        },
    });

    const onSubmit = async (data: ProfessionalSchema) => {
        console.log(data);

        const newProfessional = await createProfessional({
            nome: data.nome,
            telefone: data.telefone,
            imgURL: data.imagemUrl
        })
        setProfessionals((old) => [...old, newProfessional])

        form.reset();
        setOpenDialog(false)
    }

    const fetchProfessionals = async () => {
        const listProfessionals = await getProfessionals()
        setProfessionals(listProfessionals)
    }

    useEffect (() => {
        fetchProfessionals()
    }, [])

    const handleOpenDialog = () => {
        setOpenDialog(!openDialog)
    }

    return (
        <div className="p-5">
            <div className="flex items-center justify-end mb-7">
                <Button onClick={handleOpenDialog}>
                    <UserRoundPlusIcon/>
                    Cadastrar profissional
                </Button>
            </div>

            {professionals.length == 0 ? (
                <h1>Não tem profissionais</h1>
            ) : (
                <div className="flex gap-4 overflow-auto mb-10 [&::-webkit-scrollbar]:hidden">
                    {professionals.map((professional) => (
                        <ProfessionalItem key={professional.telefone} professional={professional}/>
                    ))}
                </div>
            )}

            <Dialog open={openDialog} onOpenChange={(open) => {
                setOpenDialog(open)

                if (!open) {
                    form.reset();
                }
            }}>
                <DialogContent className='w-[90%]'>
                    <DialogHeader>
                        <DialogTitle>Preencha as informações</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nome">Nome</FieldLabel>

                                <FieldContent>
                                    <Input
                                    id="nome"
                                    placeholder="Digite o nome"
                                    {...form.register("nome")}
                                    />

                                    <FieldError>
                                        {form.formState.errors.nome?.message}
                                    </FieldError>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="telefone">Telefone</FieldLabel>

                                <FieldContent>
                                    <Input
                                    id="telefone"
                                    placeholder="(84) 99999-9999"
                                    {...form.register("telefone")}
                                    />

                                    <FieldError>
                                    {form.formState.errors.telefone?.message}
                                    </FieldError>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="imagemUrl">Imagem URL</FieldLabel>

                                <FieldContent>
                                    <Input
                                    id="imagemUrl"
                                    placeholder="https://..."
                                    {...form.register("imagemUrl")}
                                    />

                                    <FieldError>
                                    {form.formState.errors.imagemUrl?.message}
                                    </FieldError>
                                </FieldContent>
                            </Field>
                        </FieldGroup>

                        <Button type="submit" className="w-full">
                            Cadastrar Profissional
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        
    );
}
 
export default ListProfessionals;