import { inputObjectType, objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.boolean("isActive");
    t.boolean("isVerified");
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

export const CreateUserInput = inputObjectType({
  name: "CreateUserInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.string("password");
    t.boolean("isActive");
    t.boolean("isVerified");
  },
});

export const UpdateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.boolean("isActive");
    t.boolean("isVerified");
  },
});

export const UserWhereInput = inputObjectType({
  name: "UserWhereInput",
  definition(t) {
    t.nullable.string("email");
  },
});

export const UserOrderByInput = inputObjectType({
  name: "UserOrderByInput",
  definition(t) {
    t.nullable.field("createdAt", { type: "SortOrderInput" });
    t.nullable.field("updatedAt", { type: "SortOrderInput" });
    t.nullable.field("email", { type: "SortOrderInput" });
    t.nullable.field("isActive", { type: "SortOrderInput" });
    t.nullable.field("isVerified", { type: "SortOrderInput" });
  },
});
