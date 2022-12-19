import {
  ProcessCategoryNotFoundError,
  ProcessNotFoundError,
} from "../../../errors";
import {
  IProcessCategoryRepository,
  IProcessRepository,
  IUseCase,
} from "../../../interfaces";
import { AddProcessToCategoryDto } from "./add-process-to-category.dto";

export class AddProcessToCategoryUseCase
  implements IUseCase<AddProcessToCategoryDto, true>
{
  constructor(
    private readonly processCategoryRepository: IProcessCategoryRepository,
    private readonly processRepository: IProcessRepository
  ) {}

  async execute(args: AddProcessToCategoryDto): Promise<true> {
    const { processId, processCategoryId } = args;
    const processCategory = await this.processCategoryRepository.findOne({
      id: processCategoryId,
    });
    if (!processCategory) {
      throw new ProcessCategoryNotFoundError("Process category not found");
    }
    const process = await this.processRepository.findOne({
      id: processId,
    });
    if (!process) {
      throw new ProcessNotFoundError("Process not found");
    }
    await this.processCategoryRepository.update(
      { id: processCategoryId },
      { processes: { connect: { id: processId } } }
    );
    return true;
  }
}
