import { UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { getUsersUseCase, getUserUseCase } from "../../useCases/user";
import { parsePaginationArgs } from "../../utils";

export const userQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: idArg(),
      },
      async resolve(_root, args) {
        const user = await getUserUseCase.execute(args);
        if (!user) {
          throw new UserInputError("User not found");
        }
        return user;
      },
    });
    t.connectionField("users", {
      type: "User",
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        return getUsersUseCase.execute({ ...pagination });
      },
    });
  },
});
