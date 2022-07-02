export interface ProcessForm {
  id: string;
  name: string;
  definition: object;
}

export interface Process {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string | null | undefined;
  form: ProcessForm;
}

export type ProcessWithoutForm = Omit<Process, "form">;

export interface ProcessFormType {
  id: string;
  name: string;
  definition: object;
}

export interface ProcessType {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string;
  form: ProcessFormType;
}

export interface CreateProcessFormInput {
  name: string;
  definition: object;
}

export interface CreateProcessInput {
  name: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string;
  form: CreateProcessFormInput;
}

export type UpdateProcessInput = CreateProcessInput;
