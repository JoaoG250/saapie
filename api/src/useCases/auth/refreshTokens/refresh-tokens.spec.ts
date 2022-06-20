import RedisMock from "ioredis-mock";
import { JwtRepository } from "../../../repositories/jwt";
import { JwtService } from "../../../services/jwtService/jwt.service";
import { JsonWebTokenError } from "jsonwebtoken";
import { UserRepository } from "../../../repositories/user";
import { UserWithGroups } from "../../../interfaces";
import { RefreshTokensUseCase } from "./refresh-tokens.usecase";
import { prismaMock } from "../../../tests/mock/prisma";
import { createFakeUser } from "../../../tests/fake/user";
import { InvalidTokenError } from "../../../errors";

function buildSUT(): {
  refreshTokensUseCase: RefreshTokensUseCase;
  jwtService: JwtService;
} {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prismaMock);
  const refreshTokensUseCase = new RefreshTokensUseCase(
    jwtService,
    userRepository
  );
  return { refreshTokensUseCase, jwtService };
}

describe("RefreshTokensUseCase", () => {
  it("should check if the refresh token is valid", async () => {
    const { jwtService } = buildSUT();

    const token = await jwtService.signToken("refreshToken", { id: "1" }, "1");
    expect(jwtService.verifyToken("refreshToken", token)).toHaveProperty(
      "id",
      "1"
    );

    const invalidToken = token + "invalid";
    expect(() => jwtService.verifyToken("refreshToken", invalidToken)).toThrow(
      JsonWebTokenError
    );
  });
  it("should check if the refresh token exists in token repository", async () => {
    const { jwtService } = buildSUT();

    const token = await jwtService.signToken("refreshToken", { id: "1" }, "1");
    await expect(
      jwtService.validateToken("refreshToken", token)
    ).resolves.toBeTruthy();

    const invalidToken = token + "invalid";
    await expect(
      jwtService.validateToken("refreshToken", invalidToken)
    ).rejects.toThrow(JsonWebTokenError);
  });
  it("should check if the user is active and verified", async () => {
    const { refreshTokensUseCase, jwtService } = buildSUT();
    const user: UserWithGroups = {
      ...createFakeUser({ isActive: true, isVerified: true }, 1),
      groups: [],
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    const refreshToken = await jwtService.signToken(
      "refreshToken",
      { id: user.id },
      user.id
    );
    await expect(
      refreshTokensUseCase.execute({ refreshToken })
    ).resolves.toBeTruthy();

    const inactiveUser = {
      ...user,
      isActive: false,
    };
    prismaMock.user.findUnique.mockResolvedValue(inactiveUser);
    await expect(
      refreshTokensUseCase.execute({ refreshToken })
    ).rejects.toThrow(InvalidTokenError);
  });
});
