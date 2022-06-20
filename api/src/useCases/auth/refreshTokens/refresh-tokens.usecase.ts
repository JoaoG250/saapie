import { InvalidTokenError } from "../../../errors";
import {
  AuthTokens,
  IJwtService,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { checkUserStatus } from "../domain/check-user-status";
import { RefreshTokensDto } from "./refresh-tokens.dto";

export class RefreshTokensUseCase
  implements IUseCase<RefreshTokensDto, AuthTokens>
{
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(args: RefreshTokensDto): Promise<AuthTokens> {
    const { refreshToken } = args;
    let payload;
    try {
      payload = await this.jwtService.validateToken(
        "refreshToken",
        refreshToken
      );
    } catch (err) {
      throw new InvalidTokenError("Invalid refresh token");
    }

    if (!payload || typeof payload.id !== "string") {
      throw new InvalidTokenError("Invalid refresh token");
    }
    const user = await this.userRepository.findOneWithGroups({
      id: payload.id,
    });
    if (!user || !checkUserStatus(user)) {
      throw new InvalidTokenError("Invalid refresh token");
    }

    const signPayload = {
      id: user.id,
      groups: user.groups.map((group) => group.name),
    };
    return {
      accessToken: this.jwtService.signAcessToken(signPayload, user.id),
      refreshToken: await this.jwtService.signToken(
        "refreshToken",
        signPayload,
        user.id
      ),
    };
  }
}
