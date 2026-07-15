"use client"

import { getAdmin } from "@/app/_actions/get-admin";
import { Administrador } from "@prisma/client";
import { useEffect, useState } from "react";

const ListAdmin = () => {
    const [administrators, setAdministrators] = useState<Administrador[]>([])

    const fetchAdministrators = async () => {
        const listAdministrators = await getAdmin();
        setAdministrators(listAdministrators)
    }

    useEffect(() => {
        fetchAdministrators();
    }, []);

    return (
        <div className="p-5">
            {administrators.length > 0 ? (
                <h1>Existem {administrators.length} administradores</h1>
            ) : (
                <h1>Não existem administradores</h1>
            )}
        </div>
    );
}
 
export default ListAdmin;