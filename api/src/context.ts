import { ExpressJwtContext, GraphQLContext } from "./types";
import prisma from "./db";
import redis from "./redis";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  return {
    redis,
    prisma,
    user: req.auth,
  };
}
