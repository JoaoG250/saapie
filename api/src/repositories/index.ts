import prisma from "../db";
import redis from "../redis";
import { GroupRepository } from "./group";
import { JwtRepository } from "./jwt";
import { UserRepository } from "./user";

export const jwtRepository = new JwtRepository(redis);
export const userRepository = new UserRepository(prisma);
export const groupRepository = new GroupRepository(prisma);
