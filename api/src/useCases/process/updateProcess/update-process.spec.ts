import { ValidationError } from "yup";
import {
  GroupNotFoundError,
  IntegrityError,
  ProcessNotFoundError,
} from "../../../errors";
import { ProcessWithGroups } from "../../../interfaces";
import { GroupRepository } from "../../../repositories/group";
import { ProcessRepository } from "../../../repositories/process";
import { createFakeGroup } from "../../../tests/fake/group";
import { createFakeProcess } from "../../../tests/fake/process";
import { prismaMock } from "../../../tests/mock/prisma";
import { UpdateProcessDto } from "./update-process.dto";
import { UpdateProcessUseCase } from "./update-process.usecase";

function buildSUT(): {
  updateProcessUseCase: UpdateProcessUseCase;
} {
  const processRepository = new ProcessRepository(prismaMock);
  const groupRepository = new GroupRepository(prismaMock);
  const updateProcessUseCase = new UpdateProcessUseCase(
    processRepository,
    groupRepository
  );
  return { updateProcessUseCase };
}

describe("UpdateProcessUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UpdateProcessDto["data"] = {
      name: "Test Process",
      description: "Test Form Description",
      form: {
        name: "Test Form",
        definition: [],
      },
      targetGroupId: "1",
      forwardToGroupId: "2",
    };
    let testData = { ...data };
    const { updateProcessUseCase } = buildSUT();

    await expect(
      updateProcessUseCase.validateUpdateProcessData(testData)
    ).resolves.toBeTruthy();

    testData.name = "";
    await expect(
      updateProcessUseCase.validateUpdateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.name = "Te";
    await expect(
      updateProcessUseCase.validateUpdateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.form.name = "";
    await expect(
      updateProcessUseCase.validateUpdateProcessData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.targetGroupId = "";
    await expect(
      updateProcessUseCase.validateUpdateProcessData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if the process exists", async () => {
    const processId = "1";
    const process = createFakeProcess({ id: processId }, 1);
    const { updateProcessUseCase } = buildSUT();

    prismaMock.process.findUnique.mockResolvedValue(null);
    await expect(
      updateProcessUseCase.getProcessById(processId)
    ).rejects.toThrow(ProcessNotFoundError);

    prismaMock.process.findUnique.mockResolvedValue(process);
    await expect(
      updateProcessUseCase.getProcessById(processId)
    ).resolves.toBeTruthy();
  });
  it("should check if target group exists", async () => {
    const targetGroupId = "1";
    const group = createFakeGroup({ id: targetGroupId }, 1);
    const { updateProcessUseCase } = buildSUT();

    prismaMock.group.findUnique.mockResolvedValue(null);
    await expect(
      updateProcessUseCase.getGroupById(targetGroupId)
    ).rejects.toThrow(GroupNotFoundError);

    prismaMock.group.findUnique.mockResolvedValue(group);
    await expect(
      updateProcessUseCase.getGroupById(targetGroupId)
    ).resolves.toBeTruthy();
  });
  it("should check if target group is not the same as forward-to group", () => {
    const targetGroupId = createFakeGroup({ id: "1" }, 1);
    const forwardToGroupId = createFakeGroup({ id: "2" }, 1);
    const { updateProcessUseCase } = buildSUT();

    expect(
      updateProcessUseCase.checkGroups(targetGroupId, forwardToGroupId)
    ).toBeTruthy();

    forwardToGroupId.id = targetGroupId.id;
    expect(() =>
      updateProcessUseCase.checkGroups(targetGroupId, forwardToGroupId)
    ).toThrow(IntegrityError);
  });
  it("should create a slug from process name", () => {
    const processName = "Test Process";
    const { updateProcessUseCase } = buildSUT();

    expect(updateProcessUseCase.createSlug(processName)).toBeTruthy();
  });
  it("should check if unique fields are not in use", async () => {
    const process = createFakeProcess({ id: "1" }, 1);
    const data: UpdateProcessDto["data"] = {
      name: "Test Process",
      description: "Test Form Description",
      form: {
        name: "Test Form",
        definition: [],
      },
      targetGroupId: "1",
      forwardToGroupId: "2",
    };
    const processes = [
      createFakeProcess({ name: data.name }, 1),
      createFakeProcess({}, 2),
    ];
    const { updateProcessUseCase } = buildSUT();

    prismaMock.process.findMany.mockResolvedValue(processes);
    await expect(
      updateProcessUseCase.checkProcessUniqueFields(data, data.name, process)
    ).rejects.toThrow(IntegrityError);

    prismaMock.process.findMany.mockResolvedValue([]);
    await expect(
      updateProcessUseCase.checkProcessUniqueFields(data, data.name, process)
    ).resolves.toBeTruthy();
  });
  it("should update the process", async () => {
    const data: UpdateProcessDto = {
      id: "1",
      data: {
        name: "Test Process",
        description: "Test Form Description",
        form: {
          name: "Test Form",
          definition: [],
        },
        targetGroupId: "1",
      },
    };
    const group = createFakeGroup({ id: "1" }, 1);
    const process: ProcessWithGroups = {
      ...createFakeProcess({ id: "1" }, 1),
      targetGroup: group,
      forwardToGroup: null,
    };
    const { updateProcessUseCase } = buildSUT();

    prismaMock.process.findUnique.mockResolvedValue(process);
    prismaMock.group.findUnique.mockResolvedValue(group);
    prismaMock.process.findMany.mockResolvedValue([]);
    prismaMock.process.update.mockResolvedValue(process);
    await expect(updateProcessUseCase.execute(data)).resolves.toBeTruthy();
  });
});
