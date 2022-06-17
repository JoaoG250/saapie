import {
  IGroupRepository,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { AddUserToGroupDto } from "./add-user-to-group.dto";

export class AddUserToGroupUseCase
  implements IUseCase<AddUserToGroupDto, true>
{
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(args: AddUserToGroupDto): Promise<true> {
    const { userId, groupId } = args;
    const group = await this.groupRepository.findOne({
      id: groupId,
    });
    if (!group) {
      throw new Error("Group not found");
    }
    const user = await this.userRepository.findOne({
      id: userId,
    });
    if (!user) {
      throw new Error("User not found");
    }
    await this.groupRepository.update(
      { id: groupId },
      { users: { connect: { id: userId } } }
    );
    return true;
  }
}
