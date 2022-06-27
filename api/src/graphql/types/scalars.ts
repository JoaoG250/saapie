import { asNexusMethod } from "nexus";
import { GraphQLDateTime, GraphQLJSON } from "graphql-scalars";

export const DateTime = asNexusMethod(GraphQLDateTime, "dateTime");
export const JSON = asNexusMethod(GraphQLJSON, "json");
