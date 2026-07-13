import { Profissional } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { EditIcon, ShieldMinus, UserRoundX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { professionalSchema, ProfessionalSchema } from "@/app/schema/professional-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormDialog from "./form-dialog";
import { updateProfessional } from "@/app/_actions/update-professional";
import { deleteProfessional } from "@/app/_actions/delete-professional";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface ProfessioanlItemProps {
  professional: Profissional;
  setProfessionals: Dispatch<SetStateAction<Profissional[]>>;
}

const ProfessionalItem = ({ professional, setProfessionals }: ProfessioanlItemProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<ProfessionalSchema>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      nome: professional.nome,
      telefone: professional.telefone ?? "",
    },
  });

  const onSubmit = async (data: ProfessionalSchema) => {
    try {
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("telefone", data.telefone ?? "");
      formData.append("imagem", data.imagem);

      const upProfessional = await updateProfessional(formData, professional.id, professional.imgURLPublicId);
      setProfessionals((old) =>
        old.map((p) => (p.id === professional.id ? upProfessional : p))
      );

      form.reset();
      setPreview(null);
      setOpenDialog(false);

      toast.success("Profissional atualizado com sucesso!", {
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
        toast.error("Erro ao atualizar profissional.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfessional(professional.id, professional.imgURLPublicId);
      setProfessionals((old) => old.filter((p) => p.id !== professional.id));
      toast.success("Profissional excluído com sucesso!", {
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
        toast.error("Erro ao excluir profissional.");
      }
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };



  return (
    <Card className="min-w-[167px] rounded-2xl border border-primary bg-secondary">
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
          <h3 className="truncate font-semibold">{professional.nome}</h3>
        </div>

        <div className="w-full">
          <Button className="w-[100%]" variant="destructive">
            Ver agenda
          </Button>
          <div className="flex flex-row justify-between gap-2 w-full mt-2 pr-1">
            <Button className="w-[32%]" variant="outline" onClick={handleOpenDialog}>
              <EditIcon />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger render={<Button className="w-[31%]" variant="outline"><UserRoundX /></Button>}>
                
              </AlertDialogTrigger>

              <AlertDialogContent className="w-[100%] ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer excluir este profissional?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    Ao cancelar, você perderá o profissional e não poderá
                    recuperá-lo. Essa ação é irreversível.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="text-white"
                    style={{ backgroundColor: "#dc2626" }}
                    onClick={handleDelete}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="w-[30%]" variant="outline">
              <ShieldMinus/>
            </Button>
          </div>
          <Button className="w-[100%] mt-2" variant="outline">
            Serviços
          </Button>
        </div>
      </CardContent>

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
            <DialogTitle>Edite as informações</DialogTitle>
          </DialogHeader>

          <FormDialog form={form} onSubmit={onSubmit} preview={preview} setPreview={setPreview}/>
        </DialogContent>
      </Dialog>

      
    </Card>
  );
};

export default ProfessionalItem;