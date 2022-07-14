import gql from "graphql-tag";
import { PageInfo, PaginationArgs, UserWhereInput } from "src/interfaces";

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
  me: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
    groups: {
      id: string;
      name: string;
    }[];
  };
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
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
    groups: {
      id: string;
      name: string;
    }[];
  };
}

export interface UserQueryVariables {
  id: string;
}

export const USERS_QUERY = gql`
  query users(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $where: UserWhereInput
  ) {
    users(
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
      node: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        isActive: boolean;
        isVerified: boolean;
      };
    }[];
    totalCount: number;
  };
}

export interface UsersQueryVariables extends PaginationArgs {
  where?: UserWhereInput;
}

export const GET_USER_GROUPS_QUERY = gql`
  query getUserGroups($id: ID!) {
    user(id: $id) {
      groups {
        id
        name
      }
    }
  }
`;

export interface GetUserGroupsQueryResult {
  user: {
    groups: {
      id: string;
      name: string;
    }[];
  };
}

export type GetUserGroupsQueryVariables = UserQueryVariables;
