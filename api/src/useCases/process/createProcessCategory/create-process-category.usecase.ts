import * as yup from "yup";
import { ProcessCategory } from "@prisma/client";
import slugify from "slugify";
import { IntegrityError } from "../../../errors";
import { IProcessCategoryRepository, IUseCase } from "../../../interfaces";
import { CreateProcessCategoryDto } from "./create-process-category.dto";

export class CreateProcessCategoryUseCase
  implements IUseCase<CreateProcessCategoryDto, ProcessCategory>
{
  constructor(
    private readonly processCategoryRepository: IProcessCategoryRepository
  ) {}

  async validateCreateProcessCategoryData(
    data: CreateProcessCategoryDto
  ): Promise<CreateProcessCategoryDto> {
    const createProcessCategoryDataConstraints = yup.object().shape({
      name: yup.string().required().min(3).max(80).trim(),
    });
    return createProcessCategoryDataConstraints.validate(data);
  }

  createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async checkProcessCategoryUniqueFields(
    data: CreateProcessCategoryDto,
    slug: string
  ): Promise<true> {
    const matchingProcessCategories =
      await this.processCategoryRepository.findMany({
        where: {
          OR: [{ name: data.name }, { slug }],
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

  async execute(args: CreateProcessCategoryDto): Promise<ProcessCategory> {
    const validatedData = await this.validateCreateProcessCategoryData(args);
    const slug = this.createSlug(validatedData.name);
    await this.checkProcessCategoryUniqueFields(validatedData, slug);
    return this.processCategoryRepository.create({
      name: validatedData.name,
      slug,
    });
  }
}
