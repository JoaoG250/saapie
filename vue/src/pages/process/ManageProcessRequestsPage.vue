<script setup lang="ts">
import { ref } from "vue";
import AssignedProcessRequests from "src/components/process/AssignedProcessRequests.vue";
import ForwardedProcessRequests from "src/components/process/ForwardedProcessRequests.vue";

const tab = ref("assigned");
</script>

<template>
  <q-page class="container">
    <div class="text-h4 text-weight-bold text-center q-my-md page-title">
      PEDIDOS DE ABERTURA DE PROCESSO
    </div>
    <q-tabs
      v-model="tab"
      inline-label
      class="bg-primary text-white shadow-2 rounded-borders"
    >
      <q-tab name="assigned" icon="mail" label="Atribuido" />
      <q-tab name="forwarded" icon="forward" label="Emcaminhado" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="assigned">
        <AssignedProcessRequests />
      </q-tab-panel>
      <q-tab-panel name="forwarded">
        <ForwardedProcessRequests />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/mixins";
@include screen(xs) {
  .page-title {
    font-size: 1.6rem;
  }
}
</style>
