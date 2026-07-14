"use client";

import { useEffect, useState } from "react";
import { Servico } from "@prisma/client";
import { getServices } from "@/app/_actions/get-service";
import { Button } from "../ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, ServiceSchema } from "@/app/schema/service-schema";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Image from "next/image";
import { createService } from "@/app/_actions/create-service";

interface ListServicesProps {
  id: string;
}

const ListServices = ({ id }: ListServicesProps) => {
  const [services, setServices] = useState<Servico[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nome: "",
      preco: "",
      descricao: "",
      tempo: "",
    },
  });

  const onSubmit = async (data: ServiceSchema) => {
    try {
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("preco", data.preco ?? 0);
      formData.append("descricao", data.descricao ?? "");
      formData.append("tempo", data.tempo ?? "");
      formData.append("imagem", data.imagem);

      const newService = await createService(formData, id);
      setServices((old) => [...old, newService as unknown as Servico]);

      form.reset();
      setPreview(null);
      setOpenDialog(false);

      toast.success("Serviço cadastrado com sucesso!", {
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
        toast.error("Erro ao cadastrar serviço.");
      }
    }
  };

  const fetchServices = async () => {
    const listServices = await getServices(id);
    setServices(listServices as unknown as Servico[]);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-end mb-7">
        <Button onClick={handleOpenDialog}>
          <CirclePlusIcon />
          Cadastrar serviços
        </Button>
      </div>

      {services.length > 0 ? (
        <p>Este profissional tem {services.length} serviços cadastrados</p>
      ) : (
        <p>Este profissional não tem serviços cadastrados</p>
      )}

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);

          if (!open) {
            form.reset();
            setPreview(null);
          }
        }}
      >
        <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <DialogHeader>
            <DialogTitle>Preencha as informações</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <FieldContent>
                  <Input
                    id="nome"
                    placeholder="Digite o nome do serviço"
                    {...form.register("nome")}
                  />

                  <FieldError>{form.formState.errors.nome?.message}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="preco">Preço</FieldLabel>
                <FieldContent>
                  <Input
                    id="preco"
                    placeholder="R$ 30,00"
                    {...form.register("preco")}
                  />

                  <FieldError>
                    {form.formState.errors.preco?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                <FieldContent>
                  <Input
                    id="descricao"
                    placeholder="Corte clássico feminino com acabamento perfeito"
                    {...form.register("descricao")}
                  />

                  <FieldError>
                    {form.formState.errors.descricao?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="tempo">Tempo do Serviço</FieldLabel>
                <FieldContent>
                  <Input
                    id="tempo"
                    placeholder="30:00"
                    {...form.register("tempo")}
                  />

                  <FieldError>
                    {form.formState.errors.tempo?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="imagem">Imagem do serviço</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="imagem"
                    render={({ field }) => (
                      <Input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        className="file:mr-3 text-[0.8125rem]"
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
                <div className="relative min-w-[140px] h-[180px]">
                  <Image
                    src={preview}
                    alt="Pré-visualização"
                    fill
                    priority
                    className="rounded-md object-cover object-top"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListServices;
