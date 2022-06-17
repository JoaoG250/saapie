export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenPayload {
  id: string;
  groups: string[];
}
