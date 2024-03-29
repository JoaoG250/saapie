import { enumType, inputObjectType, objectType } from "nexus";

export const ProcessForm = objectType({
  name: "ProcessForm",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.string("name");
    t.json("definition");
  },
});

export const ProcessWithoutRelations = objectType({
  name: "ProcessWithoutRelations",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.string("name");
    t.string("slug");
    t.string("description");
    t.boolean("active");
    t.string("targetGroupId");
    t.nullable.string("forwardToGroupId");
  },
});

export const Process = objectType({
  name: "Process",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.string("name");
    t.string("slug");
    t.string("description");
    t.boolean("active");
    t.string("targetGroupId");
    t.field("targetGroup", {
      type: "Group",
      async resolve(root, _args, ctx) {
        const group = await ctx.prisma.process
          .findUnique({ where: { id: root.id } })
          .targetGroup();
        if (!group) {
          throw new Error("Target group not found");
        }
        return group;
      },
    });
    t.nullable.string("forwardToGroupId");
    t.nullable.field("forwardToGroup", {
      type: "Group",
      resolve(root, _args, ctx) {
        return ctx.prisma.process
          .findUnique({ where: { id: root.id } })
          .forwardToGroup();
      },
    });
    t.nullable.field("form", {
      type: "ProcessForm",
      resolve(root, args, ctx) {
        return ctx.prisma.process
          .findUnique({
            where: { id: root.id },
          })
          .form();
      },
    });
  },
});

export const ProcessRequestStatus = enumType({
  name: "ProcessRequestStatus",
  members: ["OPEN", "FORWARDED", "PENDING_CHANGE", "CLOSED"],
});

export const ProcessRequestWithoutRelations = objectType({
  name: "ProcessRequestWithoutRelations",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.field("status", { type: "ProcessRequestStatus" });
    t.string("processId");
    t.string("userId");
    t.json("data");
  },
});

export const ProcessRequest = objectType({
  name: "ProcessRequest",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.field("status", { type: "ProcessRequestStatus" });
    t.string("processId");
    t.field("process", {
      type: "Process",
      async resolve(root, _args, ctx) {
        const process = await ctx.prisma.processRequest
          .findUnique({ where: { id: root.id } })
          .process();
        if (!process) {
          throw new Error("Process not found");
        }
        return process;
      },
    });
    t.string("userId");
    t.field("user", {
      type: "User",
      async resolve(root, _args, ctx) {
        const user = await ctx.prisma.processRequest
          .findUnique({ where: { id: root.id } })
          .user();
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
    });
    t.json("data");
  },
});

export const ProcessCategory = objectType({
  name: "ProcessCategory",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.string("name");
    t.string("slug");
    t.nullable.string("description");
    t.list.field("processes", {
      type: "Process",
      resolve(root, args, ctx) {
        return ctx.prisma.processCategory
          .findUnique({ where: { id: root.id } })
          .processes();
      },
    });
  },
});

export const ProcessCategoryWithoutRelations = objectType({
  name: "ProcessCategoryWithoutRelations",
  definition(t) {
    t.id("id");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.string("name");
    t.string("slug");
    t.nullable.string("description");
  },
});

export const CreateProcessFormInput = inputObjectType({
  name: "CreateProcessFormInput",
  definition(t) {
    t.string("name");
    t.json("definition");
  },
});

export const CreateProcessInput = inputObjectType({
  name: "CreateProcessInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.id("targetGroupId");
    t.nullable.id("forwardToGroupId");
    t.field("form", { type: "CreateProcessFormInput" });
  },
});

export const UpdateProcessFormInput = inputObjectType({
  name: "UpdateProcessFormInput",
  definition(t) {
    t.string("name");
    t.json("definition");
  },
});

export const UpdateProcessInput = inputObjectType({
  name: "UpdateProcessInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.boolean("active");
    t.id("targetGroupId");
    t.nullable.id("forwardToGroupId");
    t.field("form", { type: "UpdateProcessFormInput" });
  },
});

export const ProcessOrderByInput = inputObjectType({
  name: "ProcessOrderByInput",
  definition(t) {
    t.nullable.field("createdAt", { type: "SortOrderInput" });
    t.nullable.field("updatedAt", { type: "SortOrderInput" });
    t.nullable.field("name", { type: "SortOrderInput" });
  },
});

export const ProcessRequestOrderByInput = inputObjectType({
  name: "ProcessRequestOrderByInput",
  definition(t) {
    t.nullable.field("createdAt", { type: "SortOrderInput" });
    t.nullable.field("updatedAt", { type: "SortOrderInput" });
    t.nullable.field("status", { type: "SortOrderInput" });
  },
});

export const ProcessRequestWhereInput = inputObjectType({
  name: "ProcessRequestWhereInput",
  definition(t) {
    t.nullable.string("processId");
    t.nullable.string("userId");
    t.nullable.field("status", { type: "ProcessRequestStatus" });
  },
});

export const ProcessWhereInput = inputObjectType({
  name: "ProcessWhereInput",
  definition(t) {
    t.nullable.string("name");
    t.nullable.string("processCategory");
  },
});

export const CreateProcessCategoryInput = inputObjectType({
  name: "CreateProcessCategoryInput",
  definition(t) {
    t.string("name");
    t.string("description");
  },
});

export const UpdateProcessCategoryInput = inputObjectType({
  name: "UpdateProcessCategoryInput",
  definition(t) {
    t.string("name");
    t.string("description");
  },
});

export const ProcessCategoryWhereInput = inputObjectType({
  name: "ProcessCategoryWhereInput",
  definition(t) {
    t.nullable.string("name");
  },
});
