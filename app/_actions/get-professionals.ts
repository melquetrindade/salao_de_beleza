"use server"

import {db} from '../_lib/prisma'

export const getProfessionals = async () => {
    const professionals = await db.profissional.findMany()
    return professionals
}