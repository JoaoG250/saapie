import { enumType } from "nexus";

export const SortOrderInput = enumType({
  name: "SortOrderInput",
  members: ["asc", "desc"],
});
