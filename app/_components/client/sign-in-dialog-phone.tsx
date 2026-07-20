"use client";

import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

const SignInDialogPhone = () => {
  

  return (
    <>
      <DialogHeader>
        <DialogTitle>Informe seu telefone</DialogTitle>
        <DialogDescription>
          Antes de reservar um serviço, cadastre seu telefone para contato!
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="default"
        className="gap-2 font-bold"
      >
        Cadastrar telefone
      </Button>
    </>
  );
};

export default SignInDialogPhone;
