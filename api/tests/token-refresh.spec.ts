import RedisMock from "ioredis-mock";
import { JwtRepository } from "../src/repositories/jwt";
import { JwtService } from "../src/services/jwt";
import { JsonWebTokenError } from "jsonwebtoken";
import { GmailMailProvider } from "../src/providers/mail";
import { UserRepository } from "../src/repositories/user";
import { AuthService } from "../src/services/auth";
import { prismaMock } from "./mock/prisma";
import { User } from "@prisma/client";

const buildSUT = (): {
  jwtService: JwtService;
  authService: AuthService;
} => {
  const mailProvider = new GmailMailProvider();
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prismaMock);
  const authService = new AuthService(userRepository, mailProvider, jwtService);
  return { jwtService, authService };
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
    const { authService, jwtService } = buildSUT();
    const user: User = {
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: true,
      isVerified: true,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    const refreshToken = await jwtService.signRefreshToken(
      { id: user.id },
      user.id
    );
    await expect(authService.refreshTokens(refreshToken)).resolves.toBeTruthy();

    const inactiveUser = {
      ...user,
      isActive: false,
    };
    prismaMock.user.findUnique.mockResolvedValue(inactiveUser);
    await expect(authService.refreshTokens(refreshToken)).rejects.toThrow(
      Error
    );
  });
});
