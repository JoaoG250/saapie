import { ValidationError } from "yup";
import { IntegrityError } from "../../../errors";
import { GroupRepository } from "../../../repositories/group";
import { createFakeGroup } from "../../../tests/fake/group";
import { prismaMock } from "../../../tests/mock/prisma";
import { CreateGroupDto } from "./create-group.dto";
import { CreateGroupUseCase } from "./create-group.usecase";

function buildSUT(): {
  createGroupUseCase: CreateGroupUseCase;
} {
  const groupRepository = new GroupRepository(prismaMock);
  const createGroupUseCase = new CreateGroupUseCase(groupRepository);
  return { createGroupUseCase };
}

describe("CreateGroupUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: CreateGroupDto = {
      name: "TEST_GROUP",
    };
    let testData = { ...data };
    const { createGroupUseCase } = buildSUT();

    await expect(
      createGroupUseCase.validateCreateGroupData(testData)
    ).resolves.toBeTruthy();

    testData.name = "";
    await expect(
      createGroupUseCase.validateCreateGroupData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.name = "Test Group";
    await expect(
      createGroupUseCase.validateCreateGroupData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if unique fields are not in use", async () => {
    const groups = [createFakeGroup({ name: "GROUP" }, 1)];
    const data: CreateGroupDto = {
      name: "TEST_GROUP",
    };
    const { createGroupUseCase } = buildSUT();

    prismaMock.group.findMany.mockResolvedValue(groups);
    await expect(
      createGroupUseCase.checkGroupUniqueFields(data)
    ).resolves.toBeTruthy();

    data.name = "GROUP";
    await expect(
      createGroupUseCase.checkGroupUniqueFields(data)
    ).rejects.toThrow(IntegrityError);
  });
});
