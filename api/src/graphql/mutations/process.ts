import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import { arg, extendType, idArg, list } from "nexus";
import { ValidationError } from "yup";
import {
  GroupNotFoundError,
  IntegrityError,
  ProcessNotFoundError,
} from "../../errors";
import {
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
        data: arg({ type: "CreateProcessRequestInput" }),
        attachments: list(arg({ type: "Upload" })),
      },
      async resolve(_root, args) {
        console.log(args.data);

        args.attachments.map(async (attachment: FileUpload) => {
          const { createReadStream, filename, mimetype, encoding } =
            await attachment;
          console.log(filename);
        });
      },
    });
  },
});
