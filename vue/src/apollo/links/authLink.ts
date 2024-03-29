import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "src/common/auth";

export const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = getAccessToken();

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
