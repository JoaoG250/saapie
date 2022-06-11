import { User } from "@prisma/client";
import { IntegrityError } from "../src/errors";
import { UserSignupDto } from "../src/interfaces";
import { AuthService } from "../src/services/auth";

describe("UserSignup", () => {
  it("should check if all fields are within assigned constraints", () => {
    const data: UserSignupDto = {
      firstName: "John",
      lastName: "Doe",
      email: "test@gmail.com",
      password: "123456",
    };
    let testData = { ...data };
    const authService = new AuthService();

    expect(authService.validateSignupData(testData)).toBeTruthy();

    testData.firstName = "";
    expect(authService.validateSignupData(testData)).toBeFalsy();

    testData = { ...data };
    testData.email = "test.com";
    expect(authService.validateSignupData(testData)).toBeFalsy();

    testData = { ...data };
    testData.password = "12";
    expect(authService.validateSignupData(testData)).toBeFalsy();
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
    const authService = new AuthService();

    expect(authService.checkUserUniqueFields(data, users)).toBeTruthy();

    data.email = "john@gmail.com";
    expect(() => authService.checkUserUniqueFields(data, users)).toThrow(
      IntegrityError
    );
  });
});
