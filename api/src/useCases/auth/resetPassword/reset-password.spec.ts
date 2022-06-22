import RedisMock from "ioredis-mock";
import { ValidationError } from "yup";
import { InvalidTokenError } from "../../../errors";
import { JwtRepository } from "../../../repositories/jwt";
import { UserRepository } from "../../../repositories/user";
import { JwtService } from "../../../services/jwtService/jwt.service";
import { createFakeUser } from "../../../tests/fake/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { ResetPasswordDto } from "./reset-password.dto";
import { ResetPasswordUseCase } from "./reset-password.usecase";

function buildSUT(): {
  resetPasswordUseCase: ResetPasswordUseCase;
  jwtService: JwtService;
  jwtRepository: JwtRepository;
} {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const userRepository = new UserRepository(prismaMock);
  const resetPasswordUseCase = new ResetPasswordUseCase(
    jwtService,
    userRepository
  );
  return { resetPasswordUseCase, jwtService, jwtRepository };
}

describe("ResetPassword", () => {
  it("should validate the password", async () => {
    const data: ResetPasswordDto = {
      password: "123456",
      token: "1234",
    };
    const { resetPasswordUseCase } = buildSUT();

    await expect(
      resetPasswordUseCase.validateResetPasswordData(data)
    ).resolves.toBeTruthy();

    data.password = "";
    await expect(
      resetPasswordUseCase.validateResetPasswordData(data)
    ).rejects.toThrowError(ValidationError);

    data.password = "1234";
    data.token = "";
    await expect(
      resetPasswordUseCase.validateResetPasswordData(data)
    ).rejects.toThrowError(ValidationError);
  });
  it("should validate the token", async () => {
    const { resetPasswordUseCase, jwtService } = buildSUT();
    let token = "1234";

    await expect(resetPasswordUseCase.validateToken(token)).rejects.toThrow(
      InvalidTokenError
    );

    token = await jwtService.signToken("resetPasswordToken", { id: "1" }, "1");
    await expect(
      resetPasswordUseCase.validateToken(token)
    ).resolves.toBeTruthy();
  });
  it("should check if the user exists", async () => {
    const { resetPasswordUseCase } = buildSUT();
    const user = createFakeUser({ id: "1" }, 1);

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(resetPasswordUseCase.getUserById(user.id)).rejects.toThrow(
      InvalidTokenError
    );

    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(resetPasswordUseCase.getUserById(user.id)).resolves.toBe(user);
  });
  it("should hash the new password", async () => {
    const { resetPasswordUseCase } = buildSUT();
    const password = "123456";

    const passwordHash = await resetPasswordUseCase.hashPassword(password);
    expect(passwordHash).toBeTruthy();
    expect(passwordHash).not.toBe(password);
  });
  it("should update the user password", async () => {
    const { resetPasswordUseCase, jwtService } = buildSUT();
    const user = createFakeUser({ id: "1" }, 1);
    const data: ResetPasswordDto = {
      password: "123456",
      token: await jwtService.signToken(
        "resetPasswordToken",
        { id: user.id },
        user.id
      ),
    };

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(resetPasswordUseCase.execute(data)).rejects.toThrow(
      InvalidTokenError
    );

    data.token = await jwtService.signToken(
      "resetPasswordToken",
      { id: user.id },
      user.id
    );
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);
    await expect(resetPasswordUseCase.execute(data)).resolves.toBeTruthy();
  });
  it("should remove the user refreshToken from jwt repository", async () => {
    const { resetPasswordUseCase, jwtService, jwtRepository } = buildSUT();
    const user = createFakeUser({ id: "1" }, 1);
    const data: ResetPasswordDto = {
      password: "123456",
      token: await jwtService.signToken(
        "resetPasswordToken",
        { id: user.id },
        user.id
      ),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    await jwtService.signToken("refreshToken", { id: user.id }, user.id);

    await expect(
      jwtRepository.getToken("refreshToken", user.id)
    ).resolves.toBeTruthy();

    await resetPasswordUseCase.execute(data);
    await expect(
      jwtRepository.getToken("refreshToken", user.id)
    ).resolves.toBeNull();
  });
});
