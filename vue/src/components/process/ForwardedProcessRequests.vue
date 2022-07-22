<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ForwardedProcessRequestsNode,
  ForwardedProcessRequestsQueryResult,
  ForwardedProcessRequestsQueryVariables,
  FORWARDED_PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { ref } from "vue";
import ProcessRequestList from "src/components/process/ProcessRequestList.vue";

const processRequests = ref<ForwardedProcessRequestsNode[]>([]);
const { onResult } = useQuery<
  ForwardedProcessRequestsQueryResult,
  ForwardedProcessRequestsQueryVariables
>(
  FORWARDED_PROCESS_REQUESTS_QUERY,
  { first: 10 },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  processRequests.value = result.data.forwardedProcessRequests.edges.map(
    (edge) => edge.node
  );
});
// TODO: implement list infinite scroll
</script>

<template>
  <ProcessRequestList :process-requests="processRequests" />
</template>

<style scoped></style>
