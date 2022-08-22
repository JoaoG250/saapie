<script setup lang="ts">
import { ProcessRequestQueryResult } from "src/apollo/queries";
import { formatDate } from "src/common/format";

interface ProcessRequestInfoProps {
  processRequest: NonNullable<ProcessRequestQueryResult["processRequest"]>;
}

defineProps<ProcessRequestInfoProps>();
</script>

<template>
  <div class="column q-mb-sm">
    <div class="row justify-center q-mb-sm">
      <div class="q-mr-md">
        <q-icon class="q-mr-sm" name="person" size="2em" />
        <span>
          {{ processRequest.user.firstName }}
          {{ processRequest.user.lastName }}
        </span>
      </div>
      <div>
        <q-icon class="q-mr-sm" name="email" size="2em" />
        <span>{{ processRequest.user.email }}</span>
      </div>
    </div>
    <div class="row justify-center">
      <div>
        <q-icon class="q-mr-sm" name="event" size="2em" />
        <span>{{ formatDate(processRequest.createdAt, true) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
