import { UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { parsePaginationArgs } from "../../utils/prisma";

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
    t.connectionField("users", {
      type: "User",
      nodes(_root, args, ctx) {
        const pagination = parsePaginationArgs(args);
        return ctx.userRepository.findMany({ ...pagination });
      },
    });
  },
});
