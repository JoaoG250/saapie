import slugify from "slugify";
import { Group, Prisma, Process } from "@prisma/client";
import { yup } from "../../../modules";
import {
  IGroupRepository,
  IProcessRepository,
  IUseCase,
} from "../../../interfaces";
import { CreateProcessDto } from "./create-process.dto";
import { GroupNotFoundError, IntegrityError } from "../../../errors";

export class CreateProcessUseCase
  implements IUseCase<CreateProcessDto, Process>
{
  constructor(
    private readonly processRepository: IProcessRepository,
    private readonly groupRepository: IGroupRepository
  ) {}

  async validateCreateProcessData(
    data: CreateProcessDto
  ): Promise<CreateProcessDto> {
    const createProcessDataConstraints = yup.object().shape({
      name: yup.string().required().min(3).max(80).trim(),
      description: yup
        .string()
        .sanitizeHtml()
        .required()
        .min(3)
        .max(2000)
        .trim(),
      form: yup.object().shape({
        name: yup.string().required().min(3).max(50).trim(),
        definition: yup.array().of(yup.object()).required(),
      }),
      targetGroupId: yup.string().required(),
      forwardToGroupId: yup.string(),
    });
    return createProcessDataConstraints.validate(data);
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
    data: CreateProcessDto,
    slug: string
  ): Promise<true> {
    const matchingProcesses = await this.processRepository.findMany({
      where: {
        OR: [{ name: data.name }, { slug }],
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

  async getGroupParams(data: CreateProcessDto): Promise<{
    targetGroup: Prisma.GroupCreateNestedOneWithoutProcessesInput;
    forwardToGroup:
      | Prisma.GroupCreateNestedOneWithoutForwardedProcessesInput
      | undefined;
  }> {
    const tgGroup = await this.getGroupById(data.targetGroupId);
    const targetGroup = { connect: { id: tgGroup.id } };

    let forwardToGroup = undefined;
    if (data.forwardToGroupId) {
      const fwtGroup = await this.getGroupById(data.forwardToGroupId);
      this.checkGroups(tgGroup, fwtGroup);
      forwardToGroup = { connect: { id: fwtGroup.id } };
    }
    return { targetGroup, forwardToGroup };
  }

  async execute(args: CreateProcessDto): Promise<Process> {
    const validatedData = await this.validateCreateProcessData(args);
    const groupParams = await this.getGroupParams(validatedData);
    const slug = this.createSlug(validatedData.name);
    await this.checkProcessUniqueFields(validatedData, slug);
    return this.processRepository.create({
      name: validatedData.name,
      description: validatedData.description,
      form: { create: validatedData.form },
      slug,
      ...groupParams,
    });
  }
}
