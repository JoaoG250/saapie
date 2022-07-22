import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";
const prisma = new PrismaClient();

async function main(): Promise<void> {
  faker.seed(1);

  const adminGroup = await prisma.group.findUnique({
    where: {
      name: "ADMINISTRATORS",
    },
  });
  if (!adminGroup) {
    throw new Error("Admin group not found");
  }

  // Creating fake processes
  const processes = [];
  for (let i = 0; i < 10; i++) {
    const name = faker.name.jobTitle();
    const process = await prisma.process.create({
      data: {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        description: faker.lorem.paragraph(),
        form: {
          create: {
            name,
            definition: [
              {
                name: "nome",
                label: "Nome",
                $formkit: "text",
                validation: "required",
                bind: "$nome",
              },
            ],
          },
        },
        targetGroup: { connect: { id: adminGroup.id } },
      },
    });
    processes.push(process);
  }

  // Creating fake users
  const users = [];
  const processRequests = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    users.push(user);

    // Creating fake process requests
    for (const process of processes) {
      const processRequest = await prisma.processRequest.create({
        data: {
          user: { connect: { id: user.id } },
          process: { connect: { id: process.id } },
          data: { nome: user.firstName },
        },
      });
      processRequests.push(processRequest);
    }
  }

  console.log(
    `Created ${processes.length} processes`,
    `\nCreated ${users.length} users`,
    `\nCreated ${processRequests.length} process requests`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
