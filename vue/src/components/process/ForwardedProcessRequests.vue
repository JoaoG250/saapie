<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ForwardedProcessRequestsQueryNode,
  ForwardedProcessRequestsQueryResult,
  ForwardedProcessRequestsQueryVariables,
  FORWARDED_PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { ref } from "vue";
import ProcessRequestList from "src/components/process/ProcessRequestList.vue";
import { PageInfo } from "src/interfaces";

const processRequests = ref<ForwardedProcessRequestsQueryNode[]>([]);
const pageInfo = ref<PageInfo>();
const variables = ref<ForwardedProcessRequestsQueryVariables>({
  first: 20,
});

const { loading, onResult, fetchMore } = useQuery<
  ForwardedProcessRequestsQueryResult,
  ForwardedProcessRequestsQueryVariables
>(FORWARDED_PROCESS_REQUESTS_QUERY, variables, { fetchPolicy: "network-only" });
onResult((result) => {
  processRequests.value = result.data.forwardedProcessRequests.edges.map(
    (edge) => edge.node
  );
  pageInfo.value = result.data.forwardedProcessRequests.pageInfo;
});

async function loadMore() {
  if (!pageInfo.value || !pageInfo.value.hasNextPage) return;
  await fetchMore({
    variables: {
      first: variables.value.first,
      after: pageInfo.value.endCursor,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return prev;
      }
      return {
        forwardedProcessRequests: {
          ...fetchMoreResult.forwardedProcessRequests,
          edges: prev.forwardedProcessRequests.edges.concat(
            fetchMoreResult.forwardedProcessRequests.edges
          ),
        },
      };
    },
  });
}
</script>

<template>
  <ProcessRequestList :process-requests="processRequests" />
  <div v-if="loading" class="row justify-center q-my-md">
    <q-spinner-dots color="primary" size="40px" />
  </div>
  <div v-else-if="pageInfo?.hasNextPage" class="row justify-center q-mt-lg">
    <q-btn
      color="primary"
      label="Carregar mais"
      icon="add"
      push
      @click="loadMore"
    />
  </div>
</template>

<style scoped></style>
