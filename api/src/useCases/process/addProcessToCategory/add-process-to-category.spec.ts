import {
  ProcessCategoryRepository,
  ProcessRepository,
} from "../../../repositories/process";
import { AddProcessToCategoryUseCase } from "./add-process-to-category.usecase";
import { prismaMock } from "../../../tests/mock/prisma";
import { AddProcessToCategoryDto } from "./add-process-to-category.dto";
import {
  createFakeProcess,
  createFakeProcessCategory,
} from "../../../tests/fake/process";
import {
  ProcessCategoryNotFoundError,
  ProcessNotFoundError,
} from "../../../errors";

function buildSUT(): {
  addProcessToCategoryUseCase: AddProcessToCategoryUseCase;
} {
  const processCategoryRepository = new ProcessCategoryRepository(prismaMock);
  const processRepository = new ProcessRepository(prismaMock);
  const addProcessToCategoryUseCase = new AddProcessToCategoryUseCase(
    processCategoryRepository,
    processRepository
  );
  return { addProcessToCategoryUseCase };
}

describe("AddProcessToCategoryUseCase", () => {
  it("should check if the process and process category exists", async () => {
    const data: AddProcessToCategoryDto = {
      processId: "1",
      processCategoryId: "1",
    };
    const process = createFakeProcess({ id: data.processId }, 1);
    const processCategory = createFakeProcessCategory(
      { id: data.processCategoryId },
      1
    );
    const { addProcessToCategoryUseCase } = buildSUT();

    await expect(addProcessToCategoryUseCase.execute(data)).rejects.toThrow(
      ProcessCategoryNotFoundError
    );
    prismaMock.processCategory.findUnique.mockResolvedValue(processCategory);

    await expect(addProcessToCategoryUseCase.execute(data)).rejects.toThrow(
      ProcessNotFoundError
    );
    prismaMock.process.findUnique.mockResolvedValue(process);

    await expect(
      addProcessToCategoryUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
