import { mailProvider } from "../../providers";
import { userRepository } from "../../repositories";
import { jwtService } from "../../services";
import { RefreshTokensUseCase } from "./refreshTokens/refresh-tokens.usecase";
import { UserSigninUseCase } from "./userSignin/user-signin.usecase";
import { UserSignupUseCase } from "./userSignup/user-signup.usecase";

const refreshTokensUseCase = new RefreshTokensUseCase(
  jwtService,
  userRepository
);
const userSigninUseCase = new UserSigninUseCase(userRepository, jwtService);
const userSignupUseCase = new UserSignupUseCase(userRepository, mailProvider);

export { refreshTokensUseCase, userSigninUseCase, userSignupUseCase };
