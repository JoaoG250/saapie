import { Process } from "@prisma/client";
import { faker } from "@faker-js/faker";

faker.lorem.paragraph;

const fakeProcesses: Process[] = [
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.787Z"),
    updatedAt: new Date("2022-06-26T23:50:47.913Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "Dolorem ad molestias sed qui repellendus. Assumenda consequatur temporibus nisi quod rerum accusantium sunt officia.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.788Z"),
    updatedAt: new Date("2022-06-26T23:50:47.914Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "Possimus architecto commodi nesciunt ullam optio. Quis blanditiis occaecati est. Vitae dolorem sit nisi.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.789Z"),
    updatedAt: new Date("2022-06-26T23:50:47.915Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "Esse repellendus ut. Quidem accusamus itaque et animi debitis ut animi. Autem nihil in quo.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.790Z"),
    updatedAt: new Date("2022-06-26T23:50:47.916Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "ccusantium sapiente magni inventore distinctio dolore dicta consequatur. Soluta est officia.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.791Z"),
    updatedAt: new Date("2022-06-26T23:50:47.917Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "Numquam quia ut earum nostrum aut fugit est quia earum. Est maiores aut autem. Est deleniti non dolorem officiis exercitationem cum qui veniam.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.796Z"),
    updatedAt: new Date("2022-06-26T23:50:47.922Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "Quia nihil commodi accusamus voluptatem aut. Odit architecto omnis doloribus alias corporis sint nisi autem ut.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
];

interface CreateFakeProcessArgs {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  slug?: string;
  targetGroupId?: string;
  forwardToGroupId?: string;
}

export function createFakeProcess(
  args: CreateFakeProcessArgs,
  seed: number
): Process {
  const process = fakeProcesses[seed % fakeProcesses.length];
  return {
    ...process,
    ...args,
  };
}
