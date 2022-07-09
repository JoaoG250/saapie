import bcrypt from "bcrypt";
import readline from "readline";
import prisma from "../db";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdministrator(): Promise<void> {
  const firstName = await askQuestion("First name: ");
  const lastName = await askQuestion("Last name: ");
  const email = await askQuestion("Email: ");
  const password = await askQuestion("Password: ");

  const group = await prisma.group.upsert({
    where: { name: "ADMINISTRATORS" },
    create: { name: "ADMINISTRATORS" },
    update: {},
  });

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: passwordHash,
      isActive: true,
      isVerified: true,
      groups: { connect: { id: group.id } },
    },
  });
  rl.close();
}

rl.on("close", function () {
  process.exit(0);
});

createAdministrator();
