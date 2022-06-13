import { User } from "@prisma/client";
import { ValidationError } from "yup";
import { UserSigninDto } from "../src/interfaces";
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

describe("UserSignin", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UserSigninDto = {
      email: "john@test.com",
      password: "123456",
    };
    let testData = { ...data };
    const { authService } = buildSUT();

    await expect(
      authService.validateSigninData(testData)
    ).resolves.toBeTruthy();

    testData.email = "";
    await expect(authService.validateSigninData(testData)).rejects.toThrow(
      ValidationError
    );

    testData = { ...data };
    testData.password = "";
    await expect(authService.validateSigninData(testData)).rejects.toThrow(
      ValidationError
    );

    testData = { ...data };
    testData.email = "johntest.com";
    await expect(authService.validateSigninData(testData)).rejects.toThrow(
      ValidationError
    );
  });
  it("should check if user exists", async () => {
    const data: UserSigninDto = {
      email: "john@test.com",
      password: "123456",
    };
    const { authService } = buildSUT();

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(authService.getUserByEmail(data.email)).resolves.toBeNull();

    prismaMock.user.findUnique.mockResolvedValue({
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: true,
      isVerified: true,
    });
    await expect(authService.getUserByEmail(data.email)).resolves.toBeTruthy();
  });
  it("shold check if the password matches", async () => {
    const data: UserSigninDto = {
      email: "john@test.com",
      password: "123456",
    };
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
    const { authService } = buildSUT();

    await expect(
      authService.checkPassword(data.password, user)
    ).resolves.toBeFalsy();

    user.password = await authService.hashPassword(data.password);
    await expect(
      authService.checkPassword(data.password, user)
    ).resolves.toBeTruthy();
  });
  it("should check if user is active and verified", async () => {
    const user: User = {
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: false,
      isVerified: false,
    };
    const { authService } = buildSUT();

    expect(authService.checkUserStatus(user)).toBeFalsy();

    user.isActive = true;
    expect(authService.checkUserStatus(user)).toBeFalsy();

    user.isVerified = true;
    expect(authService.checkUserStatus(user)).toBeTruthy();
  });
});
