import { ProcessCategory } from "@prisma/client";
import { IProcessCategoryRepository, IUseCase } from "../../../interfaces";
import { GetProcessCategoryDto } from "./get-process-category.dto";

export class GetProcessCategoryUseCase
  implements IUseCase<GetProcessCategoryDto, ProcessCategory | null>
{
  constructor(
    private readonly processCategoryRepository: IProcessCategoryRepository
  ) {}

  async execute(args: GetProcessCategoryDto): Promise<ProcessCategory | null> {
    return this.processCategoryRepository.findOne(args);
  }
}
