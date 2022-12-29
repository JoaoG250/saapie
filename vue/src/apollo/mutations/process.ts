import gql from "graphql-tag";
import {
  CreateProcessCategoryInput,
  CreateProcessInput,
  FormKitData,
  ProcessRequestStatus,
  UpdateProcessCategoryInput,
  UpdateProcessInput,
} from "src/interfaces";

export const CREATE_PROCESS_MUTATION = gql`
  mutation createProcess($data: CreateProcessInput!) {
    createProcess(data: $data) {
      id
      name
      slug
      description
      active
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
    active: boolean;
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
      active
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
    active: boolean;
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
      active
      targetGroupId
      forwardToGroupId
    }
  }
`;

export interface DeleteProcessMutationResult {
  deleteProcess: {
    id: string;
    name: string;
    slug: string;
    description: string;
    active: boolean;
    targetGroupId: string;
    forwardToGroupId: string | null | undefined;
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
      data
    }
  }
`;

export interface DeleteProcessRequestMutationResult {
  deleteProcessRequest: {
    id: string;
    status: ProcessRequestStatus;
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

export const ADD_PROCESS_REQUEST_EXTRA_ATTACHMENT_MUTATION = gql`
  mutation addProcessRequestExtraAttachment($id: ID!, $attachment: Upload!) {
    addProcessRequestExtraAttachment(id: $id, attachment: $attachment) {
      updatedAt
      data
    }
  }
`;

export interface AddProcessRequestExtraAttachmentMutationResult {
  addProcessRequestExtraAttachment: {
    updatedAt: string;
    data: FormKitData;
  };
}

export interface AddProcessRequestExtraAttachmentMutationVariables {
  id: string;
  attachment: File;
}

export const REMOVE_PROCESS_REQUEST_EXTRA_ATTACHMENT_MUTATION = gql`
  mutation removeProcessRequestExtraAttachment($id: ID!) {
    removeProcessRequestExtraAttachment(id: $id) {
      updatedAt
      data
    }
  }
`;

export interface RemoveProcessRequestExtraAttachmentMutationResult {
  removeProcessRequestExtraAttachment: {
    updatedAt: string;
    data: FormKitData;
  };
}

export interface RemoveProcessRequestExtraAttachmentMutationVariables {
  id: string;
}

export const CREATE_PROCESS_CATEGORY_MUTATION = gql`
  mutation createProcessCategory($data: CreateProcessCategoryInput!) {
    createProcessCategory(data: $data) {
      id
      name
      slug
    }
  }
`;

export interface CreateProcessCategoryMutationResult {
  createProcessCategory: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateProcessCategoryMutationVariables {
  data: CreateProcessCategoryInput;
}

export const UPDATE_PROCESS_CATEGORY_MUTATION = gql`
  mutation updateProcessCategory($id: ID!, $data: UpdateProcessCategoryInput!) {
    updateProcessCategory(id: $id, data: $data) {
      id
      name
      slug
    }
  }
`;

export interface UpdateProcessCategoryMutationResult {
  updateProcessCategory: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface UpdateProcessCategoryMutationVariables {
  id: string;
  data: UpdateProcessCategoryInput;
}

export const DELETE_PROCESS_CATEGORY_MUTATION = gql`
  mutation deleteProcessCategory($id: ID!) {
    deleteProcessCategory(id: $id) {
      id
      name
      slug
    }
  }
`;

export interface DeleteProcessCategoryMutationResult {
  deleteProcessCategory: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface DeleteProcessCategoryMutationVariables {
  id: string;
}

export const ADD_PROCESS_TO_CATEGORY_MUTATION = gql`
  mutation addProcessToCategory($processId: ID!, $processCategoryId: ID!) {
    addProcessToCategory(
      processId: $processId
      processCategoryId: $processCategoryId
    )
  }
`;

export interface AddProcessToCategoryMutationResult {
  addProcessToCategory: boolean;
}

export interface AddProcessToCategoryMutationVariables {
  processId: string;
  processCategoryId: string;
}

export const REMOVE_PROCESS_FROM_CATEGORY_MUTATION = gql`
  mutation removeProcessFromCategory($processId: ID!, $processCategoryId: ID!) {
    removeProcessFromCategory(
      processId: $processId
      processCategoryId: $processCategoryId
    )
  }
`;

export interface RemoveProcessFromCategoryMutationResult {
  removeProcessFromCategory: boolean;
}

export interface RemoveProcessFromCategoryMutationVariables {
  processId: string;
  processCategoryId: string;
}
