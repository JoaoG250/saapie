import { InvalidTokenError } from "../../../errors";
import { IJwtService, IUseCase, IUserRepository } from "../../../interfaces";
import { ActivateAccountDto } from "./activate-account.dto";

export class ActivateAccountUseCase
  implements IUseCase<ActivateAccountDto, true>
{
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(args: ActivateAccountDto): Promise<true> {
    let payload;
    try {
      payload = await this.jwtService.validateToken(
        "accountActivationToken",
        args.token
      );
    } catch (err) {
      throw new InvalidTokenError("Invalid refresh token");
    }

    if (!payload || typeof payload.id !== "string") {
      throw new InvalidTokenError("Invalid refresh token");
    }
    const user = await this.userRepository.findOne({
      id: payload.id,
    });
    if (!user) {
      throw new InvalidTokenError("Invalid refresh token");
    }

    await this.userRepository.update(
      { id: user.id },
      { isActive: true, isVerified: true }
    );
    return true;
  }
}
