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

export const SIGNUP_MUTATION = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    )
  }
`;

export interface SignupMutationResult {
  signup: boolean;
}

export interface SignupMutationVariables {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RefreshTokensResult {
  refreshTokens: {
    refreshToken: string;
    accessToken: string;
  };
}

export const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation activateAccount($token: String!) {
    activateAccount(token: $token)
  }
`;

export interface ActivateAccountMutationResult {
  activateAccount: boolean;
}

export interface ActivateAccountMutationVariables {
  token: string;
}

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`;

export interface ResetPasswordMutationResult {
  resetPassword: boolean;
}

export interface ResetPasswordMutationVariables {
  token: string;
  password: string;
}

export const SEND_PASSWORD_RESET_EMAIL_MUTATION = gql`
  mutation sendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email)
  }
`;

export interface SendPasswordResetEmailMutationResult {
  sendPasswordResetEmail: boolean;
}

export interface SendPasswordResetEmailMutationVariables {
  email: string;
}
