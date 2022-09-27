import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";
import { FsStorageProvider } from "../../../providers/storage";
import {
  ProcessRequestAttachmentRepository,
  ProcessRequestRepository,
} from "../../../repositories/process";
import { createFakeProcessRequest } from "../../../tests/fake/process";
import { fsMock } from "../../../tests/mock/fs";
import { prismaMock } from "../../../tests/mock/prisma";
import { RemoveProcessRequestExtraAttachmentDto } from "./remove-process-request-extra-attachment.dto";
import { RemoveProcessRequestExtraAttachmentUseCase } from "./remove-process-request-extra-attachment.usecase";

function buildSUT(): {
  removeProcessRequestExtraAttachmentUseCase: RemoveProcessRequestExtraAttachmentUseCase;
} {
  const storageProvider = new FsStorageProvider(fsMock);
  const processRequestRepository = new ProcessRequestRepository(
    prismaMock,
    storageProvider
  );
  const processRequestAttachmentRepository =
    new ProcessRequestAttachmentRepository(prismaMock, storageProvider);
  const removeProcessRequestExtraAttachmentUseCase =
    new RemoveProcessRequestExtraAttachmentUseCase(
      processRequestRepository,
      processRequestAttachmentRepository
    );
  return { removeProcessRequestExtraAttachmentUseCase };
}

describe("RemoveProcessRequestExtraAttachmentUseCase", () => {
  it("should check if the process request exists", async () => {
    const { removeProcessRequestExtraAttachmentUseCase } = buildSUT();
    const data: RemoveProcessRequestExtraAttachmentDto = {
      id: "1",
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: "OPEN" },
      1
    );

    prismaMock.processRequest.findUnique.mockResolvedValue(null);
    await expect(
      removeProcessRequestExtraAttachmentUseCase.getProcessRequestById(data.id)
    ).rejects.toThrow(ProcessRequestNotFoundError);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    await expect(
      removeProcessRequestExtraAttachmentUseCase.getProcessRequestById(data.id)
    ).resolves.toBe(processRequest);
  });
  it("should check if the process request is closed", () => {
    const { removeProcessRequestExtraAttachmentUseCase } = buildSUT();
    const processRequest = createFakeProcessRequest({ status: "CLOSED" }, 1);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(() =>
      removeProcessRequestExtraAttachmentUseCase.checkRequestStatus(
        processRequest
      )
    ).toThrow(IntegrityError);

    processRequest.status = "OPEN";
    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(
      removeProcessRequestExtraAttachmentUseCase.checkRequestStatus(
        processRequest
      )
    ).toBeTruthy();
  });
  it("should remove the process request extra attachment", async () => {
    const data: RemoveProcessRequestExtraAttachmentDto = {
      id: "1",
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: "OPEN" },
      1
    );
    const { removeProcessRequestExtraAttachmentUseCase } = buildSUT();

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    prismaMock.processRequest.update.mockResolvedValue(processRequest);
    await expect(
      removeProcessRequestExtraAttachmentUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
