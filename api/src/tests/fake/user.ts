import { User } from "@prisma/client";

const fakeUsers = [
  {
    id: "3be7cf06-1c4a-40df-9bd6-b80711f8d1d6",
    createdAt: new Date("2021-11-26T08:51:22.376Z"),
    updatedAt: new Date("2022-06-16T21:41:07.798Z"),
    firstName: "Dorthy",
    lastName: "Frami",
    email: "Shanny39@hotmail.com",
    password: "ZE5kuog4DuacfWW",
    isActive: false,
    isVerified: false,
  },
  {
    id: "bc0b9dd9-5ca8-45f1-8bd5-b092209b0130",
    createdAt: new Date("2022-05-12T07:39:02.938Z"),
    updatedAt: new Date("2022-06-17T17:46:06.793Z"),
    firstName: "Mariah",
    lastName: "Schneider",
    email: "Hyman_Powlowski@gmail.com",
    password: "cniWUL9uz4CTQbZ",
    isActive: false,
    isVerified: true,
  },
  {
    id: "0a671b73-d83f-4f50-b041-cd8c2366d55a",
    createdAt: new Date("2022-01-06T02:10:11.118Z"),
    updatedAt: new Date("2022-06-17T12:11:56.011Z"),
    firstName: "Denis",
    lastName: "Strosin",
    email: "Stephany99@gmail.com",
    password: "AtCZVdzuGTyXZxO",
    isActive: true,
    isVerified: false,
  },
  {
    id: "6589f0e4-ab69-4bef-b571-af00c304b224",
    createdAt: new Date("2021-12-21T16:09:17.935Z"),
    updatedAt: new Date("2022-06-17T09:28:20.997Z"),
    firstName: "Laisha",
    lastName: "Carroll",
    email: "Brianne.Von65@hotmail.com",
    password: "YoSqOaqR9XKSYA_",
    isActive: true,
    isVerified: true,
  },
  {
    id: "8cfb13bf-1eb2-4c4b-bf6d-d4ea5ba83439",
    createdAt: new Date("2022-02-11T14:05:28.143Z"),
    updatedAt: new Date("2022-06-17T08:43:52.296Z"),
    firstName: "Lesly",
    lastName: "Kuphal",
    email: "Josefina_Mayert@hotmail.com",
    password: "c_VsA789kVeYy18",
    isActive: true,
    isVerified: false,
  },
  {
    id: "54b09b7b-bcaf-4713-a55b-e4f1a7eb7866",
    createdAt: new Date("2021-10-20T17:37:02.796Z"),
    updatedAt: new Date("2022-06-17T13:22:26.063Z"),
    firstName: "Barrett",
    lastName: "Carroll",
    email: "Ruben.Hagenes88@hotmail.com",
    password: "ZAZ3E0gPm97ON3F",
    isActive: false,
    isVerified: false,
  },
];

interface CreateFakeUserArgs {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export function createFakeUser(args: CreateFakeUserArgs, seed: number): User {
  const user = fakeUsers[seed % fakeUsers.length];
  return {
    ...user,
    ...args,
  };
}
