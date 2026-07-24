"use server"

import { getServerSession } from "next-auth"
import { db } from "../_lib/prisma"
import { authOptions } from "../_lib/auth"

export const getAgendamentosConfirmad = async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return []
    }

    const agendamentos = await db.agendamento.findMany({
        where: {
            usuarioId: session.user.id,
            disponibilidade: {
                data: {
                    gte: new Date(),
                },
            },
        },
        include: {
            servico: true,
            disponibilidade: {
                include: {
                    profissional: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return agendamentos
}
