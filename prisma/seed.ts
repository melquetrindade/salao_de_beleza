const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "melquetrindade654@gmail.com";

  const administradorExistente = await prisma.administrador.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (administradorExistente) {
    console.log("Seed já executada anteriormente.");
    return;
  }

  await prisma.barbearia.create({
    data: {
      nome: "Salão de Beleza",
      endereco: "Rua Brasilino Gomes Meira, Nº 311",
      imgURL: "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
      administradores: {
        create: {
          nome: "Melque Trindade",
          email: adminEmail,
        },
      },
    },
  });

  console.log("✅ Seed executada com sucesso!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
