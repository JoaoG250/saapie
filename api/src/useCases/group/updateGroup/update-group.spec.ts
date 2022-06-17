import { ValidationError } from "yup";
import { GroupNotFoundError, IntegrityError } from "../../../errors";
import { GroupRepository } from "../../../repositories/group";
import { createFakeGroup } from "../../../tests/fake/group";
import { prismaMock } from "../../../tests/mock/prisma";
import { UpdateGroupDto } from "./update-group.dto";
import { UpdateGroupUseCase } from "./update-group.usecase";

function buildSUT(): { updateGroupUseCase: UpdateGroupUseCase } {
  const groupRepository = new GroupRepository(prismaMock);
  const updateGroupUseCase = new UpdateGroupUseCase(groupRepository);
  return { updateGroupUseCase };
}

describe("UpdateGroupUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UpdateGroupDto["data"] = {
      name: "TEST_GROUP",
    };
    let testData = { ...data };
    const { updateGroupUseCase } = buildSUT();

    await expect(
      updateGroupUseCase.validateUpdateGroupData(testData)
    ).resolves.toBeTruthy();

    testData = { ...data, name: "Test Group" };
    await expect(
      updateGroupUseCase.validateUpdateGroupData(testData)
    ).rejects.toThrowError(ValidationError);
  });
  it("should check if the group exists", async () => {
    const data: UpdateGroupDto = {
      id: "1",
      data: { name: "TEST_GROUP" },
    };
    const group = createFakeGroup({ id: data.id, name: "GROUP" }, 1);
    const { updateGroupUseCase } = buildSUT();

    prismaMock.group.findMany.mockResolvedValue([]);
    prismaMock.group.findUnique.mockResolvedValue(null);
    await expect(
      updateGroupUseCase.execute({ id: data.id, data: data.data })
    ).rejects.toThrow(GroupNotFoundError);

    prismaMock.group.findUnique.mockResolvedValue(group);
    prismaMock.group.update.mockResolvedValue({ ...group, name: "TEST_GROUP" });
    await expect(
      updateGroupUseCase.execute({ id: data.id, data: data.data })
    ).resolves.toBeTruthy();
  });
  it("should check if unique fields are not in use", async () => {
    const groups = [createFakeGroup({ name: "GROUP" }, 1)];
    const data: UpdateGroupDto = {
      id: "1",
      data: { name: "TEST_GROUP" },
    };
    const { updateGroupUseCase } = buildSUT();

    prismaMock.group.findMany.mockResolvedValue(groups);
    await expect(
      updateGroupUseCase.checkGroupUniqueFields(data.data)
    ).resolves.toBeTruthy();

    data.data.name = "GROUP";
    await expect(
      updateGroupUseCase.checkGroupUniqueFields(data.data)
    ).rejects.toThrow(IntegrityError);
  });
});
