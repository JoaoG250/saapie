import { ExpressJwtContext, GraphQLContext } from "./types";
import { UserRepository } from "./repositories/user";
import { AuthService } from "./services/auth";
import { GmailMailProvider } from "./providers/mail";
import { JwtService } from "./services/jwt";
import { JwtRepository } from "./repositories/jwt";
import prisma from "./db";
import redis from "./redis";
import { GroupRepository } from "./repositories/group";
import { GroupService } from "./services/group";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  const mailProvider = new GmailMailProvider();
  const jwtRepository = new JwtRepository(redis);
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prisma);
  const groupRepository = new GroupRepository(prisma);
  const groupService = new GroupService(groupRepository, userRepository);
  const authService = new AuthService(userRepository, mailProvider, jwtService);
  return {
    user: req.auth,
    userRepository,
    groupRepository,
    authService,
    groupService,
  };
}
