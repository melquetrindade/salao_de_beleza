"use server"

import {db} from '../_lib/prisma'
import { startOfDay, endOfDay } from "date-fns"

interface GetDisponibilidadeProps {
    selectedDay: Date,
    professionalId: string
}

export const getDisponibilidade = async ({selectedDay, professionalId}: GetDisponibilidadeProps) => {
    const disponibilidade = await db.disponibilidade.findMany({
        where: {
            profissionalId: professionalId,
            data: {
                gte: startOfDay(selectedDay),
                lte: endOfDay(selectedDay),
            }
        },
        orderBy: {
            horaInicio: "asc"
        }
    })

    return disponibilidade
}
