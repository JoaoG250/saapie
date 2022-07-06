import gql from "graphql-tag";
import {
  UserType,
  UserWithGroupsType,
  PageInfo,
  PaginationArgs,
  UserWhereInput,
  GroupType,
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
      node: UserType;
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
    groups: GroupType[];
  };
}

export type GetUserGroupsQueryVariables = UserQueryVariables;
