import { extendType, idArg } from "nexus";
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
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        return getGroupsUseCase.execute({ ...pagination });
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (_root, _args, ctx) => ctx.prisma.group.count(),
        });
      },
    });
  },
});
