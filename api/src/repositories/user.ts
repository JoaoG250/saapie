import { Group, Prisma, PrismaClient, User } from "@prisma/client";
import { IUserRepository, UserWithGroups } from "../interfaces";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: args.skip,
      take: args.take,
      cursor: args.cursor,
      where: args.where,
      orderBy: args.orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.prisma.user.update({ where, data });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }

  async findOneWithGroups(
    where: Prisma.UserWhereUniqueInput
  ): Promise<UserWithGroups | null> {
    return this.prisma.user.findUnique({
      where,
      include: { groups: true },
    });
  }

  async getUserGroups(where: Prisma.UserWhereUniqueInput): Promise<Group[]> {
    return this.prisma.user.findUnique({ where }).groups();
  }
}
