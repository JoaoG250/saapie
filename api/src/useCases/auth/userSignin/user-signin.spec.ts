import RedisMock from "ioredis-mock";
import { ValidationError } from "yup";
import { JwtRepository } from "../../../repositories/jwt";
import { UserRepository } from "../../../repositories/user";
import { JwtService } from "../../../services/jwtService/jwt.service";
import { prismaMock } from "../../../tests/mock/prisma";
import { UserSigninUseCase } from "./user-signin.usecase";
import { UserSignupUseCase } from "../userSignup/user-signup.usecase";
import { GmailMailProvider } from "../../../providers/mail";
import { createFakeUser } from "../../../tests/fake/user";
import { UserSigninDto } from "./user-signin.dto";
import { MailService } from "../../../services/mailService/mail.service";

function buildSUT(): {
  userSigninUseCase: UserSigninUseCase;
  userSignupUseCase: UserSignupUseCase;
} {
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const mailProvider = new GmailMailProvider();
  const mailService = new MailService(mailProvider);
  const userRepository = new UserRepository(prismaMock);
  const userSigninUseCase = new UserSigninUseCase(userRepository, jwtService);
  const userSignupUseCase = new UserSignupUseCase(
    userRepository,
    mailService,
    jwtService
  );
  return { userSigninUseCase, userSignupUseCase };
}

describe("UserSigninUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UserSigninDto = {
      email: "john@test.com",
      password: "123456",
    };
    let testData = { ...data };
    const { userSigninUseCase } = buildSUT();

    await expect(
      userSigninUseCase.validateSigninData(testData)
    ).resolves.toBeTruthy();

    testData.email = "";
    await expect(
      userSigninUseCase.validateSigninData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.password = "";
    await expect(
      userSigninUseCase.validateSigninData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.email = "johntest.com";
    await expect(
      userSigninUseCase.validateSigninData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if user exists", async () => {
    const data: UserSigninDto = {
      email: "john@test.com",
      password: "123456",
    };
    const user = createFakeUser({ email: data.email }, 1);
    const { userSigninUseCase } = buildSUT();

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(
      userSigninUseCase.getUserByEmail(data.email)
    ).resolves.toBeNull();

    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(
      userSigninUseCase.getUserByEmail(data.email)
    ).resolves.toBeTruthy();
  });
  it("shold check if the password matches", async () => {
    const data: UserSigninDto = {
      email: "john@test.com",
      password: "123456",
    };
    const user = createFakeUser({}, 1);
    const { userSigninUseCase, userSignupUseCase } = buildSUT();

    await expect(
      userSigninUseCase.checkPassword(data.password, user)
    ).resolves.toBeFalsy();

    user.password = await userSignupUseCase.hashPassword(data.password);
    await expect(
      userSigninUseCase.checkPassword(data.password, user)
    ).resolves.toBeTruthy();
  });
});
