import { UserInputError } from "apollo-server-express";
import { arg, extendType, idArg } from "nexus";
import { ValidationError } from "yup";
import { IntegrityError, UserNotFoundError } from "../../errors";
import { updateUserUseCase } from "../../useCases/user";

export const userMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUser", {
      type: "User",
      args: {
        id: idArg(),
        data: arg({ type: "UpdateUserInput" }),
      },
      async resolve(_root, args) {
        try {
          return await updateUserUseCase.execute(args);
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof UserNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
  },
});
