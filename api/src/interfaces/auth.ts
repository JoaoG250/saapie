import { User } from "@prisma/client";
import { UserSignupDto, UserSigninDto } from ".";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenPayload {
  id: string;
  groups: string[];
}

export interface IAuthService {
  userSignup(data: UserSignupDto): Promise<true>;
  validateUser(data: UserSigninDto): Promise<Omit<User, "password"> | null>;
  userSignin(user: Omit<User, "password">): Promise<AuthTokens>;
  refreshTokens(refreshToken: string): Promise<AuthTokens>;
}
