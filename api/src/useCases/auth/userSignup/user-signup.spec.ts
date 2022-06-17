import { User } from "@prisma/client";
import { ValidationError } from "yup";
import { IntegrityError } from "../../../errors";
import { GmailMailProvider } from "../../../providers/mail";
import { UserRepository } from "../../../repositories/user";
import { createFakeUser } from "../../../tests/fake/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { UserSignupDto } from "./user-signup.dto";
import { UserSignupUseCase } from "./user-signup.usecase";

function buildSUT(): {
  userSignupUseCase: UserSignupUseCase;
} {
  const mailProvider = new GmailMailProvider();
  const userRepository = new UserRepository(prismaMock);
  const userSignupUseCase = new UserSignupUseCase(userRepository, mailProvider);
  return { userSignupUseCase };
}

describe("UserSignupUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "test@gmail.com",
      password: "123456",
    };
    let testData = { ...data };
    const { userSignupUseCase } = buildSUT();

    await expect(
      userSignupUseCase.validateSignupData(testData)
    ).resolves.toBeTruthy();

    testData.firstName = "";
    await expect(
      userSignupUseCase.validateSignupData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.email = "test.com";
    await expect(
      userSignupUseCase.validateSignupData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.password = "12";
    await expect(
      userSignupUseCase.validateSignupData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if user unique fields are not in use", async () => {
    const users: User[] = [
      createFakeUser({ email: "john@gmail.com" }, 1),
      createFakeUser({ email: "jane@gmail.com" }, 2),
    ];
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    };
    const { userSignupUseCase } = buildSUT();

    prismaMock.user.findMany.mockResolvedValue(users);
    await expect(
      userSignupUseCase.checkUserUniqueFields(data)
    ).resolves.toBeTruthy();

    data.email = "john@gmail.com";
    await expect(() =>
      userSignupUseCase.checkUserUniqueFields(data)
    ).rejects.toThrow(IntegrityError);
  });
  it("should hash the password before saving the user", async () => {
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@gmail.com",
      password: "123456",
    };
    const { userSignupUseCase } = buildSUT();

    const hash = await userSignupUseCase.hashPassword(data.password);
    expect(hash).toBeTruthy();
    expect(hash).not.toEqual(data.password);
  });
});
