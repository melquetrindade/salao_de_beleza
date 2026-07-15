"use server"

import {db} from '../_lib/prisma'

export const getProfessionals = async () => {
    const professionals = await db.profissional.findMany()
    return professionals
}

export const getProfessional = async (id: string) => {
    const professional = await db.profissional.findUnique({
        where: {
            id
        }
    })
    return professional
}