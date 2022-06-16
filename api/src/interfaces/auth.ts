import { User } from "@prisma/client";
import { AuthTokens, UserSignupDto, UserSigninDto } from ".";

export interface IAuthService {
  userSignup(data: UserSignupDto): Promise<true>;
  validateUser(data: UserSigninDto): Promise<Omit<User, "password"> | null>;
  userSignin(user: Omit<User, "password">): Promise<AuthTokens>;
  refreshTokens(refreshToken: string): Promise<AuthTokens>;
}
