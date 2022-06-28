import { groupRepository, processRepository } from "../../repositories";
import { CreateProcessUseCase } from "./createProcess/create-process.usecase";
import { DeleteProcessUseCase } from "./deleteProcess/delete-process.usecase";

const createProcessUseCase = new CreateProcessUseCase(
  processRepository,
  groupRepository
);
const deleteProcessUseCase = new DeleteProcessUseCase(processRepository);

export { createProcessUseCase, deleteProcessUseCase };
