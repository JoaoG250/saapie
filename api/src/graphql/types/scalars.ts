import { asNexusMethod } from "nexus";
import { GraphQLUpload } from "graphql-upload";
import { GraphQLDateTime, GraphQLJSON } from "graphql-scalars";

export const Upload = asNexusMethod(GraphQLUpload, "upload");
export const DateTime = asNexusMethod(GraphQLDateTime, "dateTime");
export const JSON = asNexusMethod(GraphQLJSON, "json");
