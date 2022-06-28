import { groupRepository, processRepository } from "../../repositories";
import { CreateProcessUseCase } from "./createProcess/create-process.usecase";
import { DeleteProcessUseCase } from "./deleteProcess/delete-process.usecase";
import { GetProcessUseCase } from "./getProcess/get-process.usecase";
import { GetProcessesUseCase } from "./getProcesses/get-processes.usecase";

const getProcessUseCase = new GetProcessUseCase(processRepository);
const getProcessesUseCase = new GetProcessesUseCase(processRepository);
const createProcessUseCase = new CreateProcessUseCase(
  processRepository,
  groupRepository
);
const deleteProcessUseCase = new DeleteProcessUseCase(processRepository);

export {
  getProcessUseCase,
  getProcessesUseCase,
  createProcessUseCase,
  deleteProcessUseCase,
};
