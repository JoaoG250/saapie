import { Prisma } from "@prisma/client";

export interface GetProcessRequestsDto {
  skip?: number;
  take?: number;
  cursor?: Prisma.ProcessRequestWhereUniqueInput;
  where?: Prisma.ProcessRequestWhereInput;
  orderBy?: Prisma.ProcessRequestOrderByWithRelationInput;
}
