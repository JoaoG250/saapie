import { Group, Prisma, Process } from "@prisma/client";
import { IRepository } from ".";

export type ProcessWithGroups = Process & {
  targetGroup: Group;
  forwardToGroup: Group | null;
};

export interface IProcessRepository extends IRepository<Process> {
  findOne(where: Prisma.ProcessWhereUniqueInput): Promise<Process | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessWhereUniqueInput;
    where?: Prisma.ProcessWhereInput;
    orderBy?: Prisma.ProcessOrderByWithRelationInput;
  }): Promise<Process[]>;
  create(data: Prisma.ProcessCreateInput): Promise<Process>;
  update(
    where: Prisma.ProcessWhereUniqueInput,
    data: Prisma.ProcessUpdateInput
  ): Promise<Process>;
  delete(where: Prisma.ProcessWhereUniqueInput): Promise<Process>;
  findOneWithGroups(
    where: Prisma.ProcessWhereUniqueInput
  ): Promise<ProcessWithGroups | null>;
}
