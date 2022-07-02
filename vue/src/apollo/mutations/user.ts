import gql from "graphql-tag";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
}

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
}

type UpdateUserInput = Omit<CreateUserInput, "password">;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      firstName
      lastName
      email
      isActive
      isVerified
    }
  }
`;

export interface CreateUserMutationResult {
  createUser: User;
}

export interface CreateUserMutationVariables {
  data: CreateUserInput;
}

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      firstName
      lastName
      email
      isActive
      isVerified
    }
  }
`;

export interface UpdateUserMutationResult {
  updateUser: User;
}

export interface UpdateUserMutationVariables {
  id: string;
  data: UpdateUserInput;
}

export const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      firstName
      lastName
      email
      isActive
      isVerified
    }
  }
`;

export interface DeleteUserMutationResult {
  deleteUser: User;
}

export interface DeleteUserMutationVariables {
  id: string;
}
