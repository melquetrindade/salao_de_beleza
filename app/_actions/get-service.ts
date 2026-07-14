"use server";

import { db } from "../_lib/prisma";

export const getServices = async (professionalId: string) => {
  const services = await db.servico.findMany({
    where: {
      profissionalId: professionalId,
    },
  });

  return services.map((service) => ({
    ...service,
    preco: Number(service.preco),
  }));
};
