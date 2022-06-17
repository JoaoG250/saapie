import RedisMock from "ioredis-mock";
import { JwtRepository } from "../../../repositories/jwt";
import { JwtService } from "../../../services/jwt";
import { JsonWebTokenError } from "jsonwebtoken";
import { UserRepository } from "../../../repositories/user";
import { UserWithGroups } from "../../../interfaces";
import { RefreshTokensUseCase } from "./refresh-tokens.usecase";
import { prismaMock } from "../../../tests/mock/prisma";

const buildSUT = (): {
  refreshTokensUseCase: RefreshTokensUseCase;
  jwtService: JwtService;
} => {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prismaMock);
  const refreshTokensUseCase = new RefreshTokensUseCase(
    jwtService,
    userRepository
  );
  return { refreshTokensUseCase, jwtService };
};

describe("TokenRefresh", () => {
  it("should check if the refresh token is valid", async () => {
    const { jwtService } = buildSUT();

    const token = await jwtService.signRefreshToken({ id: "1" }, "1");
    expect(jwtService.verifyRefreshToken(token)).toHaveProperty("id", "1");

    const invalidToken = token + "invalid";
    expect(() => jwtService.verifyRefreshToken(invalidToken)).toThrow(
      JsonWebTokenError
    );
  });
  it("should check if the refresh token exists in token repository", async () => {
    const { jwtService } = buildSUT();

    const token = await jwtService.signRefreshToken({ id: "1" }, "1");
    await expect(jwtService.validateRefreshToken(token)).resolves.toBeTruthy();

    const invalidToken = token + "invalid";
    await expect(jwtService.validateRefreshToken(invalidToken)).rejects.toThrow(
      JsonWebTokenError
    );
  });
  it("should check if the user is active and verified", async () => {
    const { refreshTokensUseCase, jwtService } = buildSUT();
    const user: UserWithGroups = {
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: true,
      isVerified: true,
      groups: [],
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    const refreshToken = await jwtService.signRefreshToken(
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
    ).rejects.toThrow(Error);
  });
});
