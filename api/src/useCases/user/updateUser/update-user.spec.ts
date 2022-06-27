import { ValidationError } from "yup";
import { IntegrityError, UserNotFoundError } from "../../../errors";
import { UserRepository } from "../../../repositories/user";
import { createFakeUser } from "../../../tests/fake/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { UpdateUserDto } from "./update-user.dto";
import { UpdateUserUseCase } from "./update-user.usecase";

function buildSUT(): { updateUserUseCase: UpdateUserUseCase } {
  const userRepository = new UserRepository(prismaMock);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  return { updateUserUseCase };
}

describe("UpdateUserUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UpdateUserDto["data"] = {
      email: "john@test.com",
      firstName: "John",
      lastName: "Doe",
      isActive: true,
      isVerified: true,
    };
    let testData = { ...data };
    const { updateUserUseCase } = buildSUT();

    await expect(
      updateUserUseCase.validateUpdateUserData(testData)
    ).resolves.toBeTruthy();

    testData = { ...data, email: "" };
    await expect(
      updateUserUseCase.validateUpdateUserData(testData)
    ).rejects.toThrowError(ValidationError);

    testData = { ...data, email: "johntest.com" };
    await expect(
      updateUserUseCase.validateUpdateUserData(testData)
    ).rejects.toThrowError(ValidationError);

    testData = { ...data, firstName: "J" };
    await expect(
      updateUserUseCase.validateUpdateUserData(testData)
    ).rejects.toThrowError(ValidationError);

    testData = { ...data, lastName: "D" };
    await expect(
      updateUserUseCase.validateUpdateUserData(testData)
    ).rejects.toThrowError(ValidationError);
  });
  it("should check if the user exists", async () => {
    const data: UpdateUserDto = {
      id: "1",
      data: {
        email: "john@test.com",
        firstName: "John",
        lastName: "Doe",
        isActive: true,
        isVerified: true,
      },
    };
    const user = createFakeUser({ ...data.data }, 1);
    const { updateUserUseCase } = buildSUT();

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(updateUserUseCase.getUserById(data.id)).rejects.toThrow(
      UserNotFoundError
    );

    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(updateUserUseCase.getUserById(data.id)).resolves.toBe(user);
  });
  it("should check if unique fields are not in use", async () => {
    const users = [createFakeUser({ id: "1", email: "john@test.com" }, 1)];
    const data: UpdateUserDto = {
      id: "1",
      data: {
        email: "john@test.com",
        firstName: "John",
        lastName: "Doe",
        isActive: true,
        isVerified: true,
      },
    };
    const { updateUserUseCase } = buildSUT();

    prismaMock.user.findMany.mockResolvedValue(users);
    await expect(
      updateUserUseCase.checkUserUniqueFields(data.data, users[0])
    ).rejects.toThrow(IntegrityError);

    prismaMock.user.findMany.mockResolvedValue([]);
    await expect(
      updateUserUseCase.checkUserUniqueFields(data.data, users[0])
    ).resolves.toBeTruthy();
  });
});
