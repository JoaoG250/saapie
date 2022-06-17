import prisma from "../db";
import { GroupRepository } from "./group";
import { UserRepository } from "./user";

export const userRepository = new UserRepository(prisma);
export const groupRepository = new GroupRepository(prisma);
