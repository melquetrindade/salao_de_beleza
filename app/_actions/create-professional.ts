"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import { getBarbearia } from './get-barbearia'

interface CreateProfessionalProps {
    nome: string,
    telefone: string,
    imgURL: string
}

export const createProfessional = async (params: CreateProfessionalProps) => {
    const hasProfessional = await db.profissional.findFirst({
        where: {
            telefone: params.telefone
        }
    })

    if(hasProfessional){
        throw new Error('Já existe um profissional cadastrado com este telefone!')
    }

    const barbeariaID = await getBarbearia()

    if (!barbeariaID?.id) {
        throw new Error('Barbearia não encontrada!')
    }

    const newProfessional = await db.profissional.create({
        data: {
            nome: params.nome,
            telefone: params.telefone,
            imgURL: params.imgURL,
            barbeariaId: barbeariaID.id
        }
    })

    revalidatePath('/admin/professionals')
    return newProfessional
}
