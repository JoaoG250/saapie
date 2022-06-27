import { ValidationError } from "yup";
import { UserRepository } from "../../../repositories/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { CreateUserDto } from "./create-user.dto";
import { CreateUserUseCase } from "./create-user.usecase";
import { createFakeUser } from "../../../tests/fake/user";
import { IntegrityError } from "../../../errors";

function buildSUT(): {
  createUserUseCase: CreateUserUseCase;
} {
  const userRepository = new UserRepository(prismaMock);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return { createUserUseCase };
}

describe("CreateUserUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: CreateUserDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: true,
      isVerified: true,
    };
    let testData = { ...data };
    const { createUserUseCase } = buildSUT();

    await expect(
      createUserUseCase.validateCreateUserData(testData)
    ).resolves.toBeTruthy();

    testData.firstName = "";
    await expect(
      createUserUseCase.validateCreateUserData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.lastName = "do";
    await expect(
      createUserUseCase.validateCreateUserData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.email = "test.com";
    await expect(
      createUserUseCase.validateCreateUserData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.password = "12";
    await expect(
      createUserUseCase.validateCreateUserData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if unique fields are not in use", async () => {
    const data: CreateUserDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: true,
      isVerified: true,
    };
    const users = [createFakeUser({ email: data.email }, 1)];
    const { createUserUseCase } = buildSUT();

    prismaMock.user.findMany.mockResolvedValue(users);
    await expect(createUserUseCase.checkUserUniqueFields(data)).rejects.toThrow(
      IntegrityError
    );

    prismaMock.user.findMany.mockResolvedValue([]);
    await expect(
      createUserUseCase.checkUserUniqueFields(data)
    ).resolves.toBeTruthy();
  });
  it("should hash password", async () => {
    const password = "123456";
    const { createUserUseCase } = buildSUT();

    const hashedPassword = await createUserUseCase.hashPassword(password);
    expect(hashedPassword).toBeTruthy();
    expect(hashedPassword).not.toBe(password);
  });
  it("should create the user", async () => {
    const data: CreateUserDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: true,
      isVerified: true,
    };
    const { createUserUseCase } = buildSUT();

    prismaMock.user.findMany.mockResolvedValue([]);
    prismaMock.user.create.mockResolvedValue(createFakeUser(data, 1));
    await expect(createUserUseCase.execute(data)).resolves.toBeTruthy();
  });
});
