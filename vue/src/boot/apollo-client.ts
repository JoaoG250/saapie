import { boot } from "quasar/wrappers";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

export default boot(async ({ app }) => {
  app.provide(DefaultApolloClient, apolloClient);
});
