import { userRepository } from "../../repositories";
import { GetUserUseCase } from "./getUser/get-user.usecase";
import { GetUsersUseCase } from "./getUsers/get-users.usecase";
import { UpdateUserUseCase } from "./updateUser/update-user.usecase";

const getUserUseCase = new GetUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);

export { getUserUseCase, getUsersUseCase, updateUserUseCase };
