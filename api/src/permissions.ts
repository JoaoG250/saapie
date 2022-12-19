import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-express";
import { and, or, rule, shield } from "graphql-shield";
import { GraphQLContext } from "./types";
import {
  userIsAdmin,
  userIsFromProcessGroups,
  userIsSuperAdmin,
} from "./utils";
import { createRateLimitRule, RedisStore } from "graphql-rate-limit";
import redis from "./redis";

const isAuthenticated = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user) {
    return true;
  }
  return new AuthenticationError("Not Authorised!");
});

const isAdmin = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user && userIsAdmin(ctx.user)) {
    return true;
  }
  return new ForbiddenError("Not Authorised!");
});

const isSuperAdmin = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user && userIsSuperAdmin(ctx.user)) {
    return true;
  }
  return new ForbiddenError("Not Authorised!");
});

const isProcessRequestOwner = rule()(
  async (_root, args, ctx: GraphQLContext) => {
    const processRequest = await ctx.prisma.processRequest.findUnique({
      where: { id: args.id },
    });
    if (processRequest?.userId === ctx.user?.id) {
      return true;
    }
    return new ForbiddenError("Not Authorised!");
  }
);

const hasProcessRequestPermission = rule()(
  async (_root, args, ctx: GraphQLContext) => {
    const processRequest = await ctx.prisma.processRequest.findUnique({
      where: { id: args.id },
      include: {
        process: { include: { targetGroup: true, forwardToGroup: true } },
      },
    });
    if (ctx.user && processRequest) {
      if (ctx.user.id === processRequest.userId) {
        return true;
      }
      if (userIsFromProcessGroups(ctx.user, processRequest.process)) {
        return true;
      }
    }
    return new ForbiddenError("Not Authorised!");
  }
);

const isFromProcessRequestGroups = rule()(
  async (_root, args, ctx: GraphQLContext) => {
    const id = args.id || args.processId;
    const processRequest = await ctx.prisma.processRequest.findUnique({
      where: { id },
      include: {
        process: { include: { targetGroup: true, forwardToGroup: true } },
      },
    });
    if (
      ctx.user &&
      processRequest &&
      userIsFromProcessGroups(ctx.user, processRequest.process)
    ) {
      return true;
    }
    return new ForbiddenError("Not Authorised!");
  }
);

const isUserInGroup = rule()((_root, _args, ctx: GraphQLContext) => {
  if (ctx.user?.groups.length) {
    return true;
  }
  return new ForbiddenError("Not Authorised!");
});

const rateLimitRule = createRateLimitRule({
  identifyContext: (ctx: GraphQLContext) => ctx.ip,
  createError: (message: string) => new ForbiddenError(message),
  store: new RedisStore(redis),
});

export const permissions = shield(
  {
    Query: {
      me: and(isAuthenticated, rateLimitRule({ window: "30m", max: 200 })),
      user: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      users: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      isEmailAvailable: rateLimitRule({ window: "1h", max: 100 }),
      group: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      groups: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      process: and(isAuthenticated, rateLimitRule({ window: "1h", max: 100 })),
      processes: and(
        isAuthenticated,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      processRequest: and(
        isAuthenticated,
        or(isAdmin, hasProcessRequestPermission),
        rateLimitRule({ window: "1h", max: 100 })
      ),
      processRequests: and(
        isAuthenticated,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      assignedProcessRequests: and(
        isAuthenticated,
        isUserInGroup,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      forwardedProcessRequests: and(
        isAuthenticated,
        isUserInGroup,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      closedProcessRequests: and(
        isAuthenticated,
        isUserInGroup,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      processCategory: and(
        isAuthenticated,
        rateLimitRule({ window: "1h", max: 100 })
      ),
      processCategories: and(
        isAuthenticated,
        rateLimitRule({ window: "1h", max: 100 })
      ),
    },
    Mutation: {
      signup: rateLimitRule({ window: "5m", max: 3 }),
      signin: rateLimitRule({ window: "1h", max: 10 }),
      refreshTokens: rateLimitRule({ window: "1h", max: 30 }),
      activateAccount: rateLimitRule({ window: "30m", max: 5 }),
      sendPasswordResetEmail: rateLimitRule({ window: "5m", max: 3 }),
      resetPassword: rateLimitRule({ window: "5m", max: 3 }),
      createUser: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      updateUser: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      deleteUser: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      createGroup: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      updateGroup: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      deleteGroup: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      addUserToGroup: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      removeUserFromGroup: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      createProcess: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      updateProcess: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      deleteProcess: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      createProcessRequest: and(
        isAuthenticated,
        rateLimitRule({ window: "30m", max: 10 })
      ),
      updateProcessRequest: and(
        isAuthenticated,
        or(isAdmin, isProcessRequestOwner),
        rateLimitRule({ window: "30m", max: 20 })
      ),
      deleteProcessRequest: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      updateProcessRequestStatus: and(
        isAuthenticated,
        isFromProcessRequestGroups,
        rateLimitRule({ window: "30m", max: 200 })
      ),
      addProcessRequestExtraAttachment: and(
        isAuthenticated,
        isFromProcessRequestGroups,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      removeProcessRequestExtraAttachment: and(
        isAuthenticated,
        isFromProcessRequestGroups,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      createProcessCategory: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      updateProcessCategory: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      deleteProcessCategory: and(
        isAuthenticated,
        isAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      addProcessToCategory: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
      removeProcessFromCategory: and(
        isAuthenticated,
        isSuperAdmin,
        rateLimitRule({ window: "30m", max: 100 })
      ),
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
