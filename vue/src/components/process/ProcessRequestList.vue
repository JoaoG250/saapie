<script setup lang="ts">
interface ProcessRequestListProps {
  processRequests: {
    id: string;
    status: string;
    process: {
      id: string;
      name: string;
    };
  }[];
}
defineProps<ProcessRequestListProps>();
</script>

<template>
  <q-list bordered>
    <template v-for="(request, index) in processRequests" :key="index">
      <q-item :to="{ name: 'process-request', params: { id: request.id } }">
        <q-item-section>
          <q-item-label>{{ request.process.name }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ request.status }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator v-if="index < processRequests.length - 1" spaced inset />
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
</template>

<style scoped></style>
