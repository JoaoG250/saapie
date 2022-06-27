import { userRepository } from "../../repositories";
import { DeleteUserUseCase } from "./deleteUser/delete-user.usecase";
import { GetUserUseCase } from "./getUser/get-user.usecase";
import { GetUsersUseCase } from "./getUsers/get-users.usecase";
import { UpdateUserUseCase } from "./updateUser/update-user.usecase";

const getUserUseCase = new GetUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export {
  getUserUseCase,
  getUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase,
};
