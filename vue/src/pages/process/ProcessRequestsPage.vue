<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables,
  PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { ProcessRequestWithProcess } from "src/interfaces";
import { ref } from "vue";

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
    <div class="text-h4 text-weight-bold text-center q-my-md">
      Pedidos de abertura de processo
    </div>
    <q-separator class="q-mb-md" inset />
    <q-list class="rounded-borders" bordered>
      <template v-for="(request, index) in processRequests" :key="index">
        <q-item :to="{ name: 'process-request', params: { id: request.id } }">
          <q-item-section>
            <q-item-label>{{ request.process.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ request.status }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-if="index < processRequests.length - 1" />
      </template>
      <q-item v-if="processRequests.length === 0">
        <q-item-section avatar>
          <q-icon name="warning" />
        </q-item-section>
        <q-item-section>
          Nenhum pedido de abertura de processo encontrado
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped></style>
