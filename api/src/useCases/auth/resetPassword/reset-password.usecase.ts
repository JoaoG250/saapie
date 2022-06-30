import * as yup from "yup";
import bcrypt from "bcrypt";
import { InvalidTokenError } from "../../../errors";
import { IJwtService, IUseCase, IUserRepository } from "../../../interfaces";
import { ResetPasswordDto } from "./reset-password.dto";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";

export class ResetPasswordUseCase implements IUseCase<ResetPasswordDto, true> {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository
  ) {}

  async validateResetPasswordData(
    data: ResetPasswordDto
  ): Promise<ResetPasswordDto> {
    const resetPasswordDataConstraints = yup.object().shape({
      password: yup.string().required().min(6).max(50),
      token: yup.string().required(),
    });
    return resetPasswordDataConstraints.validate(data);
  }

  async validateToken(token: string): Promise<false | JwtPayload> {
    try {
      return await this.jwtService.validateToken("resetPasswordToken", token);
    } catch (err) {
      throw new InvalidTokenError("Invalid token");
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      id,
    });
    if (!user) {
      throw new InvalidTokenError("Invalid token");
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async execute(args: ResetPasswordDto): Promise<true> {
    const validatedData = await this.validateResetPasswordData(args);
    const payload = await this.validateToken(validatedData.token);

    if (!payload || typeof payload.id !== "string") {
      throw new InvalidTokenError("Invalid token");
    }
    const user = await this.userRepository.findOne({
      id: payload.id,
    });
    if (!user) {
      throw new InvalidTokenError("Invalid token");
    }

    const passwordHash = await this.hashPassword(validatedData.password);
    await this.userRepository.update(
      { id: user.id },
      { password: passwordHash }
    );
    await this.jwtService.deleteToken("refreshToken", user.id);
    return true;
  }
}
