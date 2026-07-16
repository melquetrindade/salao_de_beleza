"use client"

import { getAdmin } from "@/app/_actions/get-admin";
import { Administrador } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSchema, adminSchema } from "@/app/schema/admin-schema";
import { toast } from "sonner";
import { createAdmin } from "@/app/_actions/create-admin";
import AdminItem from "./admin-item";
import FormDialogAdmin from "./form-dialog-admin";

const ListAdmin = () => {
    const [administrators, setAdministrators] = useState<Administrador[]>([])
    const [openDialog, setOpenDialog] = useState(false);

    const form = useForm<AdminSchema>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
          nome: "",
          email: ""
        },
    });

    const onSubmit = async (data: AdminSchema) => {
        try {
          const formData = new FormData();
    
          formData.append("nome", data.nome);
          formData.append("email", data.email);
    
          const newAdmin = await createAdmin(formData);
          setAdministrators((old) => [...old, newAdmin as unknown as Administrador]);
    
          form.reset();
          setOpenDialog(false);
    
          toast.success("Administrador cadastrado com sucesso!", {
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
            toast.error("Erro ao cadastrar administrador.");
          }
        }
    };

    const fetchAdministrators = async () => {
        const listAdministrators = await getAdmin();
        setAdministrators(listAdministrators)
    }

    useEffect(() => {
        fetchAdministrators();
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
            {administrators.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 mb-10 ">
                    {administrators.map((admin) => (
                        <AdminItem
                            key={admin.id}
                            admin={admin}
                            setAdministrators={setAdministrators}
                        />
                    ))}
                </div>
            ) : (
                <h1>Não existem administradores</h1>
            )}

            <Dialog
                open={openDialog}
                onOpenChange={(open) => {
                    setOpenDialog(open);
        
                    if (!open) {
                        form.reset();
                    }
                }}
                >
                <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <DialogHeader>
                    <DialogTitle>Preencha as informações</DialogTitle>
                    </DialogHeader>
                    
                    <FormDialogAdmin
                        form={form}
                        onSubmit={onSubmit}
                        submitLabel="Cadastrar"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
 
export default ListAdmin;