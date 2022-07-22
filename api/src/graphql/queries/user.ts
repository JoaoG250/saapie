import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import { UserNotFoundError } from "../../errors";
import { getUsersUseCase, getUserUseCase } from "../../useCases/user";
import { parsePaginationArgs, removeNullability } from "../../utils";

export const userQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: "User",
      async resolve(_root, _args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("Not Authorised!");
        }
        const user = await getUserUseCase.execute({ id: ctx.user.id });
        if (!user) {
          throw new UserNotFoundError("User not found");
        }
        return user;
      },
    });
    t.nullable.field("user", {
      type: "User",
      args: {
        id: idArg(),
      },
      resolve(_root, args) {
        return getUserUseCase.execute(args);
      },
    });
    t.connectionField("users", {
      type: "User",
      additionalArgs: {
        where: nullable(arg({ type: "UserWhereInput" })),
        orderBy: nullable(arg({ type: "UserOrderByInput" })),
      },
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        let where: Prisma.UserWhereInput | undefined;
        if (args.where) {
          where = {};
          if (args.where.email) {
            where.email = { contains: args.where.email, mode: "insensitive" };
          }
        }
        let orderBy: Prisma.UserOrderByWithRelationInput = {
          createdAt: "desc",
        };
        if (args.orderBy) {
          orderBy = {};
          orderBy.createdAt = removeNullability(args.orderBy.createdAt);
          orderBy.updatedAt = removeNullability(args.orderBy.updatedAt);
          orderBy.email = removeNullability(args.orderBy.email);
          orderBy.isActive = removeNullability(args.orderBy.isActive);
          orderBy.isVerified = removeNullability(args.orderBy.isVerified);
        }
        return getUsersUseCase.execute({ where, orderBy, ...pagination });
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (_root, _args, ctx) => ctx.prisma.user.count(),
        });
      },
    });
    t.field("isEmailAvailable", {
      type: "Boolean",
      args: {
        email: stringArg(),
      },
      async resolve(_root, args) {
        const user = await getUserUseCase.execute({ email: args.email });
        return !user;
      },
    });
  },
});
