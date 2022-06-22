import { userRepository } from "../../repositories";
import { jwtService, mailService } from "../../services";
import { ActivateAccountUseCase } from "./activateAccount/activate-account.usecase";
import { RefreshTokensUseCase } from "./refreshTokens/refresh-tokens.usecase";
import { ResetPasswordUseCase } from "./resetPassword/reset-password.usecase";
import { SendPasswordResetEmailUseCase } from "./sendPasswordResetEmail/send-password-reset-email.usecase";
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
const sendPasswordResetEmailUseCase = new SendPasswordResetEmailUseCase(
  userRepository,
  jwtService,
  mailService
);
const resetPasswordUseCase = new ResetPasswordUseCase(
  jwtService,
  userRepository
);

export {
  refreshTokensUseCase,
  userSigninUseCase,
  userSignupUseCase,
  activateAccountUseCase,
  sendPasswordResetEmailUseCase,
  resetPasswordUseCase,
};
