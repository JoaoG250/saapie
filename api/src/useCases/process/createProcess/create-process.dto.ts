export interface CreateProcessDto {
  name: string;
  form: {
    name: string;
    description: string;
    definition: object;
  };
  targetGroupId: string;
  forwardToGroupId?: string;
}
