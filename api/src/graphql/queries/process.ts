import { Prisma } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { extendType, idArg, nullable, stringArg } from "nexus";
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
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        return getProcessesUseCase.execute({ ...pagination });
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
      nodes(_root, args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("Not Authorised!");
        }
        const pagination = parsePaginationArgs(args);
        let where: Prisma.ProcessRequestWhereInput | undefined = undefined;
        if (!userIsAdmin(ctx.user)) {
          where = {
            userId: ctx.user.id,
          };
        }
        return getProcessRequestsUseCase.execute({ ...pagination, where });
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
          process: { targetGroup: { OR } },
        };
        return getProcessRequestsUseCase.execute({ ...pagination, where });
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
        return getProcessRequestsUseCase.execute({ ...pagination, where });
      },
    });
  },
});
