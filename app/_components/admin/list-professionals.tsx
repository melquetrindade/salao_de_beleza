"use client";

import { getProfessionals } from "@/app/_actions/get-professionals";
import { Profissional } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserRoundPlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfessional } from "@/app/_actions/create-professional";
import ProfessionalItem from "./professional-item";
import { toast } from "sonner";
import { professionalSchema, ProfessionalSchema } from "@/app/schema/professional-schema";
import FormDialog from "./form-dialog";



const ListProfessionals = () => {
  const [professionals, setProfessionals] = useState<Profissional[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<ProfessionalSchema>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      nome: "",
      telefone: "",
    },
  });

  const onSubmit = async (data: ProfessionalSchema) => {
    try {
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("telefone", data.telefone ?? "");
      formData.append("imagem", data.imagem);

      const newProfessional = await createProfessional(formData);
      setProfessionals((old) => [...old, newProfessional]);

      form.reset();
      setPreview(null);
      setOpenDialog(false);

      toast.success("Profissional cadastrado com sucesso!", {
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: {
            background: "#ef4444",
            color: "#fff",
          }
        });
      } else {
        toast.error("Erro ao cadastrar profissional.");
      }
    }
  };

  const fetchProfessionals = async () => {
    const listProfessionals = await getProfessionals();
    setProfessionals(listProfessionals);
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-end mb-7">
        <Button onClick={handleOpenDialog}>
          <UserRoundPlusIcon />
          Cadastrar profissional
        </Button>
      </div>

      {professionals.length == 0 ? (
        <h1>Não tem profissionais</h1>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-10 ">
          {professionals.map((professional) => (
            <ProfessionalItem
              key={professional.telefone}
              professional={professional}
              setProfessionals={setProfessionals}
            />
          ))}
        </div>
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

          <FormDialog form={form} onSubmit={onSubmit} preview={preview} setPreview={setPreview}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListProfessionals;