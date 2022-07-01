import { join } from "path";
import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from "nexus";
import { ForbiddenError } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./permissions";
import { validatePaginationArgs } from "./utils";
import * as types from "./graphql";

const nexusSchema = makeSchema({
  types,
  plugins: [
    fieldAuthorizePlugin({
      formatError: (authConfig) => {
        return new ForbiddenError(authConfig.error.message);
      },
    }),
    connectionPlugin({
      cursorFromNode: (node) => node.id,
      validateArgs(args) {
        validatePaginationArgs(args);
      },
    }),
  ],
  nonNullDefaults: {
    input: true,
    output: true,
  },
  outputs: {
    typegen: join(__dirname, "/generated/nexus-types.gen.ts"),
    schema: join(__dirname, "../schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "types/index.d.ts"),
    export: "GraphQLContext",
  },
  shouldExitAfterGenerateArtifacts: process.argv.includes("--nexus-exit"),
});

export const schema = applyMiddleware(nexusSchema, permissions);
