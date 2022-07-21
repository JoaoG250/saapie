import { Process, ProcessRequest, ProcessRequestStatus } from "@prisma/client";
import {
  IntegrityError,
  ProcessNotFoundError,
  ProcessRequestNotFoundError,
} from "../../../errors";
import {
  IProcessRepository,
  IProcessRequestRepository,
  IUseCase,
} from "../../../interfaces";
import { UpdateProcessRequestStatusDto } from "./update-process-request-status.dto";

export class UpdateProcessRequestStatusUseCase
  implements IUseCase<UpdateProcessRequestStatusDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository,
    private readonly processRepository: IProcessRepository
  ) {}

  async getProcessRequestById(id: string): Promise<ProcessRequest> {
    const processRequest = await this.processRequestRepository.findOne({ id });
    if (!processRequest) {
      throw new ProcessRequestNotFoundError("Process request not found");
    }
    return processRequest;
  }

  async getProcessById(id: string): Promise<Process> {
    const process = await this.processRepository.findOne({ id });
    if (!process) {
      throw new ProcessNotFoundError("Process not found");
    }
    return process;
  }

  checkNewStatus(status: ProcessRequestStatus, process: Process): true {
    if (status === "FORWARDED" && !process.forwardToGroupId) {
      throw new IntegrityError("Process request cannot be forwarded");
    }
    return true;
  }

  async execute(args: UpdateProcessRequestStatusDto): Promise<ProcessRequest> {
    const processRequest = await this.getProcessRequestById(args.id);
    const process = await this.getProcessById(processRequest.processId);
    this.checkNewStatus(args.status, process);
    return this.processRequestRepository.update(
      { id: args.id },
      { status: args.status }
    );
  }
}
