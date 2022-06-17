import { Prisma, User } from "@prisma/client";
import { IUseCase, IUserRepository } from "../../../interfaces";

export class GetUserUseCase
  implements IUseCase<Prisma.UserWhereUniqueInput, User | null>
{
  constructor(private userRepository: IUserRepository) {}

  async execute(args: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.userRepository.findOne(args);
  }
}
