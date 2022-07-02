export interface GroupType {
  id: string;
  name: string;
}

export interface CreateGroupInput {
  name: string;
}

export type UpdateGroupInput = CreateGroupInput;
