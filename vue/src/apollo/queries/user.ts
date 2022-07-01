import gql from "graphql-tag";
import { PageInfo, PaginationArgs } from "src/interfaces";

export const USERS_QUERY = gql`
  query users($after: String, $before: String, $first: Int, $last: Int) {
    users(after: $after, before: $before, first: $first, last: $last) {
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
          firstName
          lastName
          email
          isActive
          isVerified
        }
      }
    }
  }
`;

export interface UsersQueryResult {
  users: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        isActive: boolean;
        isVerified: boolean;
      };
    }[];
  };
}

export type UsersQueryVariables = PaginationArgs;
