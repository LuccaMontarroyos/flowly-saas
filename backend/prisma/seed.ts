import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const company = await prisma.company.create({
    data: {
      name: 'Flowly Demo Corp',
      slug: 'flowly-demo',
    },
  });

  const password = await argon2.hash('123456');
  const admin = await prisma.user.create({
    data: {
      name: 'Flowly Admin',
      email: 'admin@flowly.com',
      password,
      role: Role.ADMIN,
      companyId: company.id,
    },
  });

  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Novo site institucional em Next.js',
      companyId: company.id,
      ownerId: admin.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Configurar Tailwind',
        status: TaskStatus.DONE,
        projectId: project1.id,
        companyId: company.id,
        assigneeId: admin.id,
      },
      {
        title: 'Criar Componentes UI',
        status: TaskStatus.IN_PROGRESS,
        projectId: project1.id,
        companyId: company.id,
        assigneeId: admin.id,
      },
      {
        title: 'Integrar API',
        status: TaskStatus.TODO,
        projectId: project1.id,
        companyId: company.id,
      },
    ],
  });

  console.log('Seeding finished. ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });