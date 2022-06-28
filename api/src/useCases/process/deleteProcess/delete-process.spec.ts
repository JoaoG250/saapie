import { ProcessNotFoundError } from "../../../errors";
import { ProcessRepository } from "../../../repositories/process";
import { createFakeProcess } from "../../../tests/fake/process";
import { prismaMock } from "../../../tests/mock/prisma";
import { DeleteProcessDto } from "./delete-process.dto";
import { DeleteProcessUseCase } from "./delete-process.usecase";

function buildSUT(): {
  deleteProcessUseCase: DeleteProcessUseCase;
} {
  const processRepository = new ProcessRepository(prismaMock);
  const deleteProcessUseCase = new DeleteProcessUseCase(processRepository);
  return { deleteProcessUseCase };
}

describe("DeleteProcessUseCase", () => {
  it("should check if the process exists", async () => {
    const data: DeleteProcessDto = {
      id: "1",
    };
    const process = createFakeProcess({ id: data.id }, 1);
    const { deleteProcessUseCase } = buildSUT();

    prismaMock.process.findUnique.mockResolvedValue(null);
    await expect(deleteProcessUseCase.getProcessById(data.id)).rejects.toThrow(
      ProcessNotFoundError
    );

    prismaMock.process.findUnique.mockResolvedValue(process);
    await expect(deleteProcessUseCase.getProcessById(data.id)).resolves.toBe(
      process
    );
  });
  it("should delete the process", async () => {
    const data: DeleteProcessDto = {
      id: "1",
    };
    const process = createFakeProcess({ id: data.id }, 1);
    const { deleteProcessUseCase } = buildSUT();

    prismaMock.process.findUnique.mockResolvedValue(process);
    prismaMock.process.delete.mockResolvedValue(process);
    await expect(deleteProcessUseCase.execute(data)).resolves.toBeTruthy();
  });
});
