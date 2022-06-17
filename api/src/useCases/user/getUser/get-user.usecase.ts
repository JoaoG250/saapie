import { User } from "@prisma/client";
import { IUseCase, IUserRepository } from "../../../interfaces";
import { GetUserDto } from "./get-user.dto";

export class GetUserUseCase implements IUseCase<GetUserDto, User | null> {
  constructor(private userRepository: IUserRepository) {}

  async execute(args: GetUserDto): Promise<User | null> {
    return this.userRepository.findOne(args);
  }
}
