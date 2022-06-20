import { mailProvider } from "../../providers";
import { userRepository } from "../../repositories";
import { jwtService } from "../../services";
import { ActivateAccountUseCase } from "./activateAccount/activate-account.usecase";
import { RefreshTokensUseCase } from "./refreshTokens/refresh-tokens.usecase";
import { UserSigninUseCase } from "./userSignin/user-signin.usecase";
import { UserSignupUseCase } from "./userSignup/user-signup.usecase";

const refreshTokensUseCase = new RefreshTokensUseCase(
  jwtService,
  userRepository
);
const userSigninUseCase = new UserSigninUseCase(userRepository, jwtService);
const userSignupUseCase = new UserSignupUseCase(userRepository, mailProvider);
const activateAccountUseCase = new ActivateAccountUseCase(
  jwtService,
  userRepository
);

export {
  refreshTokensUseCase,
  userSigninUseCase,
  userSignupUseCase,
  activateAccountUseCase,
};
