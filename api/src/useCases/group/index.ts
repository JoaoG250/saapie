import { groupRepository, userRepository } from "../../repositories";
import { AddUserToGroupUseCase } from "./addUserToGroup/add-user-to-group.usecase";
import { CreateGroupUseCase } from "./createGroup/create-group.usecase";
import { DeleteGroupUseCase } from "./deleteGroup/delete-group.usecase";
import { GetGroupUseCase } from "./getGroup/get-group.usecase";
import { GetGroupsUseCase } from "./getGroups/get-groups.usecase";
import { RemoveUserFromGroupUseCase } from "./removeUserFromGroup/remove-user-from-group.usecase";

const getGroupUseCase = new GetGroupUseCase(groupRepository);
const getGroupsUseCase = new GetGroupsUseCase(groupRepository);
const createGroupUseCase = new CreateGroupUseCase(groupRepository);
const deleteGroupUseCase = new DeleteGroupUseCase(groupRepository);
const addUserToGroupUseCase = new AddUserToGroupUseCase(
  groupRepository,
  userRepository
);
const removeUserFromGroupUseCase = new RemoveUserFromGroupUseCase(
  groupRepository,
  userRepository
);

export {
  getGroupUseCase,
  getGroupsUseCase,
  createGroupUseCase,
  deleteGroupUseCase,
  addUserToGroupUseCase,
  removeUserFromGroupUseCase,
};
