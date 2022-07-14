import gql from "graphql-tag";
import {
  PageInfo,
  PaginationArgs,
  ProcessRequestType,
  ProcessType,
} from "src/interfaces";

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
  process: ProcessType;
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
      node: ProcessType;
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
      processId
      userId
      data
    }
  }
`;

export interface ProcessRequestQueryResult {
  processRequest: ProcessRequestType;
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
          processId
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
      node: ProcessRequestType;
    }[];
    totalCount: number;
  };
}

export type ProcessRequestsQueryVariables = PaginationArgs;
