import { extendType, idArg } from "nexus";
import { getUsersUseCase, getUserUseCase } from "../../useCases/user";
import { parsePaginationArgs } from "../../utils";

export const userQueries = extendType({
  type: "Query",
  definition(t) {
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
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        return getUsersUseCase.execute({ ...pagination });
      },
    });
  },
});
