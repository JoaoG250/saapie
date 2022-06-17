import { inputObjectType, objectType } from "nexus";

export const Group = objectType({
  name: "Group",
  definition(t) {
    t.id("id");
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
