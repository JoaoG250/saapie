import { DocumentNode, FetchPolicy, OperationVariables } from "@apollo/client";
import { useApolloClient } from "@vue/apollo-composable";

export async function useAsyncQuery<
  TResult,
  TVariables extends OperationVariables = OperationVariables
>(
  document: DocumentNode,
  options?: { variables?: TVariables; fetchPolicy?: FetchPolicy }
): Promise<TResult> {
  const { resolveClient } = useApolloClient();
  const client = resolveClient();
  const response = await client.query({
    query: document,
    ...options,
  });
  return response.data;
}
