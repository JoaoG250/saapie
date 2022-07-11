import { enumType, inputObjectType, objectType } from "nexus";

export const ProcessForm = objectType({
  name: "ProcessForm",
  definition(t) {
    t.id("id");
    t.string("name");
    t.json("definition");
  },
});

export const Process = objectType({
  name: "Process",
  definition(t) {
    t.id("id");
    t.string("name");
    t.string("slug");
    t.string("description");
    t.string("targetGroupId");
    t.field("targetGroup", {
      type: "Group",
      async resolve(root, _args, ctx) {
        const group = await ctx.prisma.process
          .findUnique({
            where: { id: root.id },
          })
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
          .findUnique({
            where: { id: root.id },
          })
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

export const ProcessRequest = objectType({
  name: "ProcessRequest",
  definition(t) {
    t.id("id");
    t.field("status", { type: "ProcessRequestStatus" });
    t.string("processId");
    t.string("userId");
    t.json("data");
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
    t.id("targetGroupId");
    t.nullable.id("forwardToGroupId");
    t.field("form", { type: "UpdateProcessFormInput" });
  },
});
