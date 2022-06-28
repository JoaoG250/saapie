import { groupRepository, processRepository } from "../../repositories";
import { CreateProcessUseCase } from "./createProcess/create-process.usecase";
import { DeleteProcessUseCase } from "./deleteProcess/delete-process.usecase";
import { GetProcessUseCase } from "./getProcess/get-process.usecase";
import { GetProcessesUseCase } from "./getProcesses/get-processes.usecase";
import { UpdateProcessUseCase } from "./updateProcess/update-process.usecase";

const getProcessUseCase = new GetProcessUseCase(processRepository);
const getProcessesUseCase = new GetProcessesUseCase(processRepository);
const createProcessUseCase = new CreateProcessUseCase(
  processRepository,
  groupRepository
);
const updateProcessUseCase = new UpdateProcessUseCase(
  processRepository,
  groupRepository
);
const deleteProcessUseCase = new DeleteProcessUseCase(processRepository);

export {
  getProcessUseCase,
  getProcessesUseCase,
  createProcessUseCase,
  updateProcessUseCase,
  deleteProcessUseCase,
};
