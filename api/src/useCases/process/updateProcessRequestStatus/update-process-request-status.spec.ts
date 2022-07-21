import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";
import { FsStorageProvider } from "../../../providers/storage";
import {
  ProcessRepository,
  ProcessRequestRepository,
} from "../../../repositories/process";
import {
  createFakeProcess,
  createFakeProcessRequest,
} from "../../../tests/fake/process";
import { fsMock } from "../../../tests/mock/fs";
import { prismaMock } from "../../../tests/mock/prisma";
import { UpdateProcessRequestStatusDto } from "./update-process-request-status.dto";
import { UpdateProcessRequestStatusUseCase } from "./update-process-request-status.usecase";

function buildSUT(): {
  updateProcessRequestStatusUseCase: UpdateProcessRequestStatusUseCase;
} {
  const storeProvider = new FsStorageProvider(fsMock);
  const processRequestRepository = new ProcessRequestRepository(
    prismaMock,
    storeProvider
  );
  const processRepository = new ProcessRepository(prismaMock);
  const updateProcessRequestStatusUseCase =
    new UpdateProcessRequestStatusUseCase(
      processRequestRepository,
      processRepository
    );
  return { updateProcessRequestStatusUseCase };
}

describe("UpdateProcessRequestStatusUseCase", () => {
  it("should check if the process request exists", async () => {
    const { updateProcessRequestStatusUseCase } = buildSUT();
    const data: UpdateProcessRequestStatusDto = {
      id: "1",
      status: "OPEN",
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: data.status },
      1
    );

    prismaMock.processRequest.findUnique.mockResolvedValue(null);
    await expect(
      updateProcessRequestStatusUseCase.getProcessRequestById(data.id)
    ).rejects.toThrow(ProcessRequestNotFoundError);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    await expect(
      updateProcessRequestStatusUseCase.getProcessRequestById(data.id)
    ).resolves.toBe(processRequest);
  });
  it("should check if new status is valid", () => {
    const { updateProcessRequestStatusUseCase } = buildSUT();
    const data: UpdateProcessRequestStatusDto = {
      id: "1",
      status: "FORWARDED",
    };
    const process = createFakeProcess({ id: "1", forwardToGroupId: "1" }, 1);
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: "OPEN", processId: "1" },
      1
    );

    prismaMock.process.findUnique.mockResolvedValue(process);
    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(
      updateProcessRequestStatusUseCase.checkNewStatus(data.status, process)
    ).toBeTruthy();

    process.forwardToGroupId = null;
    prismaMock.process.findUnique.mockResolvedValue(process);
    expect(() =>
      updateProcessRequestStatusUseCase.checkNewStatus(data.status, process)
    ).toThrow(IntegrityError);
  });
  it("should update the status", async () => {
    const { updateProcessRequestStatusUseCase } = buildSUT();
    const data: UpdateProcessRequestStatusDto = {
      id: "1",
      status: "PENDING_CHANGE",
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: data.status },
      1
    );
    const process = createFakeProcess({ id: "1" }, 1);

    prismaMock.process.findUnique.mockResolvedValue(process);
    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    prismaMock.processRequest.update.mockResolvedValue(processRequest);
    await expect(updateProcessRequestStatusUseCase.execute(data)).resolves.toBe(
      processRequest
    );
  });
});
