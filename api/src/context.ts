import { ExpressJwtContext, GraphQLContext } from "./types";
import prisma from "./db";
import redis from "./redis";

export function buildContext({ req }: ExpressJwtContext): GraphQLContext {
  return {
    redis,
    prisma,
    ip: req.ip,
    user: req.auth,
  };
}
