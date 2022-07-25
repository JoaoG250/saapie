import { Prisma } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import {
  getProcessesUseCase,
  getProcessUseCase,
  getProcessRequestUseCase,
  getProcessRequestsUseCase,
} from "../../useCases/process";
import { parsePaginationArgs, removeNullability } from "../../utils";
import { userIsAdmin } from "../../utils";

export const processQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("process", {
      type: "Process",
      args: {
        id: nullable(idArg()),
        slug: nullable(stringArg()),
      },
      resolve(_root, args) {
        if (!args.id && !args.slug) {
          throw new UserInputError("Must provide an id or slug");
        }
        return getProcessUseCase.execute({
          id: removeNullability(args.id),
          slug: removeNullability(args.slug),
        });
      },
    });
    t.connectionField("processes", {
      type: "Process",
      additionalArgs: {
        where: nullable(arg({ type: "ProcessWhereInput" })),
        orderBy: nullable(arg({ type: "ProcessOrderByInput" })),
      },
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        let where: Prisma.ProcessWhereInput | undefined;
        if (args.where) {
          where = {};
          if (args.where.name) {
            where.name = { contains: args.where.name, mode: "insensitive" };
          }
        }
        let orderBy: Prisma.ProcessOrderByWithRelationInput = {
          createdAt: "desc",
        };
        if (args.orderBy) {
          orderBy = {};
          orderBy.createdAt = removeNullability(args.orderBy.createdAt);
          orderBy.updatedAt = removeNullability(args.orderBy.updatedAt);
          orderBy.name = removeNullability(args.orderBy.name);
        }
        return getProcessesUseCase.execute({ ...pagination, where, orderBy });
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (_root, _args, ctx) => ctx.prisma.process.count(),
        });
      },
    });
    t.nullable.field("processRequest", {
      type: "ProcessRequest",
      args: {
        id: idArg(),
      },
      resolve(_root, args) {
        return getProcessRequestUseCase.execute(args);
      },
    });
    t.connectionField("processRequests", {
      type: "ProcessRequest",
      additionalArgs: {
        where: nullable(arg({ type: "ProcessRequestWhereInput" })),
        orderBy: nullable(arg({ type: "ProcessRequestOrderByInput" })),
      },
      nodes(_root, args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("Not Authorised!");
        }
        const pagination = parsePaginationArgs(args);
        let where: Prisma.ProcessRequestWhereInput = {
          userId: ctx.user.id,
        };
        if (args.where && userIsAdmin(ctx.user)) {
          where = {};
          where.userId = removeNullability(args.where.userId);
          where.processId = removeNullability(args.where.processId);
          where.status = removeNullability(args.where.status);
        }
        let orderBy: Prisma.ProcessRequestOrderByWithRelationInput = {
          createdAt: "desc",
        };
        if (args.orderBy) {
          orderBy = {};
          orderBy.createdAt = removeNullability(args.orderBy.createdAt);
          orderBy.updatedAt = removeNullability(args.orderBy.updatedAt);
          orderBy.status = removeNullability(args.orderBy.status);
        }
        return getProcessRequestsUseCase.execute({
          ...pagination,
          where,
          orderBy,
        });
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (_root, _args, ctx) => ctx.prisma.processRequest.count(),
        });
      },
    });
    t.connectionField("assignedProcessRequests", {
      type: "ProcessRequest",
      nodes(_root, args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("Not Authorised!");
        }
        const pagination = parsePaginationArgs(args);
        const OR = ctx.user.groups.map((group) => {
          return { name: group };
        });
        const where: Prisma.ProcessRequestWhereInput = {
          status: { in: ["OPEN", "PENDING_CHANGE"] },
          process: { targetGroup: { OR } },
        };
        const orderBy: Prisma.ProcessRequestOrderByWithRelationInput = {
          createdAt: "desc",
        };
        return getProcessRequestsUseCase.execute({
          ...pagination,
          where,
          orderBy,
        });
      },
    });
    t.connectionField("forwardedProcessRequests", {
      type: "ProcessRequest",
      nodes(_root, args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("Not Authorised!");
        }
        const pagination = parsePaginationArgs(args);
        const OR = ctx.user.groups.map((group) => {
          return { name: group };
        });
        const where: Prisma.ProcessRequestWhereInput = {
          status: "FORWARDED",
          process: { forwardToGroup: { OR } },
        };
        const orderBy: Prisma.ProcessRequestOrderByWithRelationInput = {
          createdAt: "desc",
        };
        return getProcessRequestsUseCase.execute({
          ...pagination,
          where,
          orderBy,
        });
      },
    });
  },
});
