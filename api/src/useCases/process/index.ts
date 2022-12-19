import { storageProvider } from "../../providers";
import {
  groupRepository,
  processCategoryRepository,
  processRepository,
  processRequestAttachmentRepository,
  processRequestRepository,
  userRepository,
} from "../../repositories";
import { AddProcessRequestExtraAttachmentUseCase } from "./addProcessRequestExtraAttachment/add-process-request-extra-attachment.usecase";
import { AddProcessToCategoryUseCase } from "./addProcessToCategory/add-process-to-category.usecase";
import { CreateProcessUseCase } from "./createProcess/create-process.usecase";
import { CreateProcessCategoryUseCase } from "./createProcessCategory/create-process-category.usecase";
import { CreateProcessRequestUseCase } from "./createProcessRequest/create-process-request.usecase";
import { DeleteProcessUseCase } from "./deleteProcess/delete-process.usecase";
import { DeleteProcessCategoryUseCase } from "./deleteProcessCategory/delete-process-category.usecase";
import { DeleteProcessRequestUseCase } from "./deleteProcessRequest/delete-process-request";
import { GetProcessUseCase } from "./getProcess/get-process.usecase";
import { GetProcessCategoriesUseCase } from "./getProcessCategories/get-process-categories.usecase";
import { GetProcessCategoryUseCase } from "./getProcessCategory/get-process-category.usecase";
import { GetProcessesUseCase } from "./getProcesses/get-processes.usecase";
import { GetProcessRequestUseCase } from "./getProcessRequest/get-process-request.usecase";
import { GetProcessRequestsUseCase } from "./getProcessRequests/get-process-requests.usecase";
import { RemoveProcessFromCategoryUseCase } from "./removeProcessFromCategory/remove-process-from-category.usecase";
import { RemoveProcessRequestExtraAttachmentUseCase } from "./removeProcessRequestExtraAttachment/remove-process-request-extra-attachment.usecase";
import { UpdateProcessUseCase } from "./updateProcess/update-process.usecase";
import { UpdateProcessCategoryUseCase } from "./updateProcessCategory/update-process-category.usecase";
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
const removeProcessRequestExtraAttachmentUseCase =
  new RemoveProcessRequestExtraAttachmentUseCase(
    processRequestRepository,
    processRequestAttachmentRepository
  );
const getProcessCategoryUseCase = new GetProcessCategoryUseCase(
  processCategoryRepository
);
const getProcessCategoriesUseCase = new GetProcessCategoriesUseCase(
  processCategoryRepository
);
const createProcessCategoryUseCase = new CreateProcessCategoryUseCase(
  processCategoryRepository
);
const updateProcessCategoryUseCase = new UpdateProcessCategoryUseCase(
  processCategoryRepository
);
const deleteProcessCategoryUseCase = new DeleteProcessCategoryUseCase(
  processCategoryRepository
);
const addProcessToCategoryUseCase = new AddProcessToCategoryUseCase(
  processCategoryRepository,
  processRepository
);
const removeProcessFromCategoryUseCase = new RemoveProcessFromCategoryUseCase(
  processCategoryRepository,
  processRepository
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
  removeProcessRequestExtraAttachmentUseCase,
  getProcessCategoryUseCase,
  getProcessCategoriesUseCase,
  createProcessCategoryUseCase,
  updateProcessCategoryUseCase,
  deleteProcessCategoryUseCase,
  addProcessToCategoryUseCase,
  removeProcessFromCategoryUseCase,
};
