import { groupRepository, processRepository } from "../../repositories";
import { CreateProcessUseCase } from "./createProcess/create-process.usecase";

const createProcessUseCase = new CreateProcessUseCase(
  processRepository,
  groupRepository
);

export { createProcessUseCase };
