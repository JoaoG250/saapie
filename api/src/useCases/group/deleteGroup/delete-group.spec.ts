import { GroupNotFoundError } from "../../../errors";
import { GroupRepository } from "../../../repositories/group";
import { createFakeGroup } from "../../../tests/fake/group";
import { prismaMock } from "../../../tests/mock/prisma";
import { DeleteGroupDto } from "./delete-group.dto";
import { DeleteGroupUseCase } from "./delete-group.usecase";

function buildSUT(): {
  deleteGroupUseCase: DeleteGroupUseCase;
} {
  const groupRepository = new GroupRepository(prismaMock);
  const deleteGroupUseCase = new DeleteGroupUseCase(groupRepository);
  return { deleteGroupUseCase };
}

describe("DeleteGroupUseCase", () => {
  it("should check if the group exists", async () => {
    const data: DeleteGroupDto = {
      id: "1",
    };
    const group = createFakeGroup({ id: data.id }, 1);
    const { deleteGroupUseCase } = buildSUT();

    prismaMock.group.findUnique.mockResolvedValue(null);
    await expect(deleteGroupUseCase.execute(data)).rejects.toThrow(
      GroupNotFoundError
    );

    prismaMock.group.findUnique.mockResolvedValue(group);
    prismaMock.group.delete.mockResolvedValue(group);
    await expect(deleteGroupUseCase.execute(data)).resolves.toBeTruthy();
  });
});
