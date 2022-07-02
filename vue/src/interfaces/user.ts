import { GroupType } from "./group";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserWithGroupsType extends UserType {
  groups: GroupType[];
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
