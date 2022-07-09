export interface UpdateProcessDto {
  id: string;
  data: {
    name: string;
    description: string;
    form: {
      name: string;
      definition: object[];
    };
    targetGroupId: string;
    forwardToGroupId?: string;
  };
}
