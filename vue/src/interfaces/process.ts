/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormKitData } from "./formkit";
import { Group } from "./group";
import { User } from "./user";

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

export type UpdateProcessInput = CreateProcessInput;

export interface ProcessRequest {
  id: string;
  status: ProcessRequestStatus;
  processId: string;
  userId: string;
  data: FormKitData;
}

export interface ProcessRequestWithProcess extends ProcessRequest {
  process: Pick<Process, "id" | "name" | "slug">;
}

export interface ProcessRequestWithProcessAndUser
  extends Omit<ProcessRequest, "processId" | "userId"> {
  process: Omit<Process, "targetGroupId" | "forwardToGroupId">;
  user: User;
}

export interface ProcessRequestWhereInput {
  userId?: string;
  processId?: string;
  status?: ProcessRequestStatus;
}
