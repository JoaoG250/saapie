import * as yup from "yup";
import slugify from "slugify";
import { IProcessCategoryRepository, IUseCase } from "../../../interfaces";
import { UpdateProcessCategoryDto } from "./update-process-category.dto";
import { ProcessCategory } from "@prisma/client";
import { IntegrityError, ProcessCategoryNotFoundError } from "../../../errors";

export class UpdateProcessCategoryUseCase
  implements IUseCase<UpdateProcessCategoryDto, ProcessCategory>
{
  constructor(
    private readonly processCategoryRepository: IProcessCategoryRepository
  ) {}

  async validateUpdateProcessCategoryData(
    data: UpdateProcessCategoryDto["data"]
  ): Promise<UpdateProcessCategoryDto["data"]> {
    const updateProcessCategoryDataConstraints = yup.object().shape({
      name: yup.string().required().min(3).max(80).trim(),
    });
    return updateProcessCategoryDataConstraints.validate(data);
  }

  async getProcessCategoryById(id: string): Promise<ProcessCategory> {
    const processCategory = await this.processCategoryRepository.findOne({
      id,
    });
    if (!processCategory) {
      throw new ProcessCategoryNotFoundError("Process category not found");
    }
    return processCategory;
  }

  createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async checkProcessCategoryUniqueFields(
    data: UpdateProcessCategoryDto["data"],
    slug: string,
    processCategory: ProcessCategory
  ): Promise<true> {
    const matchingProcessCategories =
      await this.processCategoryRepository.findMany({
        where: {
          OR: [{ name: data.name }, { slug }],
          NOT: { id: processCategory.id },
        },
      });
    matchingProcessCategories.forEach((processCategory) => {
      if (processCategory.name === data.name) {
        throw new IntegrityError("Process category name already exists");
      }
      if (processCategory.slug === slug) {
        throw new IntegrityError("Process category slug already exists");
      }
    });
    return true;
  }

  async execute(args: UpdateProcessCategoryDto): Promise<ProcessCategory> {
    const validatedData = await this.validateUpdateProcessCategoryData(
      args.data
    );
    const processCategory = await this.getProcessCategoryById(args.id);
    const slug = this.createSlug(validatedData.name);
    await this.checkProcessCategoryUniqueFields(
      validatedData,
      slug,
      processCategory
    );
    return this.processCategoryRepository.update(
      { id: processCategory.id },
      { name: validatedData.name, slug }
    );
  }
}
