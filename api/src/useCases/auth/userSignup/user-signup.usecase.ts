import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import * as yup from "yup";
import { IntegrityError } from "../../../errors";
import {
  IJwtService,
  IMailService,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { UserSignupDto } from "./user-signup.dto";

export class UserSignupUseCase implements IUseCase<UserSignupDto, true> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: IMailService,
    private readonly jwtService: IJwtService
  ) {}

  async validateSignupData(data: UserSignupDto): Promise<UserSignupDto> {
    const userSignupDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(30).trim(),
      lastName: yup.string().required().min(3).max(50).trim(),
      email: yup
        .string()
        .required()
        .email()
        .lowercase()
        .trim()
        .matches(/@arapiraca.ufal.br$/),
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

  async sendSignupEmail(user: User): Promise<void> {
    const token = await this.jwtService.signToken(
      "accountActivationToken",
      { id: user.id },
      user.id
    );
    return this.mailService.sendMail({
      to: {
        name: user.firstName,
        address: user.email,
      },
      subject: "Confirmação de cadastro",
      template: "accountActivation",
      data: {
        url: `auth/activate-account/${token}/`,
      },
    });
  }

  async execute(args: UserSignupDto): Promise<true> {
    const validatedData = await this.validateSignupData(args);

    await this.checkUserUniqueFields(validatedData);

    const passwordHash = await this.hashPassword(validatedData.password);
    const user = await this.userRepository.create({
      ...validatedData,
      password: passwordHash,
    });

    try {
      await this.sendSignupEmail(user);
    } catch (err) {
      await this.userRepository.delete({ id: user.id });
      throw err;
    }

    return true;
  }
}
