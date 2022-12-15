import {
  Group,
  Prisma,
  Process,
  ProcessCategory,
  ProcessRequest,
  ProcessRequestAttachment,
} from "@prisma/client";
import { IRepository } from ".";

export type ProcessWithGroups = Process & {
  targetGroup: Group;
  forwardToGroup: Group | null;
};

export interface IProcessRepository extends IRepository<Process> {
  findOne(where: Prisma.ProcessWhereUniqueInput): Promise<Process | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessWhereUniqueInput;
    where?: Prisma.ProcessWhereInput;
    orderBy?: Prisma.ProcessOrderByWithRelationInput;
  }): Promise<Process[]>;
  create(data: Prisma.ProcessCreateInput): Promise<Process>;
  update(
    where: Prisma.ProcessWhereUniqueInput,
    data: Prisma.ProcessUpdateInput
  ): Promise<Process>;
  delete(where: Prisma.ProcessWhereUniqueInput): Promise<Process>;
  findOneWithGroups(
    where: Prisma.ProcessWhereUniqueInput
  ): Promise<ProcessWithGroups | null>;
}

export interface IProcessRequestRepository extends IRepository<ProcessRequest> {
  findOne(
    where: Prisma.ProcessRequestWhereUniqueInput
  ): Promise<ProcessRequest | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessRequestWhereUniqueInput;
    where?: Prisma.ProcessRequestWhereInput;
    orderBy?: Prisma.ProcessRequestOrderByWithRelationInput;
  }): Promise<ProcessRequest[]>;
  create(data: Prisma.ProcessRequestCreateInput): Promise<ProcessRequest>;
  update(
    where: Prisma.ProcessRequestWhereUniqueInput,
    data: Prisma.ProcessRequestUpdateInput
  ): Promise<ProcessRequest>;
  delete(where: Prisma.ProcessRequestWhereUniqueInput): Promise<ProcessRequest>;
}

export interface IProcessRequestAttachmentRepository
  extends IRepository<ProcessRequestAttachment> {
  findOne(
    where: Prisma.ProcessRequestAttachmentWhereUniqueInput
  ): Promise<ProcessRequestAttachment | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessRequestAttachmentWhereUniqueInput;
    where?: Prisma.ProcessRequestAttachmentWhereInput;
    orderBy?: Prisma.ProcessRequestAttachmentOrderByWithRelationInput;
  }): Promise<ProcessRequestAttachment[]>;
  create(
    data: Prisma.ProcessRequestAttachmentCreateInput
  ): Promise<ProcessRequestAttachment>;
  update(
    where: Prisma.ProcessRequestAttachmentWhereUniqueInput,
    data: Prisma.ProcessRequestAttachmentUpdateInput
  ): Promise<ProcessRequestAttachment>;
  delete(
    where: Prisma.ProcessRequestAttachmentWhereUniqueInput
  ): Promise<ProcessRequestAttachment>;
}

export interface IProcessCategoryRepository
  extends IRepository<ProcessCategory> {
  findOne(
    where: Prisma.ProcessCategoryWhereUniqueInput
  ): Promise<ProcessCategory | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProcessCategoryWhereUniqueInput;
    where?: Prisma.ProcessCategoryWhereInput;
    orderBy?: Prisma.ProcessCategoryOrderByWithRelationInput;
  }): Promise<ProcessCategory[]>;
  create(data: Prisma.ProcessCategoryCreateInput): Promise<ProcessCategory>;
  update(
    where: Prisma.ProcessCategoryWhereUniqueInput,
    data: Prisma.ProcessCategoryUpdateInput
  ): Promise<ProcessCategory>;
  delete(
    where: Prisma.ProcessCategoryWhereUniqueInput
  ): Promise<ProcessCategory>;
}
