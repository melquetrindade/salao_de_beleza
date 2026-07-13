"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import cloudinary from "../_lib/cloudinary";

export const deleteProfessional = async (professionalId: string, oldImagePublicId: string | null) => {
    
    // Remove a imagem do cloudinary
    if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
    }

    await db.profissional.delete({
        where: {
            id: professionalId
        },
    })

    revalidatePath('/admin/professionals')
}
