import { userRepository } from "../../repositories";
import { GetUserUseCase } from "./getUser/get-user.usecase";
import { GetUsersUseCase } from "./getUsers/get-users.usecase";

const getUserUseCase = new GetUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);

export { getUserUseCase, getUsersUseCase };
