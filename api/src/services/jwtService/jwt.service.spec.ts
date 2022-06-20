import RedisMock from "ioredis-mock";
import { JsonWebTokenError } from "jsonwebtoken";
import { JwtRepository } from "../../repositories/jwt";
import { JwtService } from "./jwt.service";

function buildSUT(): {
  jwtService: JwtService;
  jwtRepository: JwtRepository;
} {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  return { jwtService, jwtRepository };
}

describe("JwtService", () => {
  it("should sign access token", () => {
    const { jwtService } = buildSUT();
    const token = jwtService.signAcessToken({ id: "1" }, "1");
    expect(token).toBeTruthy();
  });
  it("should sign single use token", async () => {
    const { jwtService } = buildSUT();
    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    expect(token).toBeTruthy();
  });
  it("should save single use token in jwt repository", async () => {
    const { jwtService, jwtRepository } = buildSUT();
    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    expect(token).toBeTruthy();

    await expect(
      jwtRepository.getToken("accountActivationToken", "1")
    ).resolves.toBeTruthy();
  });
  it("should verify single use token", async () => {
    const { jwtService } = buildSUT();
    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    expect(token).toBeTruthy();

    expect(
      jwtService.verifyToken("accountActivationToken", token)
    ).toHaveProperty("id", "1");

    const invalidToken = token + "invalid";
    expect(() =>
      jwtService.verifyToken("accountActivationToken", invalidToken)
    ).toThrow(JsonWebTokenError);
  });
  it("should validate single use token checking if it exists in jwt repository", async () => {
    const { jwtService, jwtRepository } = buildSUT();
    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    expect(token).toBeTruthy();

    await expect(
      jwtRepository.getToken("accountActivationToken", "1")
    ).resolves.toBeTruthy();

    await expect(
      jwtService.validateToken("accountActivationToken", token)
    ).resolves.toBeTruthy();

    const invalidToken = token + "invalid";
    await expect(
      jwtService.validateToken("accountActivationToken", invalidToken)
    ).rejects.toThrow(JsonWebTokenError);
  });
  it("should remove single use token from jwt repository after validation", async () => {
    const { jwtService, jwtRepository } = buildSUT();
    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    expect(token).toBeTruthy();

    await expect(
      jwtRepository.getToken("accountActivationToken", "1")
    ).resolves.toBeTruthy();

    await expect(
      jwtService.validateToken("accountActivationToken", token)
    ).resolves.toBeTruthy();

    await expect(
      jwtRepository.getToken("accountActivationToken", "1")
    ).resolves.toBeNull();

    await expect(
      jwtService.validateToken("accountActivationToken", token)
    ).resolves.toBeFalsy();
  });
});
