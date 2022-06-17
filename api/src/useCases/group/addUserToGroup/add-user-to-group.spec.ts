import { AddUserToGroupUseCase } from "./add-user-to-group.usecase";
import { prismaMock } from "../../../tests/mock/prisma";
import { GroupRepository } from "../../../repositories/group";
import { UserRepository } from "../../../repositories/user";
import { AddUserToGroupDto } from "./add-user-to-group.dto";
import { createFakeUser } from "../../../tests/fake/user";
import { createFakeGroup } from "../../../tests/fake/group";

function buildSUT(): {
  addUserToGroupUseCase: AddUserToGroupUseCase;
} {
  const groupRepository = new GroupRepository(prismaMock);
  const userRepository = new UserRepository(prismaMock);
  const addUserToGroupUseCase = new AddUserToGroupUseCase(
    groupRepository,
    userRepository
  );
  return { addUserToGroupUseCase };
}

describe("AddUserToGroupUseCase", () => {
  it("should check if the user and group exists", async () => {
    const data: AddUserToGroupDto = {
      userId: "1",
      groupId: "1",
    };
    const user = createFakeUser({ id: data.userId }, 1);
    const group = createFakeGroup({ id: data.groupId }, 1);
    const { addUserToGroupUseCase } = buildSUT();

    await expect(addUserToGroupUseCase.execute(data)).rejects.toThrow(Error);
    prismaMock.group.findUnique.mockResolvedValue(group);

    await expect(addUserToGroupUseCase.execute(data)).rejects.toThrow(Error);
    prismaMock.user.findUnique.mockResolvedValue(user);

    await expect(addUserToGroupUseCase.execute(data)).resolves.toBeTruthy();
  });
});
