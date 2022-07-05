import gql from "graphql-tag";
import { PageInfo, PaginationArgs, ProcessType } from "src/interfaces";

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
