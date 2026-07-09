"use client"

import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react"

const ButtonLogout = () => {
    const handleLogoutClick = () => signOut()
    return (
        <div>
            <Button onClick={handleLogoutClick}>
                <p>Sair da sessão</p>
            </Button>
        </div>
    );
}
 
export default ButtonLogout;