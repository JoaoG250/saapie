import { boot } from "quasar/wrappers";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

export default boot(async () => {
  provideApolloClient(apolloClient);
});
