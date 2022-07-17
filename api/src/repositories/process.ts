import {
  Prisma,
  PrismaClient,
  Process,
  ProcessRequest,
  ProcessRequestAttachment,
} from "@prisma/client";
import {
  IProcessRepository,
  IProcessRequestAttachmentRepository,
  IProcessRequestRepository,
  ProcessWithGroups,
} from "../interfaces";
import { IStorageProvider } from "../interfaces/storage";

export class ProcessRepository implements IProcessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(
    where: Prisma.ProcessWhereUniqueInput
  ): Promise<Process | null> {
    return this.prisma.process.findUnique({ where });
  }

  async findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessWhereUniqueInput;
    where?: Prisma.ProcessWhereInput;
    orderBy?: Prisma.ProcessOrderByWithRelationInput;
  }): Promise<Process[]> {
    return this.prisma.process.findMany(args);
  }

  async create(data: Prisma.ProcessCreateInput): Promise<Process> {
    return this.prisma.process.create({ data });
  }

  async update(
    where: Prisma.ProcessWhereUniqueInput,
    data: Prisma.ProcessUpdateInput
  ): Promise<Process> {
    return this.prisma.process.update({ where, data });
  }

  async delete(where: Prisma.ProcessWhereUniqueInput): Promise<Process> {
    return this.prisma.process.delete({ where });
  }

  async findOneWithGroups(
    where: Prisma.ProcessWhereUniqueInput
  ): Promise<ProcessWithGroups | null> {
    return this.prisma.process.findUnique({
      where,
      include: { targetGroup: true, forwardToGroup: true },
    });
  }
}

export class ProcessRequestRepository implements IProcessRequestRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly storateProvider: IStorageProvider
  ) {}

  async findOne(
    where: Prisma.ProcessRequestWhereUniqueInput
  ): Promise<ProcessRequest | null> {
    return this.prisma.processRequest.findUnique({ where });
  }

  async findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessRequestWhereUniqueInput;
    where?: Prisma.ProcessRequestWhereInput;
    orderBy?: Prisma.ProcessRequestOrderByWithRelationInput;
  }): Promise<ProcessRequest[]> {
    return this.prisma.processRequest.findMany(args);
  }

  async create(
    data: Prisma.ProcessRequestCreateInput
  ): Promise<ProcessRequest> {
    return this.prisma.processRequest.create({ data });
  }

  async update(
    where: Prisma.ProcessRequestWhereUniqueInput,
    data: Prisma.ProcessRequestUpdateInput
  ): Promise<ProcessRequest> {
    return this.prisma.processRequest.update({ where, data });
  }

  async delete(
    where: Prisma.ProcessRequestWhereUniqueInput
  ): Promise<ProcessRequest> {
    const attachments = await this.prisma.processRequestAttachment.findMany({
      where: { processRequestId: where.id },
    });
    await Promise.all(
      attachments.map(async (attachment) => {
        await this.storateProvider.deleteFile(attachment.name);
      })
    );
    return this.prisma.processRequest.delete({ where });
  }
}

export class ProcessRequestAttachmentRepository
  implements IProcessRequestAttachmentRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(
    where: Prisma.ProcessRequestAttachmentWhereUniqueInput
  ): Promise<ProcessRequestAttachment | null> {
    return this.prisma.processRequestAttachment.findUnique({ where });
  }

  async findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessRequestAttachmentWhereUniqueInput;
    where?: Prisma.ProcessRequestAttachmentWhereInput;
    orderBy?: Prisma.ProcessRequestAttachmentOrderByWithRelationInput;
  }): Promise<ProcessRequestAttachment[]> {
    return this.prisma.processRequestAttachment.findMany(args);
  }

  async create(
    data: Prisma.ProcessRequestAttachmentCreateInput
  ): Promise<ProcessRequestAttachment> {
    return this.prisma.processRequestAttachment.create({ data });
  }

  async update(
    where: Prisma.ProcessRequestAttachmentWhereUniqueInput,
    data: Prisma.ProcessRequestAttachmentUpdateInput
  ): Promise<ProcessRequestAttachment> {
    return this.prisma.processRequestAttachment.update({ where, data });
  }

  async delete(
    where: Prisma.ProcessRequestAttachmentWhereUniqueInput
  ): Promise<ProcessRequestAttachment> {
    return this.prisma.processRequestAttachment.delete({ where });
  }
}
