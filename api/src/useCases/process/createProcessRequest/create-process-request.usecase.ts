import { Process, ProcessRequest, User } from "@prisma/client";
import {
  IntegrityError,
  ProcessNotFoundError,
  UserNotFoundError,
} from "../../../errors";
import {
  IProcessRepository,
  IProcessRequestRepository,
  IUseCase,
  IUserRepository,
} from "../../../interfaces";
import { CreateProcessRequestDto } from "./create-process-request.dto";

export class CreateProcessRequestUseCase
  implements IUseCase<CreateProcessRequestDto, ProcessRequest>
{
  constructor(
    private readonly processRequestRepository: IProcessRequestRepository,
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

  async execute(args: CreateProcessRequestDto): Promise<ProcessRequest> {
    const process = await this.getProcess(args.processId, args.processSlug);
    const user = await this.getUserById(args.userId);
    if (await this.userHasRequestOpen(user, process)) {
      throw new IntegrityError(
        "User already has an open request for this process"
      );
    }
    const request = await this.processRequestRepository.create({
      process: { connect: { id: process.id } },
      user: { connect: { id: user.id } },
      data: args.data,
    });
    return request;
  }
}
