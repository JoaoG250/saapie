import RedisMock from "ioredis-mock";
import { ValidationError } from "yup";
import { NodeMailerProvider } from "../../../providers/mail";
import { JwtRepository } from "../../../repositories/jwt";
import { UserRepository } from "../../../repositories/user";
import { JwtService } from "../../../services/jwtService/jwt.service";
import { MailService } from "../../../services/mailService/mail.service";
import { createFakeUser } from "../../../tests/fake/user";
import { mailTransporterMock } from "../../../tests/mock/nodemailer";
import { prismaMock } from "../../../tests/mock/prisma";
import { SendPasswordResetEmailDto } from "./send-password-reset-email.dto";
import { SendPasswordResetEmailUseCase } from "./send-password-reset-email.usecase";

function buildSUT(): {
  sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase;
  jwtService: JwtService;
  jwtRepository: JwtRepository;
} {
  const userRepository = new UserRepository(prismaMock);
  const jwtRepository = new JwtRepository(new RedisMock());
  const jwtService = new JwtService(jwtRepository);
  const mailProvider = new NodeMailerProvider(mailTransporterMock);
  const mailService = new MailService(mailProvider);
  const sendPasswordResetEmailUseCase = new SendPasswordResetEmailUseCase(
    userRepository,
    jwtService,
    mailService
  );
  return { sendPasswordResetEmailUseCase, jwtService, jwtRepository };
}

describe("SendPasswordResetEmailUseCase", () => {
  it("should validate the email", async () => {
    const { sendPasswordResetEmailUseCase } = buildSUT();
    const data: SendPasswordResetEmailDto = {
      email: "john@test.com",
    };
    await expect(
      sendPasswordResetEmailUseCase.validateSendPasswordResetEmailData(data)
    ).resolves.toBeTruthy();

    data.email = "";
    await expect(
      sendPasswordResetEmailUseCase.validateSendPasswordResetEmailData(data)
    ).rejects.toThrow(ValidationError);

    data.email = "johntest.com";
    await expect(
      sendPasswordResetEmailUseCase.validateSendPasswordResetEmailData(data)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if the user exists", async () => {
    const { sendPasswordResetEmailUseCase } = buildSUT();
    const data: SendPasswordResetEmailDto = {
      email: "john@test.com",
    };
    const user = createFakeUser({ email: data.email }, 1);

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(
      sendPasswordResetEmailUseCase.getUserByEmail(data.email)
    ).resolves.toBeNull();

    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(
      sendPasswordResetEmailUseCase.getUserByEmail(data.email)
    ).resolves.toBe(user);
  });
  it("should remove the user refreshToken from jwt repository", async () => {
    const { sendPasswordResetEmailUseCase, jwtService, jwtRepository } =
      buildSUT();
    const user = createFakeUser({ id: "1" }, 1);
    const data: SendPasswordResetEmailDto = {
      email: user.email,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    await jwtService.signToken("refreshToken", { id: user.id }, user.id);

    await expect(
      jwtRepository.getToken("refreshToken", user.id)
    ).resolves.toBeTruthy();

    await sendPasswordResetEmailUseCase.execute(data);
    await expect(
      jwtRepository.getToken("refreshToken", user.id)
    ).resolves.toBeNull();
  });
});
