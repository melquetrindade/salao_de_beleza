"use client"

import { getProfessionals } from "@/app/_actions/get-professionals";
import { Profissional } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserRoundPlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { createProfessional } from "@/app/_actions/create-professional";
import ProfessionalItem from "./professional-item";
import Image from "next/image";

const professionalSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  telefone: z
    .string()
    .min(10, "Telefone inválido."),

    imagem: z
        .instanceof(File, {
        message: "Selecione uma imagem.",
        })
        .refine(
        (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        {
            message: "Formato de imagem inválido.",
        }
        )
        .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "A imagem deve ter no máximo 5 MB.",
        }),
});

type ProfessionalSchema = z.infer<typeof professionalSchema>;

const ListProfessionals = () => {
    const [professionals, setProfessionals] = useState<Profissional[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<ProfessionalSchema>({
        resolver: zodResolver(professionalSchema),
        defaultValues: {
        nome: "",
        telefone: "",
        },
    });

    const onSubmit = async (data: ProfessionalSchema) => {
        const formData = new FormData();

        formData.append("nome", data.nome);
        formData.append("telefone", data.telefone ?? "");
        formData.append("imagem", data.imagem);

        const newProfessional = await createProfessional(formData)
        setProfessionals((old) => [...old, newProfessional])

        form.reset();
        setPreview(null);
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
                <DialogContent className='w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden'>
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
                                <FieldLabel htmlFor="imagem">
                                    Foto do Profissional
                                </FieldLabel>

                                <FieldContent>
                                    <Controller
                                    control={form.control}
                                    name="imagem"
                                    render={({ field }) => (
                                        <Input
                                        id="imagem"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (!file) return;

                                            // Atualiza o React Hook Form
                                            field.onChange(file);

                                            // Atualiza o preview
                                            if (preview) {
                                            URL.revokeObjectURL(preview);
                                            }

                                            setPreview(URL.createObjectURL(file));
                                        }}
                                        />
                                    )}
                                    />

                                    <FieldError>
                                    {form.formState.errors.imagem?.message}
                                    </FieldError>
                                </FieldContent>
                            </Field>
                        </FieldGroup>

                        {preview && (
                            <div className="flex justify-center">
                                <Image
                                    src={preview}
                                    alt="Pré-visualização"
                                    width={80}
                                    height={80}
                                    priority
                                    className="rounded-md object-cover"
                                    style={{ width: "auto", height: "auto" }}
                                />
                            </div>
                        )}

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