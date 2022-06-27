import { ValidationError } from "yup";
import { GroupNotFoundError, IntegrityError } from "../../../errors";
import { GroupRepository } from "../../../repositories/group";
import { ProcessRepository } from "../../../repositories/process";
import { createFakeGroup } from "../../../tests/fake/group";
import { createFakeProcess } from "../../../tests/fake/process";
import { prismaMock } from "../../../tests/mock/prisma";
import { CreateProcessDto } from "./create-process.dto";
import { CreateProcessUseCase } from "./create-process.usecase";

function buildSUT(): {
  createProcessUseCase: CreateProcessUseCase;
} {
  const processRepository = new ProcessRepository(prismaMock);
  const groupRepository = new GroupRepository(prismaMock);
  const createProcessUseCase = new CreateProcessUseCase(
    processRepository,
    groupRepository
  );
  return { createProcessUseCase };
}

describe("CreateProcessUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: CreateProcessDto = {
      name: "Test Process",
      description: "Test Form Description",
      form: {
        name: "Test Form",
        definition: {},
      },
      targetGroupId: "1",
      forwardToGroupId: "2",
    };
    let testData = { ...data };
    const { createProcessUseCase } = buildSUT();

    await expect(
      createProcessUseCase.validateCreateProcessData(testData)
    ).resolves.toBeTruthy();

    testData.name = "";
    await expect(
      createProcessUseCase.validateCreateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.name = "Te";
    await expect(
      createProcessUseCase.validateCreateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.form.name = "";
    await expect(
      createProcessUseCase.validateCreateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.targetGroupId = "";
    await expect(
      createProcessUseCase.validateCreateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.forwardToGroupId = "";
    await expect(
      createProcessUseCase.validateCreateProcessData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if target group exists", async () => {
    const data: CreateProcessDto = {
      name: "Test Process",
      description: "Test Form Description",
      form: {
        name: "Test Form",
        definition: {},
      },
      targetGroupId: "1",
      forwardToGroupId: "2",
    };
    const group = createFakeGroup({ id: "1" }, 1);
    const { createProcessUseCase } = buildSUT();

    prismaMock.group.findUnique.mockResolvedValue(null);
    await expect(
      createProcessUseCase.getGroupById(data.targetGroupId)
    ).rejects.toThrow(GroupNotFoundError);

    prismaMock.group.findUnique.mockResolvedValue(group);
    await expect(
      createProcessUseCase.getGroupById(data.targetGroupId)
    ).resolves.toBeTruthy();
  });
  it("should check if target group exists", async () => {
    const targetGroupId = "1";
    const group = createFakeGroup({ id: targetGroupId }, 1);
    const { createProcessUseCase } = buildSUT();

    prismaMock.group.findUnique.mockResolvedValue(null);
    await expect(
      createProcessUseCase.getGroupById(targetGroupId)
    ).rejects.toThrow(GroupNotFoundError);

    prismaMock.group.findUnique.mockResolvedValue(group);
    await expect(
      createProcessUseCase.getGroupById(targetGroupId)
    ).resolves.toBe(group);
  });
  it("should check if target group is not the same as forward-to group", () => {
    const targetGroup = createFakeGroup({ id: "1" }, 1);
    const forwardToGroup = createFakeGroup({ id: "2" }, 2);
    const { createProcessUseCase } = buildSUT();

    expect(
      createProcessUseCase.checkGroups(targetGroup, forwardToGroup)
    ).toBeTruthy();

    forwardToGroup.id = "1";
    expect(() => {
      createProcessUseCase.checkGroups(targetGroup, forwardToGroup);
    }).toThrow(IntegrityError);
  });
  it("should create a slug from process name", () => {
    const processName = "Test Process";
    const { createProcessUseCase } = buildSUT();

    expect(createProcessUseCase.createSlug(processName)).toBeTruthy();
  });
  it("should check if unique fields are not in use", async () => {
    const data: CreateProcessDto = {
      name: "Test Process",
      description: "Test Form Description",
      form: {
        name: "Test Form",
        definition: {},
      },
      targetGroupId: "1",
      forwardToGroupId: "2",
    };
    const processes = [
      createFakeProcess({ name: data.name }, 1),
      createFakeProcess({}, 2),
    ];
    const { createProcessUseCase } = buildSUT();

    prismaMock.process.findMany.mockResolvedValue(processes);
    await expect(
      createProcessUseCase.checkProcessUniqueFields(data, data.name)
    ).rejects.toThrow(IntegrityError);

    prismaMock.process.findMany.mockResolvedValue([]);
    await expect(
      createProcessUseCase.checkProcessUniqueFields(data, data.name)
    ).resolves.toBeTruthy();
  });
  it("should create the process", async () => {
    const data: CreateProcessDto = {
      name: "Test Process",
      description: "Test Form Description",
      form: {
        name: "Test Form",
        definition: {},
      },
      targetGroupId: "1",
    };
    const group = createFakeGroup({ id: "1" }, 1);
    const { createProcessUseCase } = buildSUT();

    prismaMock.group.findUnique.mockResolvedValue(group);
    prismaMock.process.findMany.mockResolvedValue([]);
    prismaMock.process.create.mockResolvedValue(
      createFakeProcess(
        { name: data.name, targetGroupId: data.targetGroupId },
        1
      )
    );
    await expect(createProcessUseCase.execute(data)).resolves.toBeTruthy();
  });
});
