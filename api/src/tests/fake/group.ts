import { Group } from "@prisma/client";

const fakeGroups = [
  {
    id: "5e115b1a-924f-4b70-bb4a-932a742fd421",
    createdAt: new Date("2021-10-02T06:51:36.952Z"),
    updatedAt: new Date("2022-06-17T13:12:12.767Z"),
    name: "LAUDANTIUM",
  },
  {
    id: "e087480b-17e4-45c5-9366-809f1e712a3e",
    createdAt: new Date("2021-08-31T10:25:40.014Z"),
    updatedAt: new Date("2022-06-17T18:09:38.729Z"),
    name: "VOLUPTATEM",
  },
  {
    id: "eadc8a4a-b3b4-4ae4-a3e7-b24cb06d5e81",
    createdAt: new Date("2022-03-17T11:07:37.707Z"),
    updatedAt: new Date("2022-06-17T05:15:33.518Z"),
    name: "REICIENDIS",
  },
  {
    id: "671fe05b-4c58-4d23-90a5-212d1cc43981",
    createdAt: new Date("2022-01-11T07:42:03.227Z"),
    updatedAt: new Date("2022-06-17T01:45:15.707Z"),
    name: "VOLUPTATEM",
  },
  {
    id: "71602dd1-be00-470c-93f6-f7d72658d47b",
    createdAt: new Date("2021-11-11T15:36:19.787Z"),
    updatedAt: new Date("2022-06-17T04:56:58.642Z"),
    name: "DISTINCTIO",
  },
  {
    id: "9c1cffb9-d7b8-4d0d-bf80-dd5525e3ef22",
    createdAt: new Date("2021-07-19T19:21:21.482Z"),
    updatedAt: new Date("2022-06-16T23:27:31.303Z"),
    name: "ARCHITECTO",
  },
];

interface CreateFakeGroupArgs {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
}

export function createFakeGroup(
  args: CreateFakeGroupArgs,
  seed: number
): Group {
  const group = fakeGroups[seed % fakeGroups.length];
  return {
    ...group,
    ...args,
  };
}
