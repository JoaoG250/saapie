import { Group } from "@prisma/client";
import { ValidationError } from "yup";
import { IntegrityError } from "../src/errors";
import { CreateGroupDto } from "../src/interfaces";
import { GroupRepository } from "../src/repositories/group";
import { UserRepository } from "../src/repositories/user";
import { GroupService } from "../src/services/group";
import { prismaMock } from "./mock/prisma";

const buildSUT = (): {
  groupService: GroupService;
} => {
  const userRepository = new UserRepository(prismaMock);
  const groupRepository = new GroupRepository(prismaMock);
  const groupService = new GroupService(groupRepository, userRepository);
  return { groupService };
};

describe("CreateGroup", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: CreateGroupDto = {
      name: "TEST_GROUP",
    };
    let testData = { ...data };
    const { groupService } = buildSUT();

    await expect(
      groupService.validateCreateGroupData(testData)
    ).resolves.toBeTruthy();

    testData.name = "";
    await expect(
      groupService.validateCreateGroupData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.name = "Test Group";
    await expect(
      groupService.validateCreateGroupData(testData)
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
    const { groupService } = buildSUT();

    prismaMock.group.findMany.mockResolvedValue(groups);
    await expect(
      groupService.checkGroupUniqueFields(data)
    ).resolves.toBeTruthy();

    data.name = "GROUP_1";
    await expect(groupService.checkGroupUniqueFields(data)).rejects.toThrow(
      IntegrityError
    );
  });
});
