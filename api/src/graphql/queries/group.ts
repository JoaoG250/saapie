import { Prisma } from "@prisma/client";
import { arg, extendType, idArg, nullable } from "nexus";
import { getGroupsUseCase, getGroupUseCase } from "../../useCases/group";
import { parsePaginationArgs } from "../../utils";

export const groupQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("group", {
      type: "Group",
      args: {
        id: idArg(),
      },
      resolve(_root, args) {
        return getGroupUseCase.execute(args);
      },
    });
    t.connectionField("groups", {
      type: "Group",
      additionalArgs: {
        where: nullable(arg({ type: "GroupWhereInput" })),
      },
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        let where: Prisma.GroupWhereInput | undefined;
        if (args.where) {
          where = {};
          if (args.where.name) {
            where.name = { contains: args.where.name, mode: "insensitive" };
          }
        }
        return getGroupsUseCase.execute({ where, ...pagination });
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (_root, _args, ctx) => ctx.prisma.group.count(),
        });
      },
    });
  },
});
