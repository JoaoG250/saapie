import { UserInputError } from "apollo-server-express";
import { arg, extendType } from "nexus";

export const groupMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGroup", {
      type: "Group",
      args: {
        data: arg({ type: "CreateGroupInput" }),
      },
      async resolve(_root, { data }, ctx) {
        try {
          return await ctx.groupService.createGroup(data);
        } catch (err) {
          if (err instanceof Error) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
  },
});
