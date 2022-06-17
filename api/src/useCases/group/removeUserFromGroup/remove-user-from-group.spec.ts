import { GroupRepository } from "../../../repositories/group";
import { UserRepository } from "../../../repositories/user";
import { createFakeGroup } from "../../../tests/fake/group";
import { createFakeUser } from "../../../tests/fake/user";
import { prismaMock } from "../../../tests/mock/prisma";
import { RemoveUserFromGroupDto } from "./remove-user-from-group.dto";
import { RemoveUserFromGroupUseCase } from "./remove-user-from-group.usecase";

function buildSUT(): {
  removeUserFromGroupUseCase: RemoveUserFromGroupUseCase;
} {
  const userRepository = new UserRepository(prismaMock);
  const groupRepository = new GroupRepository(prismaMock);
  const removeUserFromGroupUseCase = new RemoveUserFromGroupUseCase(
    groupRepository,
    userRepository
  );
  return { removeUserFromGroupUseCase };
}

describe("RemoveUserFromGroupUseCase", () => {
  it("should check if the user and group exists", async () => {
    const data: RemoveUserFromGroupDto = {
      userId: "1",
      groupId: "1",
    };
    const user = createFakeUser({ id: data.userId }, 1);
    const group = createFakeGroup({ id: data.groupId }, 1);
    const { removeUserFromGroupUseCase } = buildSUT();

    await expect(removeUserFromGroupUseCase.execute(data)).rejects.toThrow(
      Error
    );
    prismaMock.group.findUnique.mockResolvedValue(group);

    await expect(removeUserFromGroupUseCase.execute(data)).rejects.toThrow(
      Error
    );
    prismaMock.user.findUnique.mockResolvedValue(user);

    await expect(
      removeUserFromGroupUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
