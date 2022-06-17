import bcrypt from "bcrypt";
import * as yup from "yup";
import { IntegrityError } from "../../../errors";
import { IMailProvider, IUseCase, IUserRepository } from "../../../interfaces";
import { UserSignupDto } from "./user-signup.dto";

export class UserSignupUseCase implements IUseCase<UserSignupDto, true> {
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

  async checkUserUniqueFields(data: UserSignupDto): Promise<true> {
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

  async execute(args: UserSignupDto): Promise<true> {
    const validatedData = await this.validateSignupData(args);

    await this.checkUserUniqueFields(validatedData);

    const passwordHash = await this.hashPassword(validatedData.password);
    await this.userRepository.create({
      ...validatedData,
      password: passwordHash,
    });

    await this.sendSignupEmail(validatedData);
    return true;
  }
}
