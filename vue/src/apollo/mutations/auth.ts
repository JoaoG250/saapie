import gql from "graphql-tag";

export const SIGNIN_MUTATION = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      refreshToken
      accessToken
    }
  }
`;

export interface SigninMutationResult {
  signin: {
    refreshToken: string;
    accessToken: string;
  };
}

export interface SigninMutationVariables {
  email: string;
  password: string;
}

export interface RefreshTokensResult {
  refreshTokens: {
    refreshToken: string;
    accessToken: string;
  };
}
