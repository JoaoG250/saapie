import { UserInputError } from "apollo-server-express";
import { arg, extendType, idArg } from "nexus";
import { ValidationError } from "yup";
import { GroupNotFoundError, IntegrityError } from "../../errors";
import {
  createGroupUseCase,
  deleteGroupUseCase,
  updateGroupUseCase,
} from "../../useCases/group";

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
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("updateGroup", {
      type: "Group",
      args: {
        id: idArg(),
        data: arg({ type: "UpdateGroupInput" }),
      },
      async resolve(_root, args) {
        try {
          return await updateGroupUseCase.execute(args);
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof GroupNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("deleteGroup", {
      type: "Group",
      args: {
        id: idArg(),
      },
      async resolve(_root, args) {
        try {
          return await deleteGroupUseCase.execute(args);
        } catch (err) {
          if (err instanceof GroupNotFoundError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
  },
});
