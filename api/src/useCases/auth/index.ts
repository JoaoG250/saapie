import { userRepository } from "../../repositories";
import { jwtService, mailService } from "../../services";
import { ActivateAccountUseCase } from "./activateAccount/activate-account.usecase";
import { RefreshTokensUseCase } from "./refreshTokens/refresh-tokens.usecase";
import { UserSigninUseCase } from "./userSignin/user-signin.usecase";
import { UserSignupUseCase } from "./userSignup/user-signup.usecase";

const refreshTokensUseCase = new RefreshTokensUseCase(
  jwtService,
  userRepository
);
const userSigninUseCase = new UserSigninUseCase(userRepository, jwtService);
const userSignupUseCase = new UserSignupUseCase(
  userRepository,
  mailService,
  jwtService
);
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
