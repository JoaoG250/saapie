import { ValidationError } from "yup";
import { extendType, stringArg } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-express";
import { IntegrityError } from "../../errors";
import {
  refreshTokensUseCase,
  userSigninUseCase,
  userSignupUseCase,
} from "../../useCases/auth";
import { SigninError } from "../../useCases/auth/userSignin/user-signin.usecase";

export const authMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signup", {
      type: "Boolean",
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      async resolve(_root, args) {
        try {
          return await userSignupUseCase.execute(args);
        } catch (err) {
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("signin", {
      type: "AuthTokens",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      async resolve(_root, args) {
        try {
          return await userSigninUseCase.execute(args);
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof SigninError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("refreshTokens", {
      type: "AuthTokens",
      args: {
        refreshToken: stringArg(),
      },
      async resolve(_root, args) {
        try {
          return await refreshTokensUseCase.execute(args);
        } catch (err) {
          if (err instanceof Error) {
            throw new ForbiddenError(err.message);
          } else {
            throw err;
          }
        }
      },
    });
  },
});
