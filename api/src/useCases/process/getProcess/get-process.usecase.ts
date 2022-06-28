import { Process } from "@prisma/client";
import { IProcessRepository, IUseCase } from "../../../interfaces";
import { GetProcessDto } from "./get-process.dto";

export class GetProcessUseCase
  implements IUseCase<GetProcessDto, Process | null>
{
  constructor(private readonly processRepository: IProcessRepository) {}

  async execute(args: GetProcessDto): Promise<Process | null> {
    return this.processRepository.findOne(args);
  }
}
