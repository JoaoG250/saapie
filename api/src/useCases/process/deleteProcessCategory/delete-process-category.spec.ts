import { ProcessCategoryNotFoundError } from "../../../errors";
import { ProcessCategoryRepository } from "../../../repositories/process";
import { createFakeProcessCategory } from "../../../tests/fake/process";
import { prismaMock } from "../../../tests/mock/prisma";
import { DeleteProcessCategoryDto } from "./delete-process-category.dto";
import { DeleteProcessCategoryUseCase } from "./delete-process-category.usecase";

function buildSUT(): {
  deleteProcessCategoryUseCase: DeleteProcessCategoryUseCase;
} {
  const processCategoryRepository = new ProcessCategoryRepository(prismaMock);
  const deleteProcessCategoryUseCase = new DeleteProcessCategoryUseCase(
    processCategoryRepository
  );
  return { deleteProcessCategoryUseCase };
}

describe("DeleteProcessCategoryUseCase", () => {
  it("should check if the process category exists", async () => {
    const data: DeleteProcessCategoryDto = {
      id: "1",
    };
    const processCategory = createFakeProcessCategory({ id: data.id }, 1);
    const { deleteProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findUnique.mockResolvedValue(null);
    await expect(
      deleteProcessCategoryUseCase.getProcessCategoryById(data.id)
    ).rejects.toThrow(ProcessCategoryNotFoundError);

    prismaMock.processCategory.findUnique.mockResolvedValue(processCategory);
    await expect(
      deleteProcessCategoryUseCase.getProcessCategoryById(data.id)
    ).resolves.toBe(processCategory);
  });
  it("should delete the process category", async () => {
    const data: DeleteProcessCategoryDto = {
      id: "1",
    };
    const processCategory = createFakeProcessCategory({ id: data.id }, 1);
    const { deleteProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findUnique.mockResolvedValue(processCategory);
    prismaMock.processCategory.delete.mockResolvedValue(processCategory);
    await expect(
      deleteProcessCategoryUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
