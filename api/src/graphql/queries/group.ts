import { UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { parsePaginationArgs } from "../../utils/prisma";

export const groupQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("group", {
      type: "Group",
      args: {
        id: idArg(),
      },
      async resolve(_root, args, ctx) {
        const group = await ctx.groupRepository.findOne(args);
        if (!group) {
          throw new UserInputError("Group not found");
        }
        return group;
      },
    });
    t.connectionField("groups", {
      type: "Group",
      nodes(_root, args, ctx) {
        const pagination = parsePaginationArgs(args);
        return ctx.groupRepository.findMany({ ...pagination });
      },
    });
  },
});
