import { ProcessRequest } from "@prisma/client";
import { IProcessRequestRepository, IUseCase } from "../../../interfaces";
import { GetProcessRequestsDto } from "./get-process-requests.dto";

export class GetProcessRequestsUseCase
  implements IUseCase<GetProcessRequestsDto, ProcessRequest[]>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository
  ) {}

  async execute(args: GetProcessRequestsDto): Promise<ProcessRequest[]> {
    return this.processRequestRepository.findMany(args);
  }
}
