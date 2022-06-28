import { Prisma } from "@prisma/client";

export interface GetProcessesDto {
  skip?: number;
  take?: number;
  cursor?: Prisma.ProcessWhereUniqueInput;
  where?: Prisma.ProcessWhereInput;
  orderBy?: Prisma.ProcessOrderByWithRelationInput;
}
