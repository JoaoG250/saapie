import * as yup from "yup";
import { IntegrityError } from "../errors";
import {
  CreateGroupDto,
  IGroupRepository,
  IGroupService,
  IUserRepository,
  UpdateGroupDto,
} from "../interfaces";

export class GroupService implements IGroupService {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository
  ) {}
  async validateCreateGroupData(data: CreateGroupDto): Promise<CreateGroupDto> {
    const createGroupDataConstraints = yup.object().shape({
      name: yup
        .string()
        .required()
        .min(3)
        .max(30)
        .matches(
          /^[A-Z]+(?:(_)[A-Z]+)*$/,
          'you must use capital letters and "_" as separator. No spaces allowed.'
        )
        .trim(),
    });
    return createGroupDataConstraints.validate(data);
  }

  async checkGroupUniqueFields(
    data: CreateGroupDto | UpdateGroupDto
  ): Promise<true> {
    const matchingGroups = await this.groupRepository.findMany({
      where: {
        OR: { name: data.name },
      },
    });
    matchingGroups.forEach((group) => {
      if (group.name === data.name) {
        throw new IntegrityError("Name already exists");
      }
    });
    return true;
  }

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
