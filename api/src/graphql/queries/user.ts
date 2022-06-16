import { UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";

export const userQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: idArg(),
      },
      async resolve(_root, args, ctx) {
        const user = await ctx.userRepository.findOne(args);
        if (!user) {
          throw new UserInputError("User not found");
        }
        return user;
      },
    });
  },
});
