import { AuthenticationError, UserInputError } from "apollo-server-express";
import { arg, extendType, idArg, list, nullable, stringArg } from "nexus";
import { ValidationError } from "yup";
import {
  GroupNotFoundError,
  IntegrityError,
  ProcessNotFoundError,
  UserNotFoundError,
} from "../../errors";
import {
  createProcessRequestUseCase,
  createProcessUseCase,
  deleteProcessUseCase,
  updateProcessUseCase,
} from "../../useCases/process";
import { removeNullability } from "../../utils";

export const ProcessMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createProcess", {
      type: "Process",
      args: {
        data: arg({ type: "CreateProcessInput" }),
      },
      async resolve(_root, args) {
        try {
          return await createProcessUseCase.execute({
            ...args.data,
            forwardToGroupId: removeNullability(args.data.forwardToGroupId),
          });
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof GroupNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("updateProcess", {
      type: "Process",
      args: {
        id: idArg(),
        data: arg({ type: "UpdateProcessInput" }),
      },
      async resolve(_root, args) {
        try {
          return await updateProcessUseCase.execute({
            id: args.id,
            data: {
              ...args.data,
              forwardToGroupId: removeNullability(args.data.forwardToGroupId),
            },
          });
        } catch (err) {
          if (err instanceof ValidationError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof ProcessNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof GroupNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("deleteProcess", {
      type: "Process",
      args: {
        id: idArg(),
      },
      async resolve(_root, args) {
        try {
          return await deleteProcessUseCase.execute(args);
        } catch (err) {
          if (err instanceof ProcessNotFoundError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
    t.field("createProcessRequest", {
      type: "ProcessRequest",
      args: {
        processId: nullable(idArg()),
        processSlug: nullable(stringArg()),
        data: arg({ type: "JSON" }),
        attachments: nullable(list(arg({ type: "Upload" }))),
      },
      async resolve(_root, args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("Not Authorised!");
        }
        if (!args.processId && !args.processSlug) {
          throw new UserInputError(
            "Must provide either a processId or processSlug"
          );
        }

        try {
          return await createProcessRequestUseCase.execute({
            processId: removeNullability(args.processId),
            processSlug: removeNullability(args.processSlug),
            attachments: removeNullability(args.attachments),
            userId: ctx.user.id,
            data: args.data,
          });
        } catch (err) {
          if (err instanceof UserNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof ProcessNotFoundError) {
            throw new UserInputError(err.message);
          }
          if (err instanceof IntegrityError) {
            throw new UserInputError(err.message);
          }
          throw err;
        }
      },
    });
  },
});
