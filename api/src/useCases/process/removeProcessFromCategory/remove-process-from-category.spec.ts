import {
  ProcessCategoryNotFoundError,
  ProcessNotFoundError,
} from "../../../errors";
import {
  ProcessCategoryRepository,
  ProcessRepository,
} from "../../../repositories/process";
import {
  createFakeProcess,
  createFakeProcessCategory,
} from "../../../tests/fake/process";
import { prismaMock } from "../../../tests/mock/prisma";
import { RemoveProcessFromCategoryDto } from "./remove-process-from-category.dto";
import { RemoveProcessFromCategoryUseCase } from "./remove-process-from-category.usecase";

function buildSUT(): {
  removeProcessFromCategoryUseCase: RemoveProcessFromCategoryUseCase;
} {
  const processRepository = new ProcessRepository(prismaMock);
  const processCategoryRepository = new ProcessCategoryRepository(prismaMock);
  const removeProcessFromCategoryUseCase = new RemoveProcessFromCategoryUseCase(
    processCategoryRepository,
    processRepository
  );
  return { removeProcessFromCategoryUseCase };
}

describe("RemoveProcessFromCategoryUseCase", () => {
  it("should check if the process and process category exists", async () => {
    const data: RemoveProcessFromCategoryDto = {
      processId: "1",
      processCategoryId: "1",
    };
    const process = createFakeProcess({ id: data.processId }, 1);
    const processCategory = createFakeProcessCategory(
      { id: data.processCategoryId },
      1
    );
    const { removeProcessFromCategoryUseCase } = buildSUT();

    await expect(
      removeProcessFromCategoryUseCase.execute(data)
    ).rejects.toThrow(ProcessCategoryNotFoundError);
    prismaMock.processCategory.findUnique.mockResolvedValue(processCategory);

    await expect(
      removeProcessFromCategoryUseCase.execute(data)
    ).rejects.toThrow(ProcessNotFoundError);
    prismaMock.process.findUnique.mockResolvedValue(process);

    await expect(
      removeProcessFromCategoryUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
