<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  AssignedProcessRequestsNode,
  AssignedProcessRequestsQueryResult,
  AssignedProcessRequestsQueryVariables,
  ASSIGNED_PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { ref } from "vue";
import ProcessRequestList from "src/components/process/ProcessRequestList.vue";

const processRequests = ref<AssignedProcessRequestsNode[]>([]);
const { onResult } = useQuery<
  AssignedProcessRequestsQueryResult,
  AssignedProcessRequestsQueryVariables
>(
  ASSIGNED_PROCESS_REQUESTS_QUERY,
  { first: 10 },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  processRequests.value = result.data.assignedProcessRequests.edges.map(
    (edge) => edge.node
  );
});
</script>

<template>
  <ProcessRequestList :process-requests="processRequests" />
</template>

<style scoped></style>
