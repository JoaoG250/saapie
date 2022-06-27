import { UserNotFoundError } from "../../../errors";
import { UserRepository } from "../../../repositories/user";
import { createFakeUser } from "../../../tests/fake/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { DeleteUserDto } from "./delete-user.dto";
import { DeleteUserUseCase } from "./delete-user.usecase";

function buildSUT(): {
  deleteUserUseCase: DeleteUserUseCase;
} {
  const userRepository = new UserRepository(prismaMock);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  return { deleteUserUseCase };
}

describe("DeleteUserUseCase", () => {
  it("should check if the user exists", async () => {
    const data: DeleteUserDto = {
      id: "1",
    };
    const user = createFakeUser({ id: data.id }, 1);
    const { deleteUserUseCase } = buildSUT();

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(deleteUserUseCase.findUserById(data.id)).rejects.toThrow(
      UserNotFoundError
    );

    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(deleteUserUseCase.findUserById(data.id)).resolves.toBe(user);
  });
  it("should delete the user", () => {
    const data: DeleteUserDto = {
      id: "1",
    };
    const user = createFakeUser({ id: data.id }, 1);
    const { deleteUserUseCase } = buildSUT();

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.delete.mockResolvedValue(user);
    expect(deleteUserUseCase.execute(data)).resolves.toBeTruthy();
  });
});
