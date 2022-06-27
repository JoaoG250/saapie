import { Prisma, Process } from "@prisma/client";
import { IRepository } from ".";

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
}
