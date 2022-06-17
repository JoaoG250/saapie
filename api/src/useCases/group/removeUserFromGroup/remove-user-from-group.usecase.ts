import {
  IGroupRepository,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { RemoveUserFromGroupDto } from "./remove-user-from-group.dto";

export class RemoveUserFromGroupUseCase
  implements IUseCase<RemoveUserFromGroupDto, true>
{
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(args: RemoveUserFromGroupDto): Promise<true> {
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
      { users: { disconnect: { id: userId } } }
    );
    return true;
  }
}
