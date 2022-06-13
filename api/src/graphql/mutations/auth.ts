import { ValidationError } from "yup";
import { extendType, stringArg } from "nexus";
import { UserInputError } from "apollo-server-express";
import { IntegrityError } from "../../errors";

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
      async resolve(_root, args, ctx) {
        try {
          return await ctx.authService.userSignup(args);
        } catch (err) {
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          } else if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          } else {
            throw err;
          }
        }
      },
    });
    t.field("signin", {
      type: "AuthTokens",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const user = await ctx.authService.validateUser(args);

        if (!user) {
          throw new UserInputError("Invalid credentials");
        }

        return ctx.authService.userSignin(user);
      },
    });
  },
});
