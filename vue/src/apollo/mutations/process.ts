import gql from "graphql-tag";
import {
  CreateProcessInput,
  FormKitData,
  ProcessRequestStatus,
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
  createProcess: {
    id: string;
    name: string;
    slug: string;
    description: string;
    targetGroupId: string;
    forwardToGroupId: string | null | undefined;
    form: {
      id: string;
      name: string;
      definition: object[];
    };
    targetGroup: {
      id: string;
      name: string;
    };
    forwardToGroup:
      | {
          id: string;
          name: string;
        }
      | null
      | undefined;
  };
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
  updateProcess: {
    id: string;
    name: string;
    slug: string;
    description: string;
    targetGroupId: string;
    forwardToGroupId: string | null | undefined;
    form: {
      id: string;
      name: string;
      definition: object[];
    };
    targetGroup: {
      id: string;
      name: string;
    };
    forwardToGroup:
      | {
          id: string;
          name: string;
        }
      | null
      | undefined;
  };
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

export interface DeleteProcessMutationResult {
  deleteProcess: {
    id: string;
    name: string;
    slug: string;
    description: string;
    targetGroupId: string;
    forwardToGroupId: string | null | undefined;
    form: {
      id: string;
      name: string;
      definition: object[];
    };
    targetGroup: {
      id: string;
      name: string;
    };
    forwardToGroup:
      | {
          id: string;
          name: string;
        }
      | null
      | undefined;
  };
}

export interface DeleteProcessMutationVariables {
  id: string;
}

export const CREATE_PROCESS_REQUEST_MUTATION = gql`
  mutation createProcessRequest(
    $processId: ID
    $processSlug: String
    $data: JSON!
    $attachments: [Upload!]
  ) {
    createProcessRequest(
      processId: $processId
      processSlug: $processSlug
      data: $data
      attachments: $attachments
    ) {
      id
      status
      processId
      userId
      data
    }
  }
`;

export interface CreateProcessRequestMutationResult {
  createProcessRequest: {
    id: string;
    status: ProcessRequestStatus;
    processId: string;
    userId: string;
    data: FormKitData;
  };
}

export interface CreateProcessRequestMutationVariables {
  processId?: string;
  processSlug?: string;
  data: FormKitData;
  attachments?: File[];
}

export const UPDATE_PROCESS_REQUEST_MUTATION = gql`
  mutation updateProcessRequest(
    $id: ID!
    $data: JSON!
    $attachments: [Upload!]
  ) {
    updateProcessRequest(id: $id, data: $data, attachments: $attachments) {
      id
      status
      processId
      userId
      data
    }
  }
`;

export interface UpdateProcessRequestMutationResult {
  updateProcessRequest: {
    id: string;
    status: ProcessRequestStatus;
    processId: string;
    userId: string;
    data: FormKitData;
  };
}

export interface UpdateProcessRequestMutationVariables {
  id: string;
  data: FormKitData;
  attachments?: File[];
}

export const DELETE_PROCESS_REQUEST_MUTATION = gql`
  mutation deleteProcessRequest($id: ID!) {
    deleteProcessRequest(id: $id) {
      id
      status
      process {
        id
        name
        slug
      }
      user {
        id
        firstName
        lastName
        email
      }
      data
    }
  }
`;

export interface DeleteProcessRequestMutationResult {
  deleteProcessRequest: {
    id: string;
    status: ProcessRequestStatus;
    process: {
      id: string;
      name: string;
      slug: string;
    };
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    data: FormKitData;
  };
}

export interface DeleteProcessRequestMutationVariables {
  id: string;
}

export const UPDATE_PROCESS_REQUEST_STATUS_MUTATION = gql`
  mutation updateProcessRequestStatus(
    $id: ID!
    $status: ProcessRequestStatus!
  ) {
    updateProcessRequestStatus(id: $id, status: $status) {
      status
    }
  }
`;

export interface UpdateProcessRequestStatusMutationResult {
  updateProcessRequestStatus: {
    status: ProcessRequestStatus;
  };
}

export interface UpdateProcessRequestStatusMutationVariables {
  id: string;
  status: ProcessRequestStatus;
}
