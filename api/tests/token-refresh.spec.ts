import RedisMock from "ioredis-mock";
import { JwtRepository } from "../src/repositories/jwt";
import { JwtService } from "../src/services/jwt";
import { JsonWebTokenError } from "jsonwebtoken";

const buildSUT = (): {
  jwtService: JwtService;
} => {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  return { jwtService };
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
});
