"use client"

import { Button } from "../ui/button";
import { BanIcon, EditIcon, UserRoundX } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

interface ActionsServicesProps {
    handleOpenDialog: () => void;
    openDeleteDialog: boolean;
    setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => Promise<void>;
    openDesactiveDialog: boolean;
    setOpenDesactiveDialog: Dispatch<SetStateAction<boolean>>;
    isAtivacted: boolean;
    handleDesactivated: () => Promise<void>;
}

const ActionsServices = ({
    handleOpenDialog,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDelete,
    openDesactiveDialog,
    setOpenDesactiveDialog,
    isAtivacted,
    handleDesactivated
}: ActionsServicesProps) => {
    return (
        <div className="w-full">
          <div className="flex flex-row justify-between gap-2 w-full mt-2 pr-1">
            <Button className="w-[32%]" variant="outline" onClick={handleOpenDialog}>
              <EditIcon />
            </Button>

            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <AlertDialogTrigger render={<Button className="w-[31%]" variant="outline"><UserRoundX /></Button>}>
                
              </AlertDialogTrigger>

              <AlertDialogContent className="w-[100%] ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer excluir este serviço?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    Ao excluir, você perderá o serviço e não poderá
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

            <AlertDialog open={openDesactiveDialog} onOpenChange={setOpenDesactiveDialog}>
              <AlertDialogTrigger render={
                <Button className="w-[30%]" variant="outline">
                  <BanIcon/>
                </Button>}>
              </AlertDialogTrigger>

              <AlertDialogContent className="w-[100%] ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer {isAtivacted ? 'desativar' : 'ativar'} este serviço?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    {isAtivacted
                      ? 'Ao desativar, seus clientes não poderão reservar esse serviço. Você pode ativar novamente a qualquer momento!'
                      : 'Ao ativar, seus clientes poderão agendar esse serviço novamente.'}
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
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
    );
}
 
export default ActionsServices;