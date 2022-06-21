import { User } from "@prisma/client";
import * as yup from "yup";
import { UserNotFoundError } from "../../../errors";
import {
  IJwtService,
  IMailService,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { SendPasswordResetEmailDto } from "./send-password-reset-email.dto";

export class SendPasswordResetEmailUseCase
  implements IUseCase<SendPasswordResetEmailDto, true>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly mailService: IMailService
  ) {}

  async validateSendPasswordResetEmailData(
    data: SendPasswordResetEmailDto
  ): Promise<SendPasswordResetEmailDto> {
    const sendPasswordResetEmailDataConstraints = yup.object().shape({
      email: yup.string().required().email(),
    });
    return sendPasswordResetEmailDataConstraints.validate(data);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  }

  async execute(args: SendPasswordResetEmailDto): Promise<true> {
    const validatedData = await this.validateSendPasswordResetEmailData(args);
    const user = await this.getUserByEmail(validatedData.email);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    const token = await this.jwtService.signToken(
      "resetPasswordToken",
      { id: user.id },
      user.id
    );
    await this.mailService.sendMail({
      to: { name: user.firstName, address: user.email },
      subject: "Recuperação de senha",
      template: "passwordReset",
      data: {
        url: "reset-password/" + token,
      },
    });
    return true;
  }
}
