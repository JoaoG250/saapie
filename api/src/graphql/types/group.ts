import { objectType } from "nexus";

export const Group = objectType({
  name: "Group",
  definition(t) {
    t.id("id");
    t.string("name");
  },
});
