import gql from "graphql-tag";
import { CreateGroupInput, UpdateGroupInput } from "src/interfaces";

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($data: CreateGroupInput!) {
    createGroup(data: $data) {
      id
      name
    }
  }
`;

export interface CreateGroupMutationResult {
  createGroup: {
    id: string;
    name: string;
  };
}

export interface CreateGroupMutationVariables {
  data: CreateGroupInput;
}

export const UPDATE_GROUP_MUTATION = gql`
  mutation updateGroup($id: ID!, $data: UpdateGroupInput!) {
    updateGroup(id: $id, data: $data) {
      id
      name
    }
  }
`;

export interface UpdateGroupMutationResult {
  updateGroup: {
    id: string;
    name: string;
  };
}

export interface UpdateGroupMutationVariables {
  id: string;
  data: UpdateGroupInput;
}

export const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroup($id: ID!) {
    deleteGroup(id: $id) {
      id
      name
    }
  }
`;

export interface DeleteGroupMutationResult {
  deleteGroup: {
    id: string;
    name: string;
  };
}

export interface DeleteGroupMutationVariables {
  id: string;
}

export const ADD_USER_TO_GROUP_MUTATION = gql`
  mutation addUserToGroup($groupId: ID!, $userId: ID!) {
    addUserToGroup(groupId: $groupId, userId: $userId)
  }
`;

export interface AddUserToGroupMutationResult {
  addUserToGroup: boolean;
}

export interface AddUserToGroupMutationVariables {
  groupId: string;
  userId: string;
}

export const REMOVE_USER_FROM_GROUP_MUTATION = gql`
  mutation removeUserFromGroup($groupId: ID!, $userId: ID!) {
    removeUserFromGroup(groupId: $groupId, userId: $userId)
  }
`;

export interface RemoveUserFromGroupMutationResult {
  removeUserFromGroup: boolean;
}

export interface RemoveUserFromGroupMutationVariables {
  groupId: string;
  userId: string;
}
