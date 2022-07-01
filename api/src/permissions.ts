import { ApolloError, AuthenticationError } from "apollo-server-express";
import { rule, shield } from "graphql-shield";
import { GraphQLContext } from "./types";

const isAuthenticated = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user) {
    return true;
  }
  return new AuthenticationError("Not Authorised!");
});

export const permissions = shield(
  {
    Query: {
      user: isAuthenticated,
      users: isAuthenticated,
      group: isAuthenticated,
      groups: isAuthenticated,
      process: isAuthenticated,
      processes: isAuthenticated,
    },
    Mutation: {},
  },
  {
    fallbackError: (thrownError) => {
      if (thrownError instanceof ApolloError) {
        // Expected errors
        return thrownError;
      } else if (thrownError instanceof Error) {
        // Unexpected errors
        console.error(thrownError);
        return new ApolloError("Internal server error");
      } else {
        // Unknown errors
        console.error("The resolver threw something that is not an error.");
        console.error(thrownError);
        return new ApolloError("Internal server error");
      }
    },
  }
);
