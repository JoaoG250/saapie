import { UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { getGroupsUseCase, getGroupUseCase } from "../../useCases/group";
import { parsePaginationArgs } from "../../utils";

export const groupQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("group", {
      type: "Group",
      args: {
        id: idArg(),
      },
      async resolve(_root, args) {
        const group = await getGroupUseCase.execute(args);
        if (!group) {
          throw new UserInputError("Group not found");
        }
        return group;
      },
    });
    t.connectionField("groups", {
      type: "Group",
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        return getGroupsUseCase.execute({ ...pagination });
      },
    });
  },
});
