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
import { BookUser, HomeIcon, LockIcon, LogOutIcon} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOwner } from "@/app/_actions/get-admin";

const SiderbarSheetAdmin = () => {
  const { data } = useSession();
  const [isOwner, setIsOwner] = useState<boolean>()
  const handleLogoutClick = () => signOut();

  const fetchOwner = async () => {
    const owner = await getOwner(data?.user.email!);
    setIsOwner(owner);
  };

  useEffect(() => {
    fetchOwner();
  }, []);

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
        ) : null}
      </div>

      <div className="px-5 flex flex-col gap-2 border-b border-solid pb-5">
        <Button
          className="gap-2 justify-start"
          variant="ghost"
          render={<SheetClose />}
        >
          <HomeIcon />
          <Link href="/admin/dashboard">Dashboard</Link>
        </Button>
        
        <Button
          className="gap-2 justify-start"
          variant="ghost"
          render={<SheetClose />}
        >
          <BookUser />
          <Link href="/admin/professionals">Profissionais</Link>
        </Button>

        {isOwner && (
          <Button
            className="gap-2 justify-start"
            variant="ghost"
            render={<SheetClose />}
          >
            <LockIcon />
            <Link href="/admin/owners">Administradores</Link>
          </Button>
        )}
      </div>

      <div className="px-5 flex flex-col border-b border-solid pb-5">
        <Button
          className="py-5 justify-start gap-2"
          onClick={handleLogoutClick}
        >
          <LogOutIcon size={18} />
          Sair da sessão
        </Button>
      </div>
    </SheetContent>
  );
};

export default SiderbarSheetAdmin;
