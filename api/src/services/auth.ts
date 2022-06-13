import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import * as yup from "yup";
import { IntegrityError } from "../errors";
import {
  IMailProvider,
  IUserRepository,
  UserSigninDto,
  UserSignupDto,
} from "../interfaces";

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailProvider: IMailProvider
  ) {}

  async validateSignupData(data: UserSignupDto): Promise<UserSignupDto> {
    const userSignupDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(30).trim(),
      lastName: yup.string().required().min(3).max(50).trim(),
      email: yup.string().required().email().lowercase().trim(),
      password: yup.string().required().min(6).max(50),
    });
    return userSignupDataConstraints.validate(data);
  }

  async validateSigninData(data: UserSigninDto): Promise<UserSigninDto> {
    const userSigninDataConstraints = yup.object().shape({
      email: yup.string().required().email().lowercase().trim(),
      password: yup.string().required(),
    });
    return userSigninDataConstraints.validate(data);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      email,
    });
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

  async checkPassword(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  checkUserStatus(user: User): boolean {
    return user.isActive && user.isVerified;
  }

  async sendSignupEmail(data: UserSignupDto): Promise<void> {
    return this.mailProvider.sendMail({
      to: {
        name: data.firstName,
        address: data.email,
      },
      subject: "Confirmação de cadastro",
      body: "<h1>Confirmação de cadastro</h1>",
    });
  }

  async userSignup(data: UserSignupDto): Promise<true> {
    const validatedData = await this.validateSignupData(data);

    const users = await this.findUsersMatchingUniqueFields(validatedData);
    this.checkUserUniqueFields(validatedData, users);

    const passwordHash = await this.hashPassword(validatedData.password);
    await this.userRepository.create({
      ...validatedData,
      password: passwordHash,
    });

    await this.sendSignupEmail(validatedData);
    return true;
  }

  async validateUser(
    data: UserSigninDto
  ): Promise<Omit<User, "password"> | null> {
    const validatedData = await this.validateSigninData(data);

    const user = await this.getUserByEmail(validatedData.email);
    if (!user) {
      return null;
    }

    const passwordMatches = await this.checkPassword(
      validatedData.password,
      user
    );
    if (!passwordMatches) {
      return null;
    }

    if (!this.checkUserStatus(user)) {
      return null;
    }

    const { password: secret, ...result } = user;
    return result;
  }
}
