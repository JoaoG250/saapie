<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables,
  PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { ProcessRequestWithProcess } from "src/interfaces";
import { ref } from "vue";
import ProcessRequestList from "src/components/process/ProcessRequestList.vue";

const processRequests = ref<ProcessRequestWithProcess[]>([]);
const { onResult } = useQuery<
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables
>(PROCESS_REQUESTS_QUERY, { first: 10 }, { fetchPolicy: "network-only" });
onResult((result) => {
  processRequests.value = result.data.processRequests.edges.map(
    (edge) => edge.node
  );
});
</script>

<template>
  <q-page class="container">
    <div class="text-h4 text-weight-bold q-my-md">
      Pedidos de abertura de processo
    </div>
    <ProcessRequestList :process-requests="processRequests" />
  </q-page>
</template>

<style scoped></style>
