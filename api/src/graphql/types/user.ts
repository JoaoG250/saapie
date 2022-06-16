import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
  },
});
