import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { yup } from "../../../modules";
import {
  AuthTokens,
  IJwtService,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { checkUserStatus } from "../domain/check-user-status";
import { SigninError } from "../../../errors";
import { UserSigninDto } from "./user-signin.dto";

export class UserSigninUseCase implements IUseCase<UserSigninDto, AuthTokens> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

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

  async checkPassword(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.password);
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

    if (!checkUserStatus(user)) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: secret, ...result } = user;
    return result;
  }

  async execute(args: UserSigninDto): Promise<AuthTokens> {
    const user = await this.validateUser(args);

    if (!user) {
      throw new SigninError("Invalid credentials");
    }

    const groups = await this.userRepository.getUserGroups({ id: user.id });
    const payload = { id: user.id, groups: groups.map((group) => group.name) };
    return {
      accessToken: this.jwtService.signAcessToken(payload, user.id),
      refreshToken: await this.jwtService.signToken(
        "refreshToken",
        payload,
        user.id
      ),
    };
  }
}
