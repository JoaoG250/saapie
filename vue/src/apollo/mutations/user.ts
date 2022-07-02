import gql from "graphql-tag";
import { CreateUserInput, UpdateUserInput, UserType } from "src/interfaces";

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
  createUser: UserType;
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
  updateUser: UserType;
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
  deleteUser: UserType;
}

export interface DeleteUserMutationVariables {
  id: string;
}
