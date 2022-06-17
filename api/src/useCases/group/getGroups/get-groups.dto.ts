import { Prisma } from "@prisma/client";

export interface GetGroupsDto {
  skip?: number;
  take?: number;
  cursor?: Prisma.GroupWhereUniqueInput;
  where?: Prisma.GroupWhereInput;
  orderBy?: Prisma.GroupOrderByWithRelationInput;
}
