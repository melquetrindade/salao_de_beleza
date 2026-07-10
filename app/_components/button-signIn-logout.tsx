"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import {LogOutIcon} from "lucide-react"

const ButtonSigninLogout = () => {
    const {data} = useSession()
    const handleLoginWithGoogleClick = () => signIn("google")

    const handleLogoutClick = () => signOut()

    return (
        <>
            {data?.user ? (
                <Button className="mt-6 gap-3" onClick={handleLogoutClick}>
                    <LogOutIcon size={18}/>
                    Sair da conta
                </Button>
            ) : (
                <Button className="mt-6 gap-3" onClick={handleLoginWithGoogleClick}>
                    <Image alt="logo_google" src="/google.svg" height={20} width={20} />
                    Google
                </Button>
            )}
        </>
        
    );
}

export default ButtonSigninLogout;