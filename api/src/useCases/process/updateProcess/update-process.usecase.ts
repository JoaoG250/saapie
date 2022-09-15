import slugify from "slugify";
import { Group, Prisma, Process } from "@prisma/client";
import { yup } from "../../../modules";
import {
  IGroupRepository,
  IProcessRepository,
  IUseCase,
  ProcessWithGroups,
} from "../../../interfaces";
import { UpdateProcessDto } from "./update-process.dto";
import {
  GroupNotFoundError,
  IntegrityError,
  ProcessNotFoundError,
} from "../../../errors";

export class UpdateProcessUseCase
  implements IUseCase<UpdateProcessDto, Process>
{
  constructor(
    private readonly processRepository: IProcessRepository,
    private readonly groupRepository: IGroupRepository
  ) {}

  async validateUpdateProcessData(
    data: UpdateProcessDto["data"]
  ): Promise<UpdateProcessDto["data"]> {
    const updateProcessDataConstraints = yup.object().shape({
      name: yup.string().required().min(3).max(80).trim(),
      description: yup
        .string()
        .sanitizeHtml()
        .required()
        .min(3)
        .max(2000)
        .trim(),
      active: yup.boolean().required(),
      form: yup.object().shape({
        name: yup.string().required().min(3).max(50).trim(),
        definition: yup.array().of(yup.object()).required(),
      }),
      targetGroupId: yup.string().required(),
      forwardToGroupId: yup.string(),
    });
    return updateProcessDataConstraints.validate(data);
  }

  async getProcessById(id: string): Promise<ProcessWithGroups> {
    const process = await this.processRepository.findOneWithGroups({ id });
    if (!process) {
      throw new ProcessNotFoundError("Process not found");
    }
    return process;
  }

  async getGroupById(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ id });
    if (!group) {
      throw new GroupNotFoundError("Group not found");
    }
    return group;
  }

  checkGroups(targetGroup: Group, forwardToGroup: Group): true {
    if (targetGroup.id === forwardToGroup.id) {
      throw new IntegrityError(
        "Target group cannot be the same as forward to group"
      );
    }
    return true;
  }

  createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async checkProcessUniqueFields(
    data: UpdateProcessDto["data"],
    slug: string,
    process: Process
  ): Promise<true> {
    const matchingProcesses = await this.processRepository.findMany({
      where: {
        OR: [{ name: data.name }, { slug }],
        NOT: { id: process.id },
      },
    });
    matchingProcesses.forEach((process) => {
      if (process.name === data.name) {
        throw new IntegrityError("Process name already exists");
      }
      if (process.slug === slug) {
        throw new IntegrityError("Process slug already exists");
      }
    });
    return true;
  }

  async getGroupParams(
    data: UpdateProcessDto["data"],
    process: ProcessWithGroups
  ): Promise<{
    targetGroup: Prisma.GroupUpdateOneRequiredWithoutProcessesInput | undefined;
    forwardToGroup:
      | Prisma.GroupUpdateOneWithoutForwardedProcessesInput
      | undefined;
  }> {
    let targetGroup = undefined;
    let forwardToGroup = undefined;
    const tgGroup = await this.getGroupById(data.targetGroupId);
    if (data.targetGroupId !== process.targetGroup.id) {
      targetGroup = { connect: { id: tgGroup.id } };
    }
    const addingForwardToGroup = !!(
      data.forwardToGroupId && !process.forwardToGroup
    );
    const updatingForwardToGroup = !!(
      data.forwardToGroupId &&
      process.forwardToGroup &&
      data.forwardToGroupId !== process.forwardToGroup.id
    );
    const removingForwardToGroup = !!(
      !data.forwardToGroupId && process.forwardToGroup
    );
    if (
      data.forwardToGroupId &&
      (addingForwardToGroup || updatingForwardToGroup)
    ) {
      const fwtGroup = await this.getGroupById(data.forwardToGroupId);
      this.checkGroups(tgGroup, fwtGroup);
      forwardToGroup = { connect: { id: fwtGroup.id } };
    } else if (removingForwardToGroup) {
      forwardToGroup = { disconnect: true };
    }
    return { targetGroup, forwardToGroup };
  }

  async execute(args: UpdateProcessDto): Promise<Process> {
    const validatedData = await this.validateUpdateProcessData(args.data);
    const process = await this.getProcessById(args.id);
    const groupParams = await this.getGroupParams(validatedData, process);
    const slug = this.createSlug(validatedData.name);
    await this.checkProcessUniqueFields(validatedData, slug, process);
    return this.processRepository.update(
      { id: process.id },
      {
        name: validatedData.name,
        description: validatedData.description,
        active: validatedData.active,
        form: { update: validatedData.form },
        slug,
        ...groupParams,
      }
    );
  }
}
