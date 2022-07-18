import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";
import { FsStorageProvider } from "../../../providers/storage";
import {
  ProcessRequestAttachmentRepository,
  ProcessRequestRepository,
} from "../../../repositories/process";
import { createFakeProcessRequest } from "../../../tests/fake/process";
import { fsMock } from "../../../tests/mock/fs";
import { prismaMock } from "../../../tests/mock/prisma";
import { UpdateProcessRequestDto } from "./update-process-request.dto";
import { UpdateProcessRequestUseCase } from "./update-process-request.usecase";

function buildSUT(): {
  updateProcessRequestUseCase: UpdateProcessRequestUseCase;
} {
  const storageProvider = new FsStorageProvider(fsMock);
  const processRequestRepository = new ProcessRequestRepository(
    prismaMock,
    storageProvider
  );
  const processRequestAttachmentRepository =
    new ProcessRequestAttachmentRepository(prismaMock, storageProvider);
  const updateProcessRequestUseCase = new UpdateProcessRequestUseCase(
    processRequestRepository,
    processRequestAttachmentRepository,
    storageProvider
  );
  return { updateProcessRequestUseCase };
}

describe("UpdateProcessRequestUseCase", () => {
  it("should check if the process request exists", async () => {
    const { updateProcessRequestUseCase } = buildSUT();
    const data: UpdateProcessRequestDto = {
      id: "1",
      data: {},
      attachments: [],
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: "OPEN" },
      1
    );

    prismaMock.processRequest.findUnique.mockResolvedValue(null);
    await expect(
      updateProcessRequestUseCase.getProcessRequestById(data.id)
    ).rejects.toThrow(ProcessRequestNotFoundError);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    await expect(
      updateProcessRequestUseCase.getProcessRequestById(data.id)
    ).resolves.toBe(processRequest);
  });
  it("should check if the process request is closed", () => {
    const { updateProcessRequestUseCase } = buildSUT();
    const processRequest = createFakeProcessRequest({ status: "CLOSED" }, 1);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(() =>
      updateProcessRequestUseCase.checkRequestStatus(processRequest)
    ).toThrow(IntegrityError);

    processRequest.status = "OPEN";
    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(
      updateProcessRequestUseCase.checkRequestStatus(processRequest)
    ).toBeTruthy();
  });
  it("should update the process request", async () => {
    const data: UpdateProcessRequestDto = {
      id: "1",
      data: {},
      attachments: [],
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: "OPEN" },
      1
    );
    const { updateProcessRequestUseCase } = buildSUT();

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    prismaMock.processRequest.update.mockResolvedValue(processRequest);
    await expect(
      updateProcessRequestUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
