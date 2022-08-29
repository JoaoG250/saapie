import { Process, ProcessRequest, ProcessRequestStatus } from "@prisma/client";
import { FormKitData } from "../../interfaces";

const fakeProcesses: Process[] = [
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.787Z"),
    updatedAt: new Date("2022-06-26T23:50:47.913Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    description:
      "Dolorem ad molestias sed qui repellendus. Assumenda consequatur temporibus nisi quod rerum accusantium sunt officia.",
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
  {
    id: "f2316265-a6e8-4d65-a837-e308ae67862f",
    createdAt: new Date("2022-04-16T11:09:31.791Z"),
    updatedAt: new Date("2022-06-26T23:50:47.917Z"),
    name: "Repellat quisquam recusandae alias consequuntur corporis.",
    slug: "repellat-quisquam-recusandae-alias-consequuntur-corporis",
    active: true,
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
    active: true,
    description:
      "Quia nihil commodi accusamus voluptatem aut. Odit architecto omnis doloribus alias corporis sint nisi autem ut.",
    targetGroupId: "cbfc51b8-eded-41d0-820e-a196af683b45",
    forwardToGroupId: "2acd600c-9fab-4447-8311-77e14e412801",
  },
];

const fakeProccessRequests: ProcessRequest[] = [
  {
    id: "8ae2d983-c210-4f75-8400-898b3ad1b35e",
    createdAt: new Date("2022-01-09T05:14:53.931Z"),
    updatedAt: new Date("2022-07-10T22:18:49.427Z"),
    processId: "706a6826-29f3-42c0-aa9e-ed8242941d23",
    status: "PENDING_CHANGE",
    userId: "64d35d81-154e-49ad-929b-daa09386ed1b",
    data: {},
  },
  {
    id: "f16921e9-9a86-4545-85a5-8690c463ead7",
    createdAt: new Date("2021-07-29T19:52:59.972Z"),
    updatedAt: new Date("2022-07-10T06:03:33.016Z"),
    processId: "f06d165b-6705-4dfa-8796-2da53b9d1628",
    status: "PENDING_CHANGE",
    userId: "91fd9e92-2dbf-4431-8f38-34c203195e0d",
    data: {},
  },
  {
    id: "5364c017-6ffe-474e-a6c6-fb08dcff8d78",
    createdAt: new Date("2022-03-19T15:58:58.210Z"),
    updatedAt: new Date("2022-07-10T00:55:39.369Z"),
    processId: "9e3c70be-4594-48c1-be79-84d616b7aa6e",
    status: "PENDING_CHANGE",
    userId: "f4ab5773-e0fe-45b8-96fe-43c16f18cf3d",
    data: {},
  },
  {
    id: "b862bc2d-7aa2-4b16-8091-5c52407e3262",
    createdAt: new Date("2022-06-17T02:48:48.864Z"),
    updatedAt: new Date("2022-07-10T15:47:30.206Z"),
    processId: "acdf9c81-87bd-4666-9278-92208348c177",
    status: "FORWARDED",
    userId: "26696fde-b363-4945-952a-64a2e4ea50b9",
    data: {},
  },
  {
    id: "ffdf9d8d-d0bb-40e4-be2d-a8b525c7e1f9",
    createdAt: new Date("2021-12-27T19:07:31.341Z"),
    updatedAt: new Date("2022-07-10T18:10:01.767Z"),
    processId: "55453946-2bac-4736-b443-7fce2afd974b",
    status: "CLOSED",
    userId: "80db709b-7a0e-477e-935e-52e7d2b86dc3",
    data: {},
  },
  {
    id: "2393784f-5f41-46cc-8a12-f7999f9d36b2",
    createdAt: new Date("2021-10-07T10:33:42.733Z"),
    updatedAt: new Date("2022-07-10T20:14:51.519Z"),
    processId: "892fc74c-e422-4485-b88c-c006db8ca559",
    status: "FORWARDED",
    userId: "8c733f06-28fa-450b-b98a-43106c30f928",
    data: {},
  },
];

interface CreateFakeProcessArgs {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  slug?: string;
  active?: boolean;
  targetGroupId?: string;
  forwardToGroupId?: string | null;
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

interface CreateFakeProcessRequestArgs {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  processId?: string;
  userId?: string;
  status?: ProcessRequestStatus;
  data?: FormKitData;
}

export function createFakeProcessRequest(
  args: CreateFakeProcessRequestArgs,
  seed: number
): ProcessRequest {
  const processRequest =
    fakeProccessRequests[seed % fakeProccessRequests.length];
  return {
    ...processRequest,
    ...args,
  };
}
