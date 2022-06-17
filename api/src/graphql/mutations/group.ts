import { UserInputError } from "apollo-server-express";
import { arg, extendType } from "nexus";
import { createGroupUseCase } from "../../useCases/group";

export const groupMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGroup", {
      type: "Group",
      args: {
        data: arg({ type: "CreateGroupInput" }),
      },
      async resolve(_root, { data }) {
        try {
          return await createGroupUseCase.execute(data);
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
