/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupType } from "./group";
import { User } from "./user";

export interface ProcessForm {
  id: string;
  name: string;
  definition: object[];
}

export interface Process {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string | null | undefined;
  form: ProcessForm;
  targetGroup: GroupType;
  forwardToGroup?: GroupType;
}

export type ProcessWithoutForm = Omit<Process, "form">;

export interface ProcessFormType {
  id: string;
  name: string;
  definition: object[];
}

export interface ProcessType {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string | null | undefined;
  form: ProcessFormType;
  targetGroup: GroupType;
  forwardToGroup?: GroupType;
}

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

export interface ProcessRequestType {
  id: string;
  status: "OPEN" | "FORWARDED" | "PENDING_CHANGE" | "CLOSED";
  processId: string;
  userId: string;
  data: any;
}

export interface ProcessRequest {
  id: string;
  status: "OPEN" | "FORWARDED" | "PENDING_CHANGE" | "CLOSED";
  processId: string;
  userId: string;
  data: any;
}

export interface ProcessRequestWithProcess extends ProcessRequest {
  process: Pick<Process, "id" | "name" | "slug">;
}

export interface ProcessRequestWithProcessAndUser
  extends Omit<ProcessRequest, "processId" | "userId"> {
  process: Omit<Process, "targetGroupId" | "forwardToGroupId">;
  user: User;
}
