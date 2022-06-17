import { ExpressJwtContext, GraphQLContext } from "./types";
import { UserRepository } from "./repositories/user";
import prisma from "./db";
import { GroupRepository } from "./repositories/group";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  const userRepository = new UserRepository(prisma);
  const groupRepository = new GroupRepository(prisma);
  return {
    user: req.auth,
    userRepository,
    groupRepository,
  };
}
