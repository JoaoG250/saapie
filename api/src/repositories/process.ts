import { Prisma, PrismaClient, Process } from "@prisma/client";
import { IProcessRepository } from "../interfaces";

export class ProcessRepository implements IProcessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(
    where: Prisma.ProcessWhereUniqueInput
  ): Promise<Process | null> {
    return this.prisma.process.findUnique({ where });
  }

  async findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessWhereUniqueInput;
    where?: Prisma.ProcessWhereInput;
    orderBy?: Prisma.ProcessOrderByWithRelationInput;
  }): Promise<Process[]> {
    return this.prisma.process.findMany({
      skip: args.skip,
      take: args.take,
      cursor: args.cursor,
      where: args.where,
      orderBy: args.orderBy,
    });
  }

  async create(data: Prisma.ProcessCreateInput): Promise<Process> {
    return this.prisma.process.create({ data });
  }

  async update(
    where: Prisma.ProcessWhereUniqueInput,
    data: Prisma.ProcessUpdateInput
  ): Promise<Process> {
    return this.prisma.process.update({ where, data });
  }

  async delete(where: Prisma.ProcessWhereUniqueInput): Promise<Process> {
    return this.prisma.process.delete({ where });
  }
}
