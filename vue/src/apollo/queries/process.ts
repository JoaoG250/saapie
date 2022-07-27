/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from "graphql-tag";
import {
  FormKitData,
  PageInfo,
  PaginationArgs,
  ProcessRequestStatus,
  ProcessRequestWhereInput,
  ProcessWhereInput,
} from "src/interfaces";

export const PROCESS_QUERY = gql`
  query process($id: ID, $slug: String) {
    process(id: $id, slug: $slug) {
      id
      createdAt
      updatedAt
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

export interface ProcessQueryResult {
  process: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    slug: string;
    description: string;
    targetGroupId: string;
    forwardToGroupId: string;
    form: {
      id: string;
      name: string;
      definition: any;
    };
    targetGroup: {
      id: string;
      name: string;
    };
    forwardToGroup: {
      id: string;
      name: string;
    } | null;
  };
}

export interface ProcessQueryVariables {
  id?: string;
  slug?: string;
}

export const PROCESSES_QUERY = gql`
  query processes(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $where: ProcessWhereInput
  ) {
    processes(
      after: $after
      before: $before
      first: $first
      last: $last
      where: $where
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
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
      totalCount
    }
  }
`;

export interface ProcessesQueryNode {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetGroupId: string;
  forwardToGroupId: string;
  form: {
    id: string;
    name: string;
    definition: any;
  };
  targetGroup: {
    id: string;
    name: string;
  };
  forwardToGroup: {
    id: string;
    name: string;
  } | null;
}

export interface ProcessesQueryResult {
  processes: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: ProcessesQueryNode;
    }[];
    totalCount: number;
  };
}

export interface ProcessesQueryVariables extends PaginationArgs {
  where?: ProcessWhereInput;
}

export const PROCESS_REQUEST_QUERY = gql`
  query processRequest($id: ID!) {
    processRequest(id: $id) {
      id
      createdAt
      updatedAt
      status
      data
      process {
        id
        name
        slug
        description
        targetGroup {
          id
          name
        }
        forwardToGroup {
          id
          name
        }
        form {
          id
          name
          definition
        }
      }
      user {
        id
        firstName
        lastName
        email
        isActive
        isVerified
      }
    }
  }
`;

export interface ProcessRequestQueryResult {
  processRequest: {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: ProcessRequestStatus;
    data: FormKitData;
    process: {
      id: string;
      name: string;
      slug: string;
      description: string;
      targetGroup: {
        id: string;
        name: string;
      };
      forwardToGroup: {
        id: string;
        name: string;
      } | null;
      form: {
        id: string;
        name: string;
        definition: any;
      };
    };
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      isActive: boolean;
      isVerified: boolean;
    };
  };
}

export interface ProcessRequestQueryVariables {
  id: string;
}

export const PROCESS_REQUESTS_QUERY = gql`
  query processRequests(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $where: ProcessRequestWhereInput
  ) {
    processRequests(
      after: $after
      before: $before
      first: $first
      last: $last
      where: $where
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
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
      totalCount
    }
  }
`;

export interface ProcessRequestsQueryNode {
  id: string;
  createdAt: string;
  updatedAt: string;
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
}

export interface ProcessRequestsQueryResult {
  processRequests: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: ProcessRequestsQueryNode;
    }[];
    totalCount: number;
  };
}

export interface ProcessRequestsQueryVariables extends PaginationArgs {
  where?: ProcessRequestWhereInput | null;
}

export const ASSIGNED_PROCESS_REQUESTS_QUERY = gql`
  query assignedProcessRequests(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    assignedProcessRequests(
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
          status
          process {
            id
            name
            description
          }
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;

export interface AssignedProcessRequestsQueryNode {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ProcessRequestStatus;
  process: {
    id: string;
    name: string;
    description: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AssignedProcessRequestsQueryResult {
  assignedProcessRequests: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: AssignedProcessRequestsQueryNode;
    }[];
  };
}

export type AssignedProcessRequestsQueryVariables = PaginationArgs;

export const FORWARDED_PROCESS_REQUESTS_QUERY = gql`
  query forwardedProcessRequests(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    forwardedProcessRequests(
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
          status
          process {
            id
            name
            description
          }
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;

export interface ForwardedProcessRequestsQueryNode {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ProcessRequestStatus;
  process: {
    id: string;
    name: string;
    description: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ForwardedProcessRequestsQueryResult {
  forwardedProcessRequests: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: ForwardedProcessRequestsQueryNode;
    }[];
  };
}

export type ForwardedProcessRequestsQueryVariables = PaginationArgs;
