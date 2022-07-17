/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from "graphql-tag";
import { PageInfo, PaginationArgs } from "src/interfaces";

export const PROCESS_QUERY = gql`
  query process($id: ID, $slug: String) {
    process(id: $id, slug: $slug) {
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

export interface ProcessQueryResult {
  process: {
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
    };
  };
}

export interface ProcessQueryVariables {
  id?: string;
  slug?: string;
}

export const PROCESSES_QUERY = gql`
  query processes($after: String, $before: String, $first: Int, $last: Int) {
    processes(after: $after, before: $before, first: $first, last: $last) {
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

export interface ProcessesQueryResult {
  processes: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: {
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
        };
      };
    }[];
    totalCount: number;
  };
}

export type ProcessesQueryVariables = PaginationArgs;

export const PROCESS_REQUEST_QUERY = gql`
  query processRequest($id: ID!) {
    processRequest(id: $id) {
      id
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
    status: "OPEN" | "FORWARDED" | "PENDING_CHANGE" | "CLOSED";
    data: any;
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
      };
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
  ) {
    processRequests(
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
          status
          process {
            id
            name
            slug
          }
          userId
          data
        }
      }
      totalCount
    }
  }
`;

export interface ProcessRequestsQueryResult {
  processRequests: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: {
        id: string;
        status: "OPEN" | "FORWARDED" | "PENDING_CHANGE" | "CLOSED";
        process: {
          id: string;
          name: string;
          slug: string;
        };
        userId: string;
        data: any;
      };
    }[];
    totalCount: number;
  };
}

export type ProcessRequestsQueryVariables = PaginationArgs;
