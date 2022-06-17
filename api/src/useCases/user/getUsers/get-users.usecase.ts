import { User } from "@prisma/client";
import { IUseCase, IUserRepository } from "../../../interfaces";
import { GetUsersDto } from "./get-users.dto";

export class GetUsersUseCase implements IUseCase<GetUsersDto, User[]> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(args: GetUsersDto): Promise<User[]> {
    return this.userRepository.findMany(args);
  }
}
