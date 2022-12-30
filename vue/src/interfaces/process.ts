/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormKitData } from "./formkit";
import { Group } from "./group";

export interface ProcessForm {
  id: string;
  name: string;
  definition: object[];
}

export type ProcessRequestStatus =
  | "OPEN"
  | "FORWARDED"
  | "PENDING_CHANGE"
  | "CLOSED";

export interface Process {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  targetGroupId: string;
  forwardToGroupId: string | null | undefined;
  form: ProcessForm;
  targetGroup: Group;
  forwardToGroup: Group | null | undefined;
}

export type ProcessWithoutForm = Omit<Process, "form">;

export interface CreateProcessFormInput {
  name: string;
  definition: object[];
}

export interface CreateProcessInput {
  name: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string;
  form: CreateProcessFormInput;
}

export interface UpdateProcessInput extends CreateProcessInput {
  active: boolean;
}

export interface ProcessRequest {
  id: string;
  status: ProcessRequestStatus;
  process: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  data: FormKitData;
}

export interface ProcessRequestWhereInput {
  userId?: string;
  processId?: string;
  status?: ProcessRequestStatus;
}

export interface ProcessWhereInput {
  name?: string;
  processCategory?: string;
}

export interface OnUpdateProcessRequestData {
  updatedAt?: string;
  status?: ProcessRequestStatus;
  data?: FormKitData;
}

export interface ProcessCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CreateProcessCategoryInput {
  name: string;
}

export type UpdateProcessCategoryInput = CreateProcessCategoryInput;

export interface ProcessCategoryWhereInput {
  name?: string;
}
