import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import * as yup from "yup";
import { IntegrityError } from "../errors";
import { IUserRepository, UserSignupDto } from "../interfaces";

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async validateSignupData(data: UserSignupDto): Promise<UserSignupDto> {
    const userSignupDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(30).trim(),
      lastName: yup.string().required().min(3).max(50).trim(),
      email: yup.string().required().email().lowercase().trim(),
      password: yup.string().required().min(6).max(50),
    });
    return userSignupDataConstraints.validate(data);
  }

  async findUsersMatchingUniqueFields(data: UserSignupDto): Promise<User[]> {
    return this.userRepository.findMany({
      where: {
        OR: { email: data.email },
      },
    });
  }

  checkUserUniqueFields(data: UserSignupDto, users: User[]): true {
    users.forEach((user) => {
      if (user.email === data.email) {
        throw new IntegrityError("Email already exists");
      }
    });
    return true;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async registerUser(data: UserSignupDto): Promise<true> {
    const validatedData = await this.validateSignupData(data);

    const users = await this.findUsersMatchingUniqueFields(validatedData);
    this.checkUserUniqueFields(validatedData, users);

    const passwordHash = await this.hashPassword(validatedData.password);
    await this.userRepository.create({
      ...validatedData,
      password: passwordHash,
    });
    return true;
  }
}
