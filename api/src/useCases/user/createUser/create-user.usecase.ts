import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { yup } from "../../../modules";
import { IUseCase, IUserRepository } from "../../../interfaces";
import { CreateUserDto } from "./create-user.dto";
import { IntegrityError } from "../../../errors";

export class CreateUserUseCase implements IUseCase<CreateUserDto, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async validateCreateUserData(data: CreateUserDto): Promise<CreateUserDto> {
    const createUserDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(30).trim(),
      lastName: yup.string().required().min(3).max(50).trim(),
      email: yup.string().required().email().lowercase().trim(),
      password: yup.string().required().min(6).max(50),
      isActive: yup.boolean().required(),
      isVerified: yup.boolean().required(),
    });
    return createUserDataConstraints.validate(data);
  }

  async checkUserUniqueFields(data: CreateUserDto): Promise<true> {
    const matchingUsers = await this.userRepository.findMany({
      where: {
        OR: { email: data.email },
      },
    });
    matchingUsers.forEach((user) => {
      if (user.email === data.email) {
        throw new IntegrityError("Email already exists");
      }
    });
    return true;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async execute(args: CreateUserDto): Promise<User> {
    const validatedData = await this.validateCreateUserData(args);
    await this.checkUserUniqueFields(validatedData);
    const passwordHash = await this.hashPassword(validatedData.password);
    return this.userRepository.create({
      ...validatedData,
      password: passwordHash,
    });
  }
}
