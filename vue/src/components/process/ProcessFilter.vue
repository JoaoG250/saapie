<script setup lang="ts">
import { reactive } from "vue";
import { ProcessWhereInput } from "src/interfaces";

const emit = defineEmits<{ (e: "filter", filter: ProcessWhereInput): void }>();
const processFilter = reactive<ProcessWhereInput>({});
</script>

<template>
  <q-form class="row q-col-gutter-sm" @submit="emit('filter', processFilter)">
    <div class="col-12 col-sm-9">
      <q-input v-model="processFilter.name" label="Nome do processo" outlined />
    </div>
    <div class="col-12 col-sm-3">
      <q-btn class="fit" label="Buscar" type="submit" icon="search" push />
    </div>
  </q-form>
</template>

<style scoped></style>
