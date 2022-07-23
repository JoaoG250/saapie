import { inputObjectType, objectType } from "nexus";

export const Group = objectType({
  name: "Group",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.string("name");
  },
});

export const CreateGroupInput = inputObjectType({
  name: "CreateGroupInput",
  definition(t) {
    t.string("name");
  },
});

export const UpdateGroupInput = inputObjectType({
  name: "UpdateGroupInput",
  definition(t) {
    t.string("name");
  },
});

export const GroupWhereInput = inputObjectType({
  name: "GroupWhereInput",
  definition(t) {
    t.nullable.string("name");
  },
});

export const GroupOrderByInput = inputObjectType({
  name: "GroupOrderByInput",
  definition(t) {
    t.nullable.field("createdAt", { type: "SortOrderInput" });
    t.nullable.field("updatedAt", { type: "SortOrderInput" });
    t.nullable.field("name", { type: "SortOrderInput" });
  },
});
