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
