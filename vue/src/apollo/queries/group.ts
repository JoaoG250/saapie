import gql from "graphql-tag";
import { GroupWhereInput, PageInfo, PaginationArgs } from "src/interfaces";

export const GROUP_QUERY = gql`
  query group($id: ID!) {
    group(id: $id) {
      id
      name
    }
  }
`;

export interface GroupQueryResult {
  group: {
    id: string;
    name: string;
  };
}

export interface GroupQueryVariables {
  id: string;
}

export const GROUPS_QUERY = gql`
  query groups(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $where: GroupWhereInput
  ) {
    groups(
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
      node: {
        id: string;
        name: string;
      };
    }[];
    totalCount: number;
  };
}

export interface GroupsQueryVariables extends PaginationArgs {
  where?: GroupWhereInput;
}
