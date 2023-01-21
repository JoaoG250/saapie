import { ProcessCategoryRepository } from "../../../repositories/process";
import { CreateProcessCategoryUseCase } from "./create-process-category.usecase";
import { prismaMock } from "../../../tests/mock/prisma";
import { CreateProcessCategoryDto } from "./create-process-category.dto";
import { ValidationError } from "yup";
import { IntegrityError } from "../../../errors";
import { createFakeProcessCategory } from "../../../tests/fake/process";

function buildSUT(): {
  createProcessCategoryUseCase: CreateProcessCategoryUseCase;
} {
  const processCategoryRepository = new ProcessCategoryRepository(prismaMock);
  const createProcessCategoryUseCase = new CreateProcessCategoryUseCase(
    processCategoryRepository
  );
  return { createProcessCategoryUseCase };
}

describe("CreateProcessCategoryUseCase", () => {
  it("should check if all fields are within assigned constraints", async () => {
    const data: CreateProcessCategoryDto = {
      name: "Test process category",
      description: "Test description",
    };
    let testData = { ...data };
    const { createProcessCategoryUseCase } = buildSUT();

    await expect(
      createProcessCategoryUseCase.validateCreateProcessCategoryData(testData)
    ).resolves.toBeTruthy();

    testData.name = "";
    await expect(
      createProcessCategoryUseCase.validateCreateProcessCategoryData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.name = "Te";
    await expect(
      createProcessCategoryUseCase.validateCreateProcessCategoryData(testData)
    ).rejects.toThrow(ValidationError);

    testData = { ...data };
    testData.description = "";
    await expect(
      createProcessCategoryUseCase.validateCreateProcessCategoryData(testData)
    ).rejects.toThrow(ValidationError);
  });
  it("should create a slug from process category name", () => {
    const processCategoryName = "Test Process";
    const { createProcessCategoryUseCase } = buildSUT();

    expect(
      createProcessCategoryUseCase.createSlug(processCategoryName)
    ).toBeTruthy();
  });
  it("should check if unique fields are not in use", async () => {
    const data: CreateProcessCategoryDto = {
      name: "Test process category",
      description: "Test description",
    };
    const processCategories = [
      createFakeProcessCategory({ name: data.name }, 1),
      createFakeProcessCategory({}, 2),
    ];
    const { createProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findMany.mockResolvedValue(processCategories);
    await expect(
      createProcessCategoryUseCase.checkProcessCategoryUniqueFields(
        data,
        data.name
      )
    ).rejects.toThrow(IntegrityError);

    prismaMock.processCategory.findMany.mockResolvedValue([]);
    await expect(
      createProcessCategoryUseCase.checkProcessCategoryUniqueFields(
        data,
        data.name
      )
    ).resolves.toBeTruthy();
  });
  it("should create the process category", async () => {
    const data: CreateProcessCategoryDto = {
      name: "Test process category",
      description: "Test description",
    };
    const { createProcessCategoryUseCase } = buildSUT();

    prismaMock.processCategory.findMany.mockResolvedValue([]);
    prismaMock.processCategory.create.mockResolvedValue(
      createFakeProcessCategory(
        { name: data.name, description: data.description },
        1
      )
    );
    await expect(
      createProcessCategoryUseCase.execute(data)
    ).resolves.toBeTruthy();
  });
});
