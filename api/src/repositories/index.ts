import prisma from "../db";
import redis from "../redis";
import { GroupRepository } from "./group";
import { JwtRepository } from "./jwt";
import {
  ProcessCategoryRepository,
  ProcessRepository,
  ProcessRequestAttachmentRepository,
  ProcessRequestRepository,
} from "./process";
import { UserRepository } from "./user";
import { storageProvider } from "../providers";

export const jwtRepository = new JwtRepository(redis);
export const userRepository = new UserRepository(prisma);
export const groupRepository = new GroupRepository(prisma);
export const processRepository = new ProcessRepository(prisma);
export const processRequestRepository = new ProcessRequestRepository(
  prisma,
  storageProvider
);
export const processRequestAttachmentRepository =
  new ProcessRequestAttachmentRepository(prisma, storageProvider);
export const processCategoryRepository = new ProcessCategoryRepository(prisma);
