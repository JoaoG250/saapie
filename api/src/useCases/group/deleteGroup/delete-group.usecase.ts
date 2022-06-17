import { Group } from "@prisma/client";
import { IGroupRepository, IUseCase } from "../../../interfaces";
import { DeleteGroupDto } from "./delete-group.dto";

export class DeleteGroupUseCase implements IUseCase<DeleteGroupDto, Group> {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(args: DeleteGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOne(args);
    if (!group) {
      throw new Error("Group not found");
    }
    return this.groupRepository.delete(args);
  }
}
