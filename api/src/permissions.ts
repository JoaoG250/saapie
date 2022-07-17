import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-express";
import { and, rule, shield } from "graphql-shield";
import { GraphQLContext } from "./types";

const isAuthenticated = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user) {
    return true;
  }
  return new AuthenticationError("Not Authorised!");
});

const isAdmin = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user?.groups.includes("ADMINISTRATORS")) {
    return true;
  }
  return new ForbiddenError("Not Authorised!");
});

export const permissions = shield(
  {
    Query: {
      me: isAuthenticated,
      user: and(isAuthenticated, isAdmin),
      users: and(isAuthenticated, isAdmin),
      group: and(isAuthenticated, isAdmin),
      groups: and(isAuthenticated, isAdmin),
      process: and(isAuthenticated, isAdmin),
      processes: and(isAuthenticated, isAdmin),
      processRequest: isAuthenticated,
      processRequests: isAuthenticated,
    },
    Mutation: {
      createUser: and(isAuthenticated, isAdmin),
      updateUser: and(isAuthenticated, isAdmin),
      deleteUser: and(isAuthenticated, isAdmin),
      createGroup: and(isAuthenticated, isAdmin),
      updateGroup: and(isAuthenticated, isAdmin),
      deleteGroup: and(isAuthenticated, isAdmin),
      addUserToGroup: and(isAuthenticated, isAdmin),
      removeUserFromGroup: and(isAuthenticated, isAdmin),
      createProcess: and(isAuthenticated, isAdmin),
      updateProcess: and(isAuthenticated, isAdmin),
      deleteProcess: and(isAuthenticated, isAdmin),
      createProcessRequest: isAuthenticated,
      deleteProcessRequest: and(isAuthenticated, isAdmin),
    },
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
