import { Group } from "./group";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserWithGroups extends User {
  groups: Group[];
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
}

export type UpdateUserInput = Omit<CreateUserInput, "password">;

export interface UserWhereInput {
  email?: string;
}
