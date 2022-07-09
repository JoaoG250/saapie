export interface CreateProcessDto {
  name: string;
  description: string;
  form: {
    name: string;
    definition: object[];
  };
  targetGroupId: string;
  forwardToGroupId?: string;
}
