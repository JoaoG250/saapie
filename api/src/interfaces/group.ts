import { Group, Prisma } from "@prisma/client";
import { IRepository } from ".";

export interface IGroupRepository extends IRepository<Group> {
  findOne(where: Prisma.GroupWhereUniqueInput): Promise<Group | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GroupWhereUniqueInput;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }): Promise<Group[]>;
  create(data: Prisma.GroupCreateInput): Promise<Group>;
  update(
    where: Prisma.GroupWhereUniqueInput,
    data: Prisma.GroupUpdateInput
  ): Promise<Group>;
  delete(where: Prisma.GroupWhereUniqueInput): Promise<Group>;
}

export interface CreateGroupDto {
  name: string;
}

export interface UpdateGroupDto {
  name: string;
}
