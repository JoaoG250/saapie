import { Group } from "@prisma/client";
import { yup } from "../../../modules";
import { IntegrityError } from "../../../errors";
import { IGroupRepository, IUseCase } from "../../../interfaces";
import { CreateGroupDto } from "./create-group.dto";

export class CreateGroupUseCase implements IUseCase<CreateGroupDto, Group> {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async validateCreateGroupData(data: CreateGroupDto): Promise<CreateGroupDto> {
    const createGroupDataConstraints = yup.object().shape({
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
    return createGroupDataConstraints.validate(data);
  }

  async checkGroupUniqueFields(data: CreateGroupDto): Promise<true> {
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

  async execute(args: CreateGroupDto): Promise<Group> {
    const validatedData = await this.validateCreateGroupData(args);
    await this.checkGroupUniqueFields(validatedData);
    return this.groupRepository.create(validatedData);
  }
}
