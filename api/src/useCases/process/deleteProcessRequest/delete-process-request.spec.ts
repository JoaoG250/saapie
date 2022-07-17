import { ProcessRequestNotFoundError } from "../../../errors";
import { FsStorageProvider } from "../../../providers/storage";
import { ProcessRequestRepository } from "../../../repositories/process";
import { createFakeProcessRequest } from "../../../tests/fake/process";
import { fsMock } from "../../../tests/mock/fs";
import { prismaMock } from "../../../tests/mock/prisma";
import { DeleteProcessRequestUseCase } from "./delete-process-request";
import { DeleteProcessRequestDto } from "./delete-process-request.dto";

function buildSUT(): {
  deleteProcessRequestUseCase: DeleteProcessRequestUseCase;
} {
  const storageProvider = new FsStorageProvider(fsMock);
  const processRequestRepository = new ProcessRequestRepository(
    prismaMock,
    storageProvider
  );
  const deleteProcessRequestUseCase = new DeleteProcessRequestUseCase(
    processRequestRepository
  );
  return { deleteProcessRequestUseCase };
}

describe("DeleteProcessRequestUseCase", () => {
  it("should check if the process request exists", async () => {
    const data: DeleteProcessRequestDto = {
      id: "1",
    };
    const processRequest = createFakeProcessRequest({ id: data.id }, 1);
    const { deleteProcessRequestUseCase } = buildSUT();

    prismaMock.processRequest.findUnique.mockResolvedValue(null);
    await expect(
      deleteProcessRequestUseCase.getProcessRequestById(data.id)
    ).rejects.toThrow(ProcessRequestNotFoundError);

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    await expect(
      deleteProcessRequestUseCase.getProcessRequestById(data.id)
    ).resolves.toBe(processRequest);
  });
  it("should delete the process request", async () => {
    const data: DeleteProcessRequestDto = {
      id: "1",
    };
    const processRequest = createFakeProcessRequest({ id: data.id }, 1);
    const { deleteProcessRequestUseCase } = buildSUT();

    prismaMock.processRequest.findUnique.mockResolvedValue(processRequest);
    prismaMock.processRequestAttachment.findMany.mockResolvedValue([]);
    prismaMock.processRequest.delete.mockResolvedValue(processRequest);
    await expect(deleteProcessRequestUseCase.execute(data)).resolves.toBe(
      processRequest
    );
  });
});
