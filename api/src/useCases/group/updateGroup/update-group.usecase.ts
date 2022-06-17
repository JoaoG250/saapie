import * as yup from "yup";
import { Group } from "@prisma/client";
import { IGroupRepository, IUseCase } from "../../../interfaces";
import { GroupNotFoundError, IntegrityError } from "../../../errors";
import { UpdateGroupDto } from "./update-group.dto";

export class UpdateGroupUseCase implements IUseCase<UpdateGroupDto, Group> {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async validateUpdateGroupData(
    data: UpdateGroupDto["data"]
  ): Promise<UpdateGroupDto["data"]> {
    const updateGroupDataConstraints = yup.object().shape({
      name: yup
        .string()
        .required()
        .min(3)
        .max(30)
        .matches(
          /^[A-Z]+(?:(_)[A-Z]+)*$/,
          'you must use capital letters and "_" as separator. No spaces allowed.'
        )
        .trim(),
    });
    return updateGroupDataConstraints.validate(data);
  }

  async checkGroupUniqueFields(data: UpdateGroupDto["data"]): Promise<true> {
    const matchingGroups = await this.groupRepository.findMany({
      where: {
        OR: { name: data.name },
      },
    });
    matchingGroups.forEach((group) => {
      if (group.name === data.name) {
        throw new IntegrityError("Name already exists");
      }
    });
    return true;
  }

  async execute(args: UpdateGroupDto): Promise<Group> {
    const validatedData = await this.validateUpdateGroupData(args.data);
    const group = await this.groupRepository.findOne({ id: args.id });
    if (!group) {
      throw new GroupNotFoundError("Group not found");
    }
    await this.checkGroupUniqueFields(validatedData);
    return this.groupRepository.update({ id: group.id }, validatedData);
  }
}
