import { ProcessRequest } from "@prisma/client";
import { ProcessRequestNotFoundError } from "../../../errors";
import { IProcessRequestRepository, IUseCase } from "../../../interfaces";
import { DeleteProcessRequestDto } from "./delete-process-request.dto";

export class DeleteProcessRequestUseCase
  implements IUseCase<DeleteProcessRequestDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository
  ) {}

  async getProcessRequestById(id: string): Promise<ProcessRequest> {
    const processRequest = await this.processRequestRepository.findOne({
      id,
    });
    if (!processRequest) {
      throw new ProcessRequestNotFoundError("Process request not found");
    }
    return processRequest;
  }

  async execute(args: DeleteProcessRequestDto): Promise<ProcessRequest> {
    const processRequest = await this.getProcessRequestById(args.id);
    return this.processRequestRepository.delete({ id: processRequest.id });
  }
}
