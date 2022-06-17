import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.list.field("groups", {
      type: "Group",
      resolve(root, args, ctx) {
        return ctx.prisma.user
          .findUnique({
            where: { id: root.id },
          })
          .groups();
      },
    });
  },
});
