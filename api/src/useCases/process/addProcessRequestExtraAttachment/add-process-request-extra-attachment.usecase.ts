import cuid from "cuid";
import path from "path";
import config from "config";
import { ProcessRequest } from "@prisma/client";
import { FileUpload } from "graphql-upload";
import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";
import {
  FormKitData,
  IProcessRequestAttachmentRepository,
  IProcessRequestRepository,
  IUseCase,
} from "../../../interfaces";
import { IStorageProvider } from "../../../interfaces/storage";
import { AddProcessRequestExtraAttachmentDto } from "./add-process-request-extra-attachment.dto";
import { createUrl, getFileUrl } from "../../../utils";

const publicUrl: string = config.get("server.publicUrl");

export class AddProcessRequestExtraAttachmentUseCase
  implements IUseCase<AddProcessRequestExtraAttachmentDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository,
    private readonly processRequestAttachmentRepository: IProcessRequestAttachmentRepository,
    private readonly storageProvider: IStorageProvider
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

  getFileType(mimetype: string): "IMAGE" | "PDF" {
    if (mimetype.includes("image")) {
      return "IMAGE";
    }
    if (mimetype.includes("pdf")) {
      return "PDF";
    }
    throw new Error("File type not supported");
  }

  async handleAttachment(
    processRequest: ProcessRequest,
    attachment: FileUpload
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = await attachment;
    if (!filename) throw new Error("No file uploaded");
    const stream = createReadStream();
    const date = new Date();
    const ext = path.extname(filename);
    const newFileName = path.join(
      date.getFullYear().toString(),
      (date.getMonth() + 1).toString(),
      cuid() + ext
    );
    await this.storageProvider.saveFileFromStream(stream, newFileName);
    const fileUrl = path.join(publicUrl, newFileName);
    await this.processRequestAttachmentRepository.create({
      name: newFileName,
      type: this.getFileType(mimetype),
      url: fileUrl,
      processRequest: { connect: { id: processRequest.id } },
    });
    return createUrl(fileUrl);
  }

  async deleteOldAttachment(processRequest: ProcessRequest): Promise<void> {
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
    args: AddProcessRequestExtraAttachmentDto
  ): Promise<ProcessRequest> {
    const processRequest = await this.getProcessRequestById(args.id);
    this.checkRequestStatus(processRequest);
    const fileUrl = await this.handleAttachment(
      processRequest,
      args.attachment
    );
    await this.deleteOldAttachment(processRequest);
    const data = processRequest.data as FormKitData;
    return this.processRequestRepository.update(
      { id: processRequest.id },
      { data: { ...data, extra: [{ name: fileUrl }] } }
    );
  }
}
