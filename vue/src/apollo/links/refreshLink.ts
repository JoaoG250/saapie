import { TokenRefreshLink } from "apollo-link-token-refresh";
import decodeJWT, { type JwtPayload } from "jwt-decode";
import type { FetchResult } from "@apollo/client";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "src/common/auth";
import { RefreshTokensResult } from "../mutations";

export const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  // Indicates the current state of access token expiration
  // If token not yet expired or user doesn't have a token (guest) true should be returned
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    // If there is no token, the user is not logged in
    // We return true here, because there is no need to refresh the token
    if (!token) return true;

    // Otherwise, we check if the token is expired
    const claims = decodeJWT<JwtPayload>(token);

    if (!claims.exp) return true;

    const expirationTimeInSeconds = claims.exp * 1000;
    const isValid = expirationTimeInSeconds >= Date.now();

    // Return true if the token is still valid, otherwise false and trigger a token refresh
    return isValid;
  },
  // Responsible for fetching refresh token
  fetchAccessToken: async () => {
    const refreshToken = getRefreshToken();

    const request = await fetch(import.meta.env.VITE_API_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation refreshTokens($refreshToken: String!) {
                  refreshTokens(refreshToken: $refreshToken) {
                    accessToken
                    refreshToken
                  }
                }`,
        variables: {
          refreshToken,
        },
      }),
    });

    return request.json();
  },
  // Callback which receives a fresh token from Response.
  // From here we can save token to the storage
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },
  handleResponse: () => (response: FetchResult<RefreshTokensResult> | null) => {
    if (!response?.data) {
      throw new Error("Response does not contain data");
    }
    const { accessToken, refreshToken } = response.data.refreshTokens;
    setRefreshToken(refreshToken);
    return { accessToken };
  },
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Try to reauthenticate.");
    console.error(err);
    // Remove invalid tokens
    deleteAccessToken();
    deleteRefreshToken();
  },
});
