import { ExpressJwtContext, GraphQLContext } from "./types";
import { UserRepository } from "./repositories/user";
import { AuthService } from "./services/auth";
import { GmailMailProvider } from "./providers/mail";
import { JwtService } from "./services/jwt";
import { JwtRepository } from "./repositories/jwt";
import prisma from "./db";
import redis from "./redis";
import { GroupRepository } from "./repositories/group";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  const mailProvider = new GmailMailProvider();
  const jwtRepository = new JwtRepository(redis);
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prisma);
  const groupRepository = new GroupRepository(prisma);
  const authService = new AuthService(userRepository, mailProvider, jwtService);
  return {
    user: req.auth,
    userRepository,
    groupRepository,
    authService,
  };
}
