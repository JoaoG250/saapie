import { Prisma, PrismaClient, User } from "@prisma/client";
import { IRepository } from "../interfaces";

export class UserRepository
  implements
    IRepository<
      User,
      Prisma.UserWhereInput,
      Prisma.UserWhereUniqueInput,
      Prisma.UserOrderByWithRelationInput,
      Prisma.UserCreateInput,
      Prisma.UserUpdateInput
    >
{
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async findMany(args: {
    where: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
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
}
