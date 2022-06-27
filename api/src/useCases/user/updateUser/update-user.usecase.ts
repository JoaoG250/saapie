import * as yup from "yup";
import { User } from "@prisma/client";
import { IUseCase, IUserRepository } from "../../../interfaces";
import { UpdateUserDto } from "./update-user.dto";
import { IntegrityError, UserNotFoundError } from "../../../errors";

export class UpdateUserUseCase implements IUseCase<UpdateUserDto, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async validateUpdateUserData(
    data: UpdateUserDto["data"]
  ): Promise<UpdateUserDto["data"]> {
    const updateUserDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(30).trim(),
      lastName: yup.string().required().min(3).max(50).trim(),
      email: yup.string().required().email().lowercase().trim(),
      isActive: yup.boolean().required(),
      isVerified: yup.boolean().required(),
    });
    return updateUserDataConstraints.validate(data);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }

  async checkUserUniqueFields(
    data: UpdateUserDto["data"],
    user: User
  ): Promise<true> {
    const matchingUsers = await this.userRepository.findMany({
      where: {
        OR: { email: data.email },
        NOT: { id: user.id },
      },
    });
    matchingUsers.forEach((user) => {
      if (user.email === data.email) {
        throw new IntegrityError("Email already exists");
      }
    });
    return true;
  }

  async execute(args: UpdateUserDto): Promise<User> {
    const validatedData = await this.validateUpdateUserData(args.data);
    const user = await this.getUserById(args.id);
    await this.checkUserUniqueFields(validatedData, user);
    return this.userRepository.update({ id: user.id }, validatedData);
  }
}
