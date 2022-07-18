import path from "path";
import cuid from "cuid";
import config from "config";
import { ProcessRequest } from "@prisma/client";
import { FileUpload } from "graphql-upload";
import {
  FormKitData,
  IProcessRequestAttachmentRepository,
  IProcessRequestRepository,
  IUseCase,
} from "../../../interfaces";
import { UpdateProcessRequestDto } from "./update-process-request.dto";
import { IStorageProvider } from "../../../interfaces/storage";
import { IntegrityError, ProcessRequestNotFoundError } from "../../../errors";

const publicUrl: string = config.get("server.publicUrl");

export class UpdateProcessRequestUseCase
  implements IUseCase<UpdateProcessRequestDto, ProcessRequest>
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

  async handleAttachments(
    processRequest: ProcessRequest,
    attachments: FileUpload[]
  ): Promise<{ [key: string]: { name: string }[] }> {
    const files: { [key: string]: { name: string }[] } = {};
    await Promise.all(
      attachments.map(async (attachment: FileUpload) => {
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
        const field = path.basename(filename, ext);
        files[field] = [...(files[field] || []), { name: fileUrl }];
      })
    );
    return files;
  }

  async deleteReplacedAttachments(
    processRequest: ProcessRequest,
    newFiles: { [key: string]: { name: string }[] }
  ): Promise<void> {
    const data = processRequest.data as FormKitData;
    for (const key in newFiles) {
      const value = data[key];
      if (!(value instanceof Array)) continue;
      for (const file of value) {
        if (!(typeof file === "object")) continue;
        await this.processRequestAttachmentRepository.delete({
          url: file.name,
        });
      }
    }
  }

  async execute(args: UpdateProcessRequestDto): Promise<ProcessRequest> {
    const processRequest = await this.getProcessRequestById(args.id);
    this.checkRequestStatus(processRequest);
    let files;
    if (args.attachments) {
      files = await this.handleAttachments(processRequest, args.attachments);
      await this.deleteReplacedAttachments(processRequest, files);
    }
    const data = processRequest.data as FormKitData;
    return this.processRequestRepository.update(
      { id: processRequest.id },
      { data: { ...data, ...args.data, ...files } }
    );
  }
}
