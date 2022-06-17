import { Request } from "express";
import { ExpressContext } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

interface UserFromRequest {
  id: string;
}

interface JwtRequest extends Request {
  auth?: UserFromRequest | undefined;
}

interface ExpressJwtContext extends ExpressContext {
  req: JwtRequest;
}

interface GraphQLContext {
  user?: UserFromRequest;
  prisma: PrismaClient;
  redis: Redis;
}
