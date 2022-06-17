import { Group } from "@prisma/client";
import { IGroupRepository, IUseCase } from "../../../interfaces";
import { GetGroupsDto } from "./get-groups.dto";

export class GetGroupsUseCase implements IUseCase<GetGroupsDto, Group[]> {
  constructor(private readonly groupRepository: IGroupRepository) {}

  execute(args: GetGroupsDto): Promise<Group[]> {
    return this.groupRepository.findMany(args);
  }
}
