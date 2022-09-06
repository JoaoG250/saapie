import path from "path";
import config from "config";
import cuid from "cuid";
import { Process, ProcessRequest, User } from "@prisma/client";
import {
  IntegrityError,
  ProcessNotFoundError,
  UserNotFoundError,
} from "../../../errors";
import {
  FormKitData,
  IProcessRepository,
  IProcessRequestAttachmentRepository,
  IProcessRequestRepository,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { CreateProcessRequestDto } from "./create-process-request.dto";
import { FileUpload } from "graphql-upload";
import { IStorageProvider } from "../../../interfaces/storage";
import { createUrl } from "../../../utils";

const publicUrl: string = config.get("server.publicUrl");

export class CreateProcessRequestUseCase
  implements IUseCase<CreateProcessRequestDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository,
    private readonly processRequestAttachmentRepository: IProcessRequestAttachmentRepository,
    private readonly processRepository: IProcessRepository,
    private readonly userRepository: IUserRepository,
    private readonly storageProvider: IStorageProvider
  ) {}

  async getProcess(id?: string, slug?: string): Promise<Process> {
    const process = await this.processRepository.findOne({ id, slug });
    if (!process) {
      throw new ProcessNotFoundError("Process not found");
    }
    return process;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }

  checkProcessStatus(process: Process): true {
    if (process.active) {
      return true;
    }
    throw new IntegrityError("Process is not active");
  }

  async userHasRequestOpen(user: User, process: Process): Promise<boolean> {
    const requests = await this.processRequestRepository.findMany({
      where: {
        userId: user.id,
        processId: process.id,
        status: {
          not: "CLOSED",
        },
      },
    });
    return requests.length > 0;
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
        files[field] = [...(files[field] || []), { name: createUrl(fileUrl) }];
      })
    );
    return files;
  }

  async execute(args: CreateProcessRequestDto): Promise<ProcessRequest> {
    const process = await this.getProcess(args.processId, args.processSlug);
    this.checkProcessStatus(process);
    const user = await this.getUserById(args.userId);
    if (await this.userHasRequestOpen(user, process)) {
      throw new IntegrityError(
        "User already has an open request for this process"
      );
    }
    let request = await this.processRequestRepository.create({
      process: { connect: { id: process.id } },
      user: { connect: { id: user.id } },
      data: args.data,
    });
    if (args.attachments) {
      const files = await this.handleAttachments(request, args.attachments);
      const data = request.data as FormKitData;
      request = await this.processRequestRepository.update(
        { id: request.id },
        { data: { ...data, ...files } }
      );
    }
    return request;
  }
}
