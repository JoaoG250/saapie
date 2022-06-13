import { ExpressJwtContext, GraphQLContext } from "./types";
import { UserRepository } from "./repositories/user";
import { AuthService } from "./services/auth";
import prisma from "./db";
import { GmailMailProvider } from "./providers/mail";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  const mailProvider = new GmailMailProvider();
  const userRepository = new UserRepository(prisma);
  const authService = new AuthService(userRepository, mailProvider);
  return {
    user: req.auth,
    authService,
  };
}
