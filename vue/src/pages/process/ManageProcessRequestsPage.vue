<script setup lang="ts">
import { ref } from "vue";
import AssignedProcessRequests from "src/components/process/AssignedProcessRequests.vue";
import ForwardedProcessRequests from "src/components/process/ForwardedProcessRequests.vue";
import ClosedProcessRequests from "src/components/process/ClosedProcessRequests.vue";

const tab = ref("assigned");
</script>

<template>
  <q-page class="container">
    <div class="text-h4 text-center q-my-md page-heading">
      Pedidos De Abertura De Processo
    </div>
    <q-tabs
      v-model="tab"
      inline-label
      class="bg-primary text-white shadow-2 rounded-borders"
    >
      <q-tab name="assigned" icon="mail" label="Atribuido" no-caps />
      <q-tab name="forwarded" icon="forward" label="Emcaminhado" no-caps />
      <q-tab name="closed" icon="check" label="Finalizado" no-caps />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="assigned">
        <AssignedProcessRequests />
      </q-tab-panel>
      <q-tab-panel name="forwarded">
        <ForwardedProcessRequests />
      </q-tab-panel>
      <q-tab-panel name="closed">
        <ClosedProcessRequests />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/mixins";
@include screen(xs) {
  .page-heading {
    font-size: 1.6rem;
  }
}
</style>
