import { User } from "@prisma/client";
import { ValidationError } from "yup";
import { IntegrityError } from "../src/errors";
import { UserSignupDto } from "../src/interfaces";
import { GmailMailProvider } from "../src/providers/mail";
import { UserRepository } from "../src/repositories/user";
import { AuthService } from "../src/services/auth";
import { prismaMock } from "./mock/prisma";

const buildSUT = (): {
  authService: AuthService;
  userRepository: UserRepository;
} => {
  const mailProvider = new GmailMailProvider();
  const userRepository = new UserRepository(prismaMock);
  const authService = new AuthService(userRepository, mailProvider);
  return { authService, userRepository };
};

describe("UserSignup", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "test@gmail.com",
      password: "123456",
    };
    let testData = { ...data };
    const { authService } = buildSUT();

    await expect(
      authService.validateSignupData(testData)
    ).resolves.toBeTruthy();

    testData.firstName = "";
    await expect(authService.validateSignupData(testData)).rejects.toThrow(
      ValidationError
    );

    testData = { ...data };
    testData.email = "test.com";
    await expect(authService.validateSignupData(testData)).rejects.toThrow(
      ValidationError
    );

    testData = { ...data };
    testData.password = "12";
    await expect(authService.validateSignupData(testData)).rejects.toThrow(
      ValidationError
    );
  });
  it("should check if user unique fields are not in use", () => {
    const users: User[] = [
      {
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "123456",
        isActive: true,
        isVerified: true,
      },
      {
        id: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@gmail.com",
        password: "123456",
        isActive: true,
        isVerified: true,
      },
    ];
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    };
    const { authService } = buildSUT();

    expect(authService.checkUserUniqueFields(data, users)).toBeTruthy();

    data.email = "john@gmail.com";
    expect(() => authService.checkUserUniqueFields(data, users)).toThrow(
      IntegrityError
    );
  });
  it("should hash the password before saving the user", async () => {
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@gmail.com",
      password: "123456",
    };
    const { authService } = buildSUT();

    const hash = await authService.hashPassword(data.password);
    expect(hash).toBeTruthy();
    expect(hash).not.toEqual(data.password);
  });
});
