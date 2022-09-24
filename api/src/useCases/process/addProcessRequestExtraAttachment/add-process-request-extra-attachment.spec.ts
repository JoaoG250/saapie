import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";
import { FsStorageProvider } from "../../../providers/storage";
import {
  ProcessRequestAttachmentRepository,
  ProcessRequestRepository,
} from "../../../repositories/process";
import { createFakeProcessRequest } from "../../../tests/fake/process";
import { fsMock } from "../../../tests/mock/fs";
import { prismaMock } from "../../../tests/mock/prisma";
import { AddProcessRequestExtraAttachmentDto } from "./add-process-request-extra-attachment.dto";
import { AddProcessRequestExtraAttachmentUseCase } from "./add-process-request-extra-attachment.usecase";

function buildSUT(): {
  addProcessRequestExtraAttachmentUseCase: AddProcessRequestExtraAttachmentUseCase;
} {
  const storageProvider = new FsStorageProvider(fsMock);
  const processRequestRepository = new ProcessRequestRepository(
    prismaMock,
    storageProvider
  );
  const processRequestAttachmentRepository =
    new ProcessRequestAttachmentRepository(prismaMock, storageProvider);
  const addProcessRequestExtraAttachmentUseCase =
    new AddProcessRequestExtraAttachmentUseCase(
      processRequestRepository,
      processRequestAttachmentRepository,
      storageProvider
    );
  return { addProcessRequestExtraAttachmentUseCase };
}

describe("AddProcessRequestExtraAttachmentUseCase", () => {
  it("should check if the process request exists", async () => {
    const { addProcessRequestExtraAttachmentUseCase } = buildSUT();
    const data: AddProcessRequestExtraAttachmentDto = {
      id: "1",
      attachment: {
        filename: "test.pdf",
        encoding: "utf-8",
        mimetype: "application/pdf",
        createReadStream() {
          return fsMock.createReadStream("");
        },
      },
    };
    const processRequest = createFakeProcessRequest(
      { id: data.id, status: "OPEN" },
      1
    );

    prismaMock.processRequest.findUnique.mockResolvedValue(null);
    await expect(
      addProcessRequestExtraAttachmentUseCase.getProcessRequestById(data.id)
    ).rejects.toThrow(ProcessRequestNotFoundError);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    await expect(
      addProcessRequestExtraAttachmentUseCase.getProcessRequestById(data.id)
    ).resolves.toBe(processRequest);
  });
  it("should check if the process request is closed", () => {
    const { addProcessRequestExtraAttachmentUseCase } = buildSUT();
    const processRequest = createFakeProcessRequest({ status: "CLOSED" }, 1);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(() =>
      addProcessRequestExtraAttachmentUseCase.checkRequestStatus(processRequest)
    ).toThrow(IntegrityError);

    processRequest.status = "OPEN";
    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    expect(
      addProcessRequestExtraAttachmentUseCase.checkRequestStatus(processRequest)
    ).toBeTruthy();
  });
});
