import {
  AuthTokens,
  IJwtService,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { checkUserStatus } from "../domain/check-user-status";

export class RefreshTokensUseCase
  implements IUseCase<{ refreshToken: string }, AuthTokens>
{
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(args: { refreshToken: string }): Promise<AuthTokens> {
    const { refreshToken } = args;
    let payload;
    try {
      payload = await this.jwtService.validateRefreshToken(refreshToken);
    } catch (err) {
      throw new Error("Invalid refresh token");
    }

    if (!payload || typeof payload.id !== "string") {
      throw new Error("Invalid refresh token");
    }
    const user = await this.userRepository.findOneWithGroups({
      id: payload.id,
    });
    if (!user || !checkUserStatus(user)) {
      throw new Error("Invalid refresh token");
    }

    const signPayload = {
      id: user.id,
      groups: user.groups.map((group) => group.name),
    };
    return {
      accessToken: this.jwtService.signAcessToken(signPayload, user.id),
      refreshToken: await this.jwtService.signRefreshToken(
        signPayload,
        user.id
      ),
    };
  }
}
