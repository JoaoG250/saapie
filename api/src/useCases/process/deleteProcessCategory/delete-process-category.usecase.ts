import { ProcessCategory } from "@prisma/client";
import { ProcessCategoryNotFoundError } from "../../../errors";
import { IProcessCategoryRepository, IUseCase } from "../../../interfaces";
import { DeleteProcessCategoryDto } from "./delete-process-category.dto";

export class DeleteProcessCategoryUseCase
  implements IUseCase<DeleteProcessCategoryDto, ProcessCategory>
{
  constructor(
    private readonly processCategoryRepository: IProcessCategoryRepository
  ) {}

  async getProcessCategoryById(id: string): Promise<ProcessCategory> {
    const processCategory = await this.processCategoryRepository.findOne({
      id,
    });
    if (!processCategory) {
      throw new ProcessCategoryNotFoundError("Process category not found");
    }
    return processCategory;
  }

  async execute(args: DeleteProcessCategoryDto): Promise<ProcessCategory> {
    const processCategory = await this.getProcessCategoryById(args.id);
    return this.processCategoryRepository.delete({ id: processCategory.id });
  }
}
