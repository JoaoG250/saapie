import { User } from "@prisma/client";
import * as yup from "yup";

interface UserSignupDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class IntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntegrityError";
  }
}

class AuthService {
  validateSignupData(data: UserSignupDto): boolean {
    const userSignupDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(25).trim(),
      lastName: yup.string().required().min(3).max(25).trim(),
      email: yup.string().required().email().lowercase().trim(),
      password: yup.string().required().min(6).max(50),
    });
    return userSignupDataConstraints.isValidSync(data);
  }
  checkUserUniqueFields(data: UserSignupDto, users: User[]): true {
    users.forEach((user) => {
      if (user.email === data.email) {
        throw new IntegrityError("Email already exists");
      }
    });
    return true;
  }
}

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
