export interface Group {
  id: string;
  name: string;
}

export interface CreateGroupInput {
  name: string;
}

export type UpdateGroupInput = CreateGroupInput;

export interface GroupWhereInput {
  name?: string;
}
