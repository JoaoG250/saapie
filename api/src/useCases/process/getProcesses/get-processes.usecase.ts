import { Process } from "@prisma/client";
import { IProcessRepository, IUseCase } from "../../../interfaces";
import { GetProcessesDto } from "./get-processes.dto";

export class GetProcessesUseCase
  implements IUseCase<GetProcessesDto, Process[]>
{
  constructor(private readonly processRepository: IProcessRepository) {}

  async execute(args: GetProcessesDto): Promise<Process[]> {
    return this.processRepository.findMany(args);
  }
}
