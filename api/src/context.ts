import { ExpressJwtContext, GraphQLContext } from "./types";
import { UserRepository } from "./repositories/user";
import { AuthService } from "./services/auth";
import prisma from "./db";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  const userRepository = new UserRepository(prisma);
  const authService = new AuthService(userRepository);
  return {
    user: req.auth,
    authService,
  };
}
