import { Group, Prisma, User } from "@prisma/client";
import { IRepository } from ".";

export type UserWithGroups = User & { groups: Group[] };

export interface IUserRepository extends IRepository<User> {
  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null>;
  findMany(args: {
    where: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User>;
  delete(where: Prisma.UserWhereUniqueInput): Promise<User>;
  findOneWithGroups(
    where: Prisma.UserWhereUniqueInput
  ): Promise<UserWithGroups | null>;
  getUserGroups(where: Prisma.UserWhereUniqueInput): Promise<Group[]>;
}

export interface UserSignupDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserSigninDto {
  email: string;
  password: string;
}
