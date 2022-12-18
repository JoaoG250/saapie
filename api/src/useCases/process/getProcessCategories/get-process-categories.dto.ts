import { Prisma } from "@prisma/client";

export interface GetProcessCategoriesDto {
  skip?: number;
  take?: number;
  cursor?: Prisma.ProcessCategoryWhereUniqueInput;
  where?: Prisma.ProcessCategoryWhereInput;
  orderBy?: Prisma.ProcessCategoryOrderByWithRelationInput;
}
