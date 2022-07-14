<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables,
  PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { ProcessRequest } from "src/interfaces";
import { ref } from "vue";

const processRequests = ref<ProcessRequest[]>([]);
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
    <q-list bordered>
      <template v-for="(request, index) in processRequests" :key="index">
        <q-item :to="{ name: 'process-request', params: { id: request.id } }">
          <q-item-section>
            <q-item-label>{{ request.id }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ request.status }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-if="index < processRequests.length - 1" spaced inset />
      </template>
    </q-list>
  </q-page>
</template>

<style scoped></style>
