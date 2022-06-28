import { Process } from "@prisma/client";
import { ProcessNotFoundError } from "../../../errors";
import { IProcessRepository, IUseCase } from "../../../interfaces";
import { DeleteProcessDto } from "./delete-process.dto";

export class DeleteProcessUseCase
  implements IUseCase<DeleteProcessDto, Process>
{
  constructor(private readonly processRepository: IProcessRepository) {}

  async getProcessById(id: string): Promise<Process> {
    const process = await this.processRepository.findOne({ id });
    if (!process) {
      throw new ProcessNotFoundError("Process not found");
    }
    return process;
  }

  async execute(args: DeleteProcessDto): Promise<Process> {
    const process = await this.getProcessById(args.id);
    return this.processRepository.delete({ id: process.id });
  }
}
