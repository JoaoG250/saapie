<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { QInfiniteScrollProps } from "quasar";
import {
  ProcessRequestsQueryNode,
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables,
  PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { PageInfo } from "src/interfaces";
import { ref } from "vue";
import ProcessRequestList from "src/components/process/ProcessRequestList.vue";

const processRequests = ref<ProcessRequestsQueryNode[]>([]);
const pageInfo = ref<PageInfo>();
const variables = ref<ProcessRequestsQueryVariables>({
  first: 30,
});

const { onResult, fetchMore } = useQuery<
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables
>(PROCESS_REQUESTS_QUERY, variables, { fetchPolicy: "network-only" });
onResult((result) => {
  processRequests.value = result.data.processRequests.edges.map(
    (edge) => edge.node
  );
  pageInfo.value = result.data.processRequests.pageInfo;
});

const onLoad: QInfiniteScrollProps["onLoad"] = async (_index, done) => {
  if (!pageInfo.value) {
    done();
    return;
  }
  if (!pageInfo.value.hasNextPage) {
    done(true);
    return;
  }
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
        processRequests: {
          ...fetchMoreResult.processRequests,
          edges: prev.processRequests.edges.concat(
            fetchMoreResult.processRequests.edges
          ),
        },
      };
    },
  });
  if (!pageInfo.value.hasNextPage) {
    done(true);
    return;
  }
  done();
};
</script>

<template>
  <q-page class="container">
    <div class="text-h4 text-weight-bold text-center q-my-md">
      PEDIDOS DE ABERTURA DE PROCESSO
    </div>
    <q-separator class="q-mb-md" inset />
    <q-infinite-scroll :offset="250" @load="onLoad">
      <ProcessRequestList
        :process-requests="processRequests"
        :omit-user-info="true"
      />
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<style scoped></style>
