<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessesQueryResult,
  ProcessesQueryVariables,
  PROCESSES_QUERY,
} from "src/apollo/queries";
import { Process } from "src/interfaces";
import { ref } from "vue";
import ProcessList from "src/components/process/ProcessList.vue";

const processes = ref<Process[]>([]);
const { onResult } = useQuery<ProcessesQueryResult, ProcessesQueryVariables>(
  PROCESSES_QUERY,
  { first: 50 },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  processes.value = result.data.processes.edges.map((edge) => edge.node);
});
</script>

<template>
  <q-page class="container">
    <ProcessList :processes="processes" />
  </q-page>
</template>

<style scoped></style>
