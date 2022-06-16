import { Group, Prisma, PrismaClient } from "@prisma/client";
import { IGroupRepository } from "../interfaces";

export class GroupRepository implements IGroupRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(where: Prisma.GroupWhereUniqueInput): Promise<Group | null> {
    return this.prisma.group.findUnique({ where });
  }

  async findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GroupWhereUniqueInput;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput | undefined;
  }): Promise<Group[]> {
    return this.prisma.group.findMany({
      where: args.where,
      orderBy: args.orderBy,
    });
  }

  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    return this.prisma.group.create({ data });
  }

  async update(
    where: Prisma.GroupWhereUniqueInput,
    data: Prisma.GroupUpdateInput
  ): Promise<Group> {
    return this.prisma.group.update({ where, data });
  }

  async delete(where: Prisma.GroupWhereUniqueInput): Promise<Group> {
    return this.prisma.group.delete({ where });
  }
}
