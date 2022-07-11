import { JsonValue } from ".";
import { GroupType } from "./group";

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
  data: JsonValue;
}
