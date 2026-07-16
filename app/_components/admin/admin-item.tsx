"use client"

import { adminSchema, AdminSchema } from "@/app/schema/admin-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Administrador } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { ShieldUserIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { updateAdmin } from "@/app/_actions/update-admin";
import { deleteAdmin } from "@/app/_actions/delete-admin";
import ActionsAdmin from "./actions-admin";
import FormDialogAdmin from "./form-dialog-admin";

interface AdminItemProps {
    admin: Administrador,
    setAdministrators: Dispatch<SetStateAction<Administrador[]>>
}

const AdminItem = ({admin, setAdministrators}: AdminItemProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const form = useForm<AdminSchema>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
          nome: admin.nome,
          email: admin.email,
        },
    });

    const onSubmit = async (data: AdminSchema) => {
        try {
            const formData = new FormData();
        
            formData.append("nome", data.nome);
            formData.append("email", data.email)
        
            const upAdmin = await updateAdmin(formData, admin.id);
            setAdministrators((old) =>
                old.map((a) => (a.id === admin.id ? upAdmin : a)),
            );
        
            // Reseta o form com os dados atualizados
            form.reset({
                nome: upAdmin.nome,
                email: upAdmin.email
            });
            setOpenDialog(false);
        
            toast.success("Administrador atualizado com sucesso!", {
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
                toast.error("Erro ao atualizar administrador.");
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteAdmin(admin.id);
            setAdministrators((old) => old.filter((a) => a.id !== admin.id));

            setOpenDeleteDialog(false);
            toast.success("Administrador excluído com sucesso!", {
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
                toast.error("Erro ao excluir administrador.");
            }
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(!openDialog);
    };

    return (
        <Card className="min-w-[167px] rounded-2xl bg-secondary">
            <CardContent>

                {/*Imagem */}
                <div className="h-[179px] w-full flex items-center justify-center bg-muted rounded-2xl">
                    <ShieldUserIcon size={48} className="text-muted-foreground" />
                </div>

                {/*Texto */}
                <div className="py-3 px-1 flex flex-col items-center gap-1">
                    <h3 className="truncate font-semibold">{admin.nome}</h3>
                    <p className="truncate text-sm text-muted-foreground">{admin.email}</p>
                </div>

                <ActionsAdmin
                    handleOpenDialog={handleOpenDialog}
                    openDeleteDialog={openDeleteDialog}
                    setOpenDeleteDialog={setOpenDeleteDialog}
                    handleDelete={handleDelete}
                />
            </CardContent>

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
                    <DialogTitle>Edite as informações</DialogTitle>
                </DialogHeader>

                <FormDialogAdmin
                    form={form}
                    onSubmit={onSubmit}
                    submitLabel="Atualizar"
                />
                </DialogContent>
            </Dialog>
            </Card>
    );
}
 
export default AdminItem;