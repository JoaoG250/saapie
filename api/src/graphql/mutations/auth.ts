import { ValidationError } from "yup";
import { extendType, stringArg } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-express";
import {
  IntegrityError,
  InvalidTokenError,
  SigninError,
  UserNotFoundError,
} from "../../errors";
import {
  activateAccountUseCase,
  refreshTokensUseCase,
  resetPasswordUseCase,
  sendPasswordResetEmailUseCase,
  userSigninUseCase,
  userSignupUseCase,
} from "../../useCases/auth";

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
          if (err instanceof InvalidTokenError) {
            throw new ForbiddenError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("activateAccount", {
      type: "Boolean",
      args: {
        token: stringArg(),
      },
      async resolve(_root, args) {
        try {
          return await activateAccountUseCase.execute(args);
        } catch (err) {
          if (err instanceof InvalidTokenError) {
            throw new ForbiddenError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("sendPasswordResetEmail", {
      type: "Boolean",
      args: {
        email: stringArg(),
      },
      async resolve(_root, args) {
        try {
          return await sendPasswordResetEmailUseCase.execute(args);
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof UserNotFoundError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("resetPassword", {
      type: "Boolean",
      args: {
        token: stringArg(),
        password: stringArg(),
      },
      async resolve(_root, args) {
        try {
          return await resetPasswordUseCase.execute(args);
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof InvalidTokenError) {
            throw new ForbiddenError(err.message);
          }
          throw err;
        }
      },
    });
  },
});
