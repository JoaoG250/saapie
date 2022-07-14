import { Prisma, ProcessRequest } from "@prisma/client";
import { IProcessRequestRepository, IUseCase } from "../../../interfaces";
import { GetProcessRequestDto } from "./get-process-request.dto";

export class GetProcessRequestUseCase
  implements IUseCase<GetProcessRequestDto, ProcessRequest | null>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository
  ) {}

  async execute(
    args: Prisma.ProcessRequestWhereUniqueInput
  ): Promise<ProcessRequest | null> {
    return this.processRequestRepository.findOne(args);
  }
}
