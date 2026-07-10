"use client";

import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Link from "next/link";
import SignInDialog from "./sign-in-dialog";

const SiderbarSheetClient = () => {
  const { data } = useSession();
  const handleLogoutClick = () => signOut();

  return (
    <SheetContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between px-5 border-b border-solid gap-3 pb-4">
        {data?.user ? (
          <div className="flex items-center gap-2">
            {data?.user?.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>{data?.user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
            )}

            <div>
              <p className="font-bold">{data.user.name}</p>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bold">Olá, faça seu login</h2>
            <Dialog>
              <DialogTrigger>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] text-center">
                <SignInDialog />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <div className="px-5 flex flex-col gap-2 border-b border-solid pb-5">
        <Button
          className="gap-2 justify-start"
          variant="ghost"
          render={<SheetClose />}
        >
          <HomeIcon size={18} />
          <Link href="/">Inicio</Link>
        </Button>

        <Button className="gap-2 justify-start" variant="ghost">
          <CalendarIcon />
          Agendamentos
        </Button>
      </div>

      {data?.user && (
        <div className="px-5 flex flex-col border-b border-solid pb-5">
          <Button
            className="py-5 justify-start gap-2"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  );
};

export default SiderbarSheetClient;
