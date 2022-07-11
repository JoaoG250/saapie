import fs from "fs";
import path from "path";
import { Process, ProcessRequest, User } from "@prisma/client";
import {
  IntegrityError,
  ProcessNotFoundError,
  UserNotFoundError,
} from "../../../errors";
import {
  IProcessRepository,
  IProcessRequestAttachmentRepository,
  IProcessRequestRepository,
  IUseCase,
  IUserRepository,
  JsonValue,
} from "../../../interfaces";
import { CreateProcessRequestDto } from "./create-process-request.dto";
import { FileUpload } from "graphql-upload";

export class CreateProcessRequestUseCase
  implements IUseCase<CreateProcessRequestDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository,
    private readonly processRequestAttachmentRepository: IProcessRequestAttachmentRepository,
    private readonly processRepository: IProcessRepository,
    private readonly userRepository: IUserRepository
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

  async saveFile(stream: fs.ReadStream, filename: string): Promise<string> {
    const filePath = path.resolve(__dirname, "../../../../uploads", filename);
    return new Promise((resolve, reject) => {
      stream
        .pipe(fs.createWriteStream(filePath))
        .on("error", (err) => reject(err))
        .on("finish", () => resolve(filePath));
    });
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
        const path = await this.saveFile(stream, filename);
        await this.processRequestAttachmentRepository.create({
          name: filename,
          type: this.getFileType(mimetype),
          url: path,
          processRequest: { connect: { id: processRequest.id } },
        });
        files[filename] = [...(files[filename] || []), { name: path }];
      })
    );
    return files;
  }

  async execute(args: CreateProcessRequestDto): Promise<ProcessRequest> {
    const process = await this.getProcess(args.processId, args.processSlug);
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
      const data = request.data as JsonValue;
      request = await this.processRequestRepository.update(
        { id: request.id },
        { data: { ...data, ...files } }
      );
    }
    return request;
  }
}
