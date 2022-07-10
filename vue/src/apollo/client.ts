import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { createUploadLink } from "apollo-upload-client";
import { authLink, refreshLink } from "./links";

// HTTP connection to the API
const httpLink = createUploadLink({
  // You should use an absolute URL here
  uri: process.env.API_URL + "/graphql",
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: refreshLink.concat(authLink).concat(httpLink),
  cache,
});

export default apolloClient;
