import gql from "graphql-tag";
import { GroupType, PageInfo, PaginationArgs } from "src/interfaces";

export const GROUP_QUERY = gql`
  query group($id: ID!) {
    group(id: $id) {
      id
      name
    }
  }
`;

export interface GroupQueryResult {
  group: GroupType;
}

export interface GroupQueryVariables {
  id: string;
}

export const GROUPS_QUERY = gql`
  query groups($after: String, $before: String, $first: Int, $last: Int) {
    groups(after: $after, before: $before, first: $first, last: $last) {
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
        }
      }
      totalCount
    }
  }
`;

export interface GroupsQueryResult {
  groups: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: GroupType;
    }[];
    totalCount: number;
  };
}

export type GroupsQueryVariables = PaginationArgs;
