import { extendType, idArg } from "nexus";
import { getProcessesUseCase, getProcessUseCase } from "../../useCases/process";
import { parsePaginationArgs } from "../../utils";

export const processQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("process", {
      type: "Process",
      args: {
        id: idArg(),
      },
      resolve(_root, args) {
        return getProcessUseCase.execute(args);
      },
    });
    t.connectionField("processes", {
      type: "Process",
      nodes(_root, args) {
        const pagination = parsePaginationArgs(args);
        return getProcessesUseCase.execute({ ...pagination });
      },
      extendConnection(t) {
        t.int("totalCount", {
          resolve: (_root, _args, ctx) => ctx.prisma.process.count(),
        });
      },
    });
  },
});
