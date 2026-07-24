"use client"

import { Button } from "../ui/button";
import { BanIcon, EditIcon, Loader2Icon, UserRoundX } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

interface ActionsProfessionalsProps {
    handleOpenDialog: () => void;
    openDeleteDialog: boolean;
    setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => Promise<void>;
    openDesactiveDialog: boolean;
    setOpenDesactiveDialog: Dispatch<SetStateAction<boolean>>;
    isAtivacted: boolean;
    handleDesactivated: () => Promise<void>;
    professionalId: string;
    isLoadingDeleteProfi: boolean;
    isLoadingDesactiveProfi: boolean
}

const ActionsProfessionals = ({
    handleOpenDialog,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDelete,
    openDesactiveDialog,
    setOpenDesactiveDialog,
    isAtivacted,
    handleDesactivated,
    professionalId,
    isLoadingDeleteProfi,
    isLoadingDesactiveProfi
}: ActionsProfessionalsProps) => {
    return (
        <div className="w-full">
          
          <Button className="w-full" variant="destructive">
            <Link href={`/admin/calendar/${professionalId}`}>Ver agenda</Link>
          </Button>

          <div className="flex flex-row justify-between gap-2 w-full mt-2 pr-1">
            <Button className="w-[32%] bg-yellow-300 text-white" variant={null} onClick={handleOpenDialog}>
              <EditIcon />
            </Button>

            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <AlertDialogTrigger render={<Button className="w-[31%]" ><UserRoundX /></Button>}>
                
              </AlertDialogTrigger>

              <AlertDialogContent className="w-full ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer excluir este profissional?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    Ao excluir, você perderá o profissional e não poderá
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
                    {isLoadingDeleteProfi ? 
                      <Loader2Icon className="size-4 animate-spin" /> 
                    : 'Confirmar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openDesactiveDialog} onOpenChange={setOpenDesactiveDialog}>
              <AlertDialogTrigger render={
                <Button className="w-[30%] bg-blue-400 text-white" variant={null}>
                  <BanIcon/>
                </Button>}>
              </AlertDialogTrigger>

              <AlertDialogContent className="w-full ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer {isAtivacted ? 'desativar' : 'ativar'} este profissional?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    {isAtivacted
                      ? 'Ao desativar, seus clientes não poderão reservar serviços com este profissional. Você pode ativar novamente a qualquer momento!'
                      : 'Ao ativar, seus clientes poderão agendar serviços com este profissional novamente.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="text-white"
                    style={{ backgroundColor: "#dc2626" }}
                    onClick={handleDesactivated}
                  >
                    {isLoadingDesactiveProfi ?
                      <Loader2Icon className="size-4 animate-spin" /> 
                      : 'Confirmar'
                    }
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            
          </div>
          <Button className="w-full mt-2" variant="outline">
            <Link href={`/admin/service/${professionalId}`}>Serviços</Link>
          </Button>
        </div>
    );
}
 
export default ActionsProfessionals;