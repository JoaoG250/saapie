import { ValidationError } from "yup";
import { prismaMock } from "../../../tests/mock/prisma";
import { ProcessCategoryRepository } from "../../../repositories/process";
import { UpdateProcessCategoryDto } from "./update-process-category.dto";
import { createFakeProcessCategory } from "../../../tests/fake/process";
import { IntegrityError, ProcessCategoryNotFoundError } from "../../../errors";
import { UpdateProcessCategoryUseCase } from "./update-process-category.usecase";

function buildSUT(): {
  updateProcessCategoryUseCase: UpdateProcessCategoryUseCase;
} {
  const processCategoryRepository = new ProcessCategoryRepository(prismaMock);
  const updateProcessCategoryUseCase = new UpdateProcessCategoryUseCase(
    processCategoryRepository
  );
  return { updateProcessCategoryUseCase };
}

describe("UpdateProcessCategoryUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: UpdateProcessCategoryDto["data"] = {
      name: "Test process category",
      description: "Test description",
    };
    let testData = { ...data };
    const { updateProcessCategoryUseCase } = buildSUT();

    await expect(
      updateProcessCategoryUseCase.validateUpdateProcessCategoryData(testData)
    ).resolves.toBeTruthy();

    testData.name = "";
    await expect(
      updateProcessCategoryUseCase.validateUpdateProcessCategoryData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.name = "Te";
    await expect(
      updateProcessCategoryUseCase.validateUpdateProcessCategoryData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.description = "";
    await expect(
      updateProcessCategoryUseCase.validateUpdateProcessCategoryData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should check if the process category exists", async () => {
    const processCategoryId = "1";
    const processCategory = createFakeProcessCategory(
      { id: processCategoryId },
      1
    );
    const { updateProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findUnique.mockResolvedValue(null);
    await expect(
      updateProcessCategoryUseCase.getProcessCategoryById(processCategoryId)
    ).rejects.toThrow(ProcessCategoryNotFoundError);

    prismaMock.processCategory.findUnique.mockResolvedValue(processCategory);
    await expect(
      updateProcessCategoryUseCase.getProcessCategoryById(processCategoryId)
    ).resolves.toBeTruthy();
  });
  it("should create a slug from process category name", () => {
    const processCategoryName = "Test process category";
    const { updateProcessCategoryUseCase } = buildSUT();

    expect(
      updateProcessCategoryUseCase.createSlug(processCategoryName)
    ).toBeTruthy();
  });
  it("should check if unique fields are not in use", async () => {
    const processCategory = createFakeProcessCategory({ id: "1" }, 1);
    const data: UpdateProcessCategoryDto["data"] = {
      name: "Test process category",
      description: "Test description",
    };
    const processCategories = [
      createFakeProcessCategory({ name: data.name }, 1),
      createFakeProcessCategory({}, 2),
    ];
    const { updateProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findMany.mockResolvedValue(processCategories);
    await expect(
      updateProcessCategoryUseCase.checkProcessCategoryUniqueFields(
        data,
        data.name,
        processCategory
      )
    ).rejects.toThrow(IntegrityError);

    prismaMock.processCategory.findMany.mockResolvedValue([]);
    await expect(
      updateProcessCategoryUseCase.checkProcessCategoryUniqueFields(
        data,
        data.name,
        processCategory
      )
    ).resolves.toBeTruthy();
  });
  it("should update the process category", async () => {
    const data: UpdateProcessCategoryDto = {
      id: "1",
      data: {
        name: "Test process category",
        description: "Test description",
      },
    };
    const processCategory = createFakeProcessCategory({ id: data.id }, 1);
    const { updateProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findUnique.mockResolvedValue(processCategory);
    prismaMock.processCategory.findMany.mockResolvedValue([]);
    prismaMock.processCategory.update.mockResolvedValue(processCategory);
    await expect(
      updateProcessCategoryUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
