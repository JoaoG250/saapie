import { Group } from "@prisma/client";
import { ValidationError } from "yup";
import { IntegrityError } from "../../../errors";
import { CreateGroupDto } from "../../../interfaces";
import { GroupRepository } from "../../../repositories/group";
import { prismaMock } from "../../../../tests/mock/prisma";
import { CreateGroupUseCase } from "./create-group.usecase";

const buildSUT = (): {
  createGroupUseCase: CreateGroupUseCase;
} => {
  const groupRepository = new GroupRepository(prismaMock);
  const createGroupUseCase = new CreateGroupUseCase(groupRepository);
  return { createGroupUseCase };
};

describe("CreateGroup", () => {
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
    const groups: Group[] = [
      {
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "GROUP_1",
      },
    ];
    const data: CreateGroupDto = {
      name: "TEST_GROUP",
    };
    const { createGroupUseCase } = buildSUT();

    prismaMock.group.findMany.mockResolvedValue(groups);
    await expect(
      createGroupUseCase.checkGroupUniqueFields(data)
    ).resolves.toBeTruthy();

    data.name = "GROUP_1";
    await expect(
      createGroupUseCase.checkGroupUniqueFields(data)
    ).rejects.toThrow(IntegrityError);
  });
});
