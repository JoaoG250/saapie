import gql from "graphql-tag";
import {
  CreateProcessInput,
  ProcessType,
  UpdateProcessInput,
} from "src/interfaces";

export const CREATE_PROCESS_MUTATION = gql`
  mutation createProcess($data: CreateProcessInput!) {
    createProcess(data: $data) {
      id
      name
      slug
      description
      targetGroupId
      forwardToGroupId
      form {
        id
        name
        definition
      }
      targetGroup {
        id
        name
      }
      forwardToGroup {
        id
        name
      }
    }
  }
`;

export interface CreateProcessMutationResult {
  createProcess: ProcessType;
}

export interface CreateProcessMutationVariables {
  data: CreateProcessInput;
}

export const UPDATE_PROCESS_MUTATION = gql`
  mutation updateProcess($id: ID!, $data: UpdateProcessInput!) {
    updateProcess(id: $id, data: $data) {
      id
      name
      slug
      description
      targetGroupId
      forwardToGroupId
      form {
        id
        name
        definition
      }
      targetGroup {
        id
        name
      }
      forwardToGroup {
        id
        name
      }
    }
  }
`;

export interface UpdateProcessMutationResult {
  updateProcess: ProcessType;
}

export interface UpdateProcessMutationVariables {
  id: string;
  data: UpdateProcessInput;
}

export const DELETE_PROCESS_MUTATION = gql`
  mutation deleteProcess($id: ID!) {
    deleteProcess(id: $id) {
      id
      name
      slug
      description
      targetGroupId
      forwardToGroupId
      targetGroup {
        id
        name
      }
      forwardToGroup {
        id
        name
      }
    }
  }
`;

export interface DeleteProcessMutationResult {
  deleteProcess: ProcessType;
}

export interface DeleteProcessMutationVariables {
  id: string;
}
