import { Group, Prisma } from "@prisma/client";
import { IGroupRepository, IUseCase } from "../../../interfaces";

export class GetGroupUseCase
  implements IUseCase<Prisma.GroupWhereUniqueInput, Group | null>
{
  constructor(private readonly groupRepository: IGroupRepository) {}

  execute(args: Prisma.GroupWhereUniqueInput): Promise<Group | null> {
    return this.groupRepository.findOne(args);
  }
}
