import gql from "graphql-tag";
import { ProcessType, PageInfo, PaginationArgs } from "src/interfaces";

export const PROCESS_QUERY = gql`
  query process($id: ID!) {
    process(id: $id) {
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
    }
  }
`;

export interface ProcessQueryResult {
  process: ProcessType;
}

export interface ProcessQueryVariables {
  id: string;
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
        }
      }
    }
  }
`;

export interface ProcessesQueryResult {
  processes: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: Omit<ProcessType, "form">;
    }[];
  };
}

export type ProcessesQueryVariables = PaginationArgs;
