import {
  IGroupRepository,
  IGroupService,
  IUserRepository,
} from "../interfaces";

export class GroupService implements IGroupService {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async addUserToGroup(userId: string, groupId: string): Promise<void> {
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
  }

  async removeUserFromGroup(userId: string, groupId: string): Promise<void> {
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
  }
}
