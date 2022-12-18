import { ProcessCategory } from "@prisma/client";
import { IProcessCategoryRepository, IUseCase } from "../../../interfaces";
import { GetProcessCategoriesDto } from "./get-process-categories.dto";

export class GetProcessCategoriesUseCase
  implements IUseCase<GetProcessCategoriesDto, ProcessCategory[]>
{
  constructor(
    private readonly processCategoryRepository: IProcessCategoryRepository
  ) {}

  async execute(args: GetProcessCategoriesDto): Promise<ProcessCategory[]> {
    return this.processCategoryRepository.findMany(args);
  }
}
