import { storageProvider } from "../../providers";
import {
  groupRepository,
  processRepository,
  processRequestAttachmentRepository,
  processRequestRepository,
  userRepository,
} from "../../repositories";
import { AddProcessRequestExtraAttachmentUseCase } from "./addProcessRequestExtraAttachment/add-process-request-extra-attachment.usecase";
import { CreateProcessUseCase } from "./createProcess/create-process.usecase";
import { CreateProcessRequestUseCase } from "./createProcessRequest/create-process-request.usecase";
import { DeleteProcessUseCase } from "./deleteProcess/delete-process.usecase";
import { DeleteProcessRequestUseCase } from "./deleteProcessRequest/delete-process-request";
import { GetProcessUseCase } from "./getProcess/get-process.usecase";
import { GetProcessesUseCase } from "./getProcesses/get-processes.usecase";
import { GetProcessRequestUseCase } from "./getProcessRequest/get-process-request.usecase";
import { GetProcessRequestsUseCase } from "./getProcessRequests/get-process-requests.usecase";
import { UpdateProcessUseCase } from "./updateProcess/update-process.usecase";
import { UpdateProcessRequestUseCase } from "./updateProcessRequest/update-process-request.usecase";
import { UpdateProcessRequestStatusUseCase } from "./updateProcessRequestStatus/update-process-request-status.usecase";

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
const getProcessRequestUseCase = new GetProcessRequestUseCase(
  processRequestRepository
);
const getProcessRequestsUseCase = new GetProcessRequestsUseCase(
  processRequestRepository
);
const createProcessRequestUseCase = new CreateProcessRequestUseCase(
  processRequestRepository,
  processRequestAttachmentRepository,
  processRepository,
  userRepository,
  storageProvider
);
const updateProcessRequestUseCase = new UpdateProcessRequestUseCase(
  processRequestRepository,
  processRequestAttachmentRepository,
  storageProvider
);
const deleteProcessRequestUseCase = new DeleteProcessRequestUseCase(
  processRequestRepository
);
const updateProcessRequestStatusUseCase = new UpdateProcessRequestStatusUseCase(
  processRequestRepository,
  processRepository
);
const addProcessRequestExtraAttachmentUseCase =
  new AddProcessRequestExtraAttachmentUseCase(
    processRequestRepository,
    processRequestAttachmentRepository,
    storageProvider
  );

export {
  getProcessUseCase,
  getProcessesUseCase,
  createProcessUseCase,
  updateProcessUseCase,
  deleteProcessUseCase,
  getProcessRequestUseCase,
  getProcessRequestsUseCase,
  createProcessRequestUseCase,
  updateProcessRequestUseCase,
  deleteProcessRequestUseCase,
  updateProcessRequestStatusUseCase,
  addProcessRequestExtraAttachmentUseCase,
};
