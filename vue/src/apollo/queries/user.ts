import gql from "graphql-tag";
import {
  UserType,
  UserWithGroupsType,
  PageInfo,
  PaginationArgs,
} from "src/interfaces";

export const ME_QUERY = gql`
  query me {
    me {
      id
      firstName
      lastName
      email
      isActive
      isVerified
      groups {
        id
        name
      }
    }
  }
`;

export interface MeQueryResult {
  me: UserWithGroupsType;
}

export const USER_QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      isActive
      isVerified
      groups {
        id
        name
      }
    }
  }
`;

export interface UserQueryResult {
  user: UserWithGroupsType;
}

export interface UserQueryVariables {
  id: string;
}

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
      totalCount
    }
  }
`;

export interface UsersQueryResult {
  users: {
    pageInfo: PageInfo;
    edges: {
      cursor: string;
      node: UserType;
    }[];
    totalCount: number;
  };
}

export type UsersQueryVariables = PaginationArgs;
