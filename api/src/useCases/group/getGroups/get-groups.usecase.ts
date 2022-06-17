import { Group, Prisma } from "@prisma/client";
import { IGroupRepository, IUseCase } from "../../../interfaces";

export class GetGroupsUseCase
  implements
    IUseCase<
      {
        skip?: number;
        take?: number;
        cursor?: Prisma.GroupWhereUniqueInput;
        where?: Prisma.GroupWhereInput;
        orderBy?: Prisma.GroupOrderByWithRelationInput;
      },
      Group[]
    >
{
  constructor(private readonly groupRepository: IGroupRepository) {}

  execute(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GroupWhereUniqueInput;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }): Promise<Group[]> {
    return this.groupRepository.findMany(args);
  }
}
