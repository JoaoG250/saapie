import { ProcessRequest } from "@prisma/client";
import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";
import {
  FormKitData,
  IProcessRequestAttachmentRepository,
  IProcessRequestRepository,
  IUseCase,
} from "../../../interfaces";
import { getFileUrl } from "../../../utils";
import { RemoveProcessRequestExtraAttachmentDto } from "./remove-process-request-extra-attachment.dto";

export class RemoveProcessRequestExtraAttachmentUseCase
  implements IUseCase<RemoveProcessRequestExtraAttachmentDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository,
    private readonly processRequestAttachmentRepository: IProcessRequestAttachmentRepository
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

  checkRequestStatus(processRequest: ProcessRequest): true {
    if (processRequest.status === "CLOSED") {
      throw new IntegrityError("Process request is closed");
    }
    return true;
  }

  async deleteAttachment(processRequest: ProcessRequest): Promise<void> {
    const data = processRequest.data as FormKitData;
    const extra = data.extra;
    if (extra && extra instanceof Array) {
      for (const file of extra) {
        if (typeof file === "object") {
          await this.processRequestAttachmentRepository.delete({
            url: getFileUrl(file.name),
          });
        }
      }
    }
  }

  async execute(
    args: RemoveProcessRequestExtraAttachmentDto
  ): Promise<ProcessRequest> {
    const processRequest = await this.getProcessRequestById(args.id);
    this.checkRequestStatus(processRequest);
    await this.deleteAttachment(processRequest);
    const data = processRequest.data as FormKitData;
    delete data.extra;
    return this.processRequestRepository.update(
      { id: processRequest.id },
      { data }
    );
  }
}
