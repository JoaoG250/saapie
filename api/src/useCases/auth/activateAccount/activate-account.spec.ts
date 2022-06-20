import RedisMock from "ioredis-mock";
import { JsonWebTokenError } from "jsonwebtoken";
import { InvalidTokenError } from "../../../errors";
import { JwtRepository } from "../../../repositories/jwt";
import { UserRepository } from "../../../repositories/user";
import { JwtService } from "../../../services/jwtService/jwt.service";
import { createFakeUser } from "../../../tests/fake/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { ActivateAccountUseCase } from "./activate-account.usecase";

function buildSUT(): {
  jwtService: JwtService;
  activateAccountUseCase: ActivateAccountUseCase;
} {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prismaMock);
  const activateAccountUseCase = new ActivateAccountUseCase(
    jwtService,
    userRepository
  );
  return { jwtService, activateAccountUseCase };
}

describe("ActivateAccountUseCase", () => {
  it("shound check if the token is valid", async () => {
    const { jwtService } = buildSUT();

    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    expect(
      jwtService.verifyToken("accountActivationToken", token)
    ).toHaveProperty("id", "1");

    const invalidToken = token + "invalid";
    expect(() =>
      jwtService.verifyToken("accountActivationToken", invalidToken)
    ).toThrow(JsonWebTokenError);
  });
  it("should check if the token exists in token repository", async () => {
    const { jwtService } = buildSUT();

    const token = await jwtService.signToken(
      "accountActivationToken",
      { id: "1" },
      "1"
    );
    await expect(
      jwtService.validateToken("accountActivationToken", token)
    ).resolves.toBeTruthy();

    const invalidToken = token + "invalid";
    await expect(
      jwtService.validateToken("accountActivationToken", invalidToken)
    ).rejects.toThrow(JsonWebTokenError);
  });
  it("should check if the user exists", async () => {
    const { activateAccountUseCase, jwtService } = buildSUT();
    const user = createFakeUser({ id: "1" }, 1);

    let token = await jwtService.signToken(
      "accountActivationToken",
      { id: user.id },
      user.id
    );
    await expect(activateAccountUseCase.execute({ token })).rejects.toThrow(
      InvalidTokenError
    );

    prismaMock.user.findUnique.mockResolvedValue(user);
    token = await jwtService.signToken(
      "accountActivationToken",
      { id: user.id },
      user.id
    );
    await expect(
      activateAccountUseCase.execute({ token })
    ).resolves.toBeTruthy();
  });
});
