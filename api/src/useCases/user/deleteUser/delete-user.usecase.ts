import { User } from "@prisma/client";
import { UserNotFoundError } from "../../../errors";
import { IUseCase, IUserRepository } from "../../../interfaces";
import { DeleteUserDto } from "./delete-user.dto";

export class DeleteUserUseCase implements IUseCase<DeleteUserDto, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }

  async execute(args: DeleteUserDto): Promise<User> {
    const user = await this.findUserById(args.id);
    return this.userRepository.delete({ id: user.id });
  }
}
