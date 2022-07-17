import { ProcessNotFoundError, UserNotFoundError } from "../../../errors";
import { FsStorageProvider } from "../../../providers/storage";
import {
  ProcessRepository,
  ProcessRequestAttachmentRepository,
  ProcessRequestRepository,
} from "../../../repositories/process";
import { UserRepository } from "../../../repositories/user";
import {
  createFakeProcess,
  createFakeProcessRequest,
} from "../../../tests/fake/process";
import { createFakeUser } from "../../../tests/fake/user";
import { fsMock } from "../../../tests/mock/fs";
import { prismaMock } from "../../../tests/mock/prisma";
import { CreateProcessRequestDto } from "./create-process-request.dto";
import { CreateProcessRequestUseCase } from "./create-process-request.usecase";

function buildSUT(): {
  createProcessRequestUseCase: CreateProcessRequestUseCase;
} {
  const storageProvider = new FsStorageProvider(fsMock);
  const processRequestRepository = new ProcessRequestRepository(
    prismaMock,
    storageProvider
  );
  const processRequestAttachmentRepository =
    new ProcessRequestAttachmentRepository(prismaMock);
  const processRepository = new ProcessRepository(prismaMock);
  const userRepository = new UserRepository(prismaMock);
  const createProcessRequestUseCase = new CreateProcessRequestUseCase(
    processRequestRepository,
    processRequestAttachmentRepository,
    processRepository,
    userRepository,
    storageProvider
  );
  return { createProcessRequestUseCase };
}

describe("CreateProcessRequestUseCase", () => {
  it("should check if the process exists", async () => {
    const { createProcessRequestUseCase } = buildSUT();
    const data: CreateProcessRequestDto = {
      processId: "1",
      processSlug: "test-process",
      userId: "1",
      data: {},
    };
    const process = createFakeProcess({ id: data.processId }, 1);

    prismaMock.process.findUnique.mockResolvedValue(null);
    await expect(
      createProcessRequestUseCase.getProcess(data.processId)
    ).rejects.toThrow(ProcessNotFoundError);

    prismaMock.process.findUnique.mockResolvedValue(process);
    await expect(
      createProcessRequestUseCase.getProcess(data.processId)
    ).resolves.toBeTruthy();
  });
  it("should check if the user exists", async () => {
    const { createProcessRequestUseCase } = buildSUT();
    const data: CreateProcessRequestDto = {
      processId: "1",
      processSlug: "test-process",
      userId: "1",
      data: {},
    };
    const user = createFakeUser({ id: data.userId }, 1);

    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(
      createProcessRequestUseCase.getUserById(data.userId)
    ).rejects.toThrow(UserNotFoundError);

    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(
      createProcessRequestUseCase.getUserById(data.userId)
    ).resolves.toBeTruthy();
  });
  it("should check if the user has a request open for the same process", async () => {
    const { createProcessRequestUseCase } = buildSUT();
    const data: CreateProcessRequestDto = {
      processId: "1",
      processSlug: "test-process",
      userId: "1",
      data: {},
    };
    const user = createFakeUser({ id: data.userId }, 1);
    const process = createFakeProcess({ id: data.processId }, 1);
    const processRequest = createFakeProcessRequest({}, 1);

    prismaMock.processRequest.findMany.mockResolvedValue([processRequest]);
    await expect(
      createProcessRequestUseCase.userHasRequestOpen(user, process)
    ).resolves.toBeTruthy();

    prismaMock.processRequest.findMany.mockResolvedValue([]);
    await expect(
      createProcessRequestUseCase.userHasRequestOpen(user, process)
    ).resolves.toBeFalsy();
  });
  it("should create the process request", async () => {
    const { createProcessRequestUseCase } = buildSUT();
    const data: CreateProcessRequestDto = {
      processId: "1",
      processSlug: "test-process",
      userId: "1",
      data: {},
    };
    const user = createFakeUser({ id: data.userId }, 1);
    const process = createFakeProcess({ id: data.processId }, 1);
    const processRequest = createFakeProcessRequest({}, 1);

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.process.findUnique.mockResolvedValue(process);
    prismaMock.processRequest.findMany.mockResolvedValue([]);
    prismaMock.processRequest.create.mockResolvedValue(processRequest);

    await expect(
      createProcessRequestUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
