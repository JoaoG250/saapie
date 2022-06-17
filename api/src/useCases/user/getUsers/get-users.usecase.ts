import { Prisma, User } from "@prisma/client";
import { IUseCase, IUserRepository } from "../../../interfaces";

export class GetUsersUseCase
  implements
    IUseCase<
      {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
      },
      User[]
    >
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(args: {
    skip?: number | undefined;
    take?: number | undefined;
    cursor?: Prisma.UserWhereUniqueInput | undefined;
    where?: Prisma.UserWhereInput | undefined;
    orderBy?: Prisma.UserOrderByWithRelationInput | undefined;
  }): Promise<User[]> {
    return this.userRepository.findMany(args);
  }
}
