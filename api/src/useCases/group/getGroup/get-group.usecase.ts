import { Group } from "@prisma/client";
import { IGroupRepository, IUseCase } from "../../../interfaces";
import { GetGroupDto } from "./get-group.dto";

export class GetGroupUseCase implements IUseCase<GetGroupDto, Group | null> {
  constructor(private readonly groupRepository: IGroupRepository) {}

  execute(args: GetGroupDto): Promise<Group | null> {
    return this.groupRepository.findOne(args);
  }
}
