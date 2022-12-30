<script setup lang="ts">
import { reactive } from "vue";
import { ProcessWhereInput } from "src/interfaces";
import ProcessCategorySelect, {
  ProcessCategorySelectProps,
} from "./ProcessCategorySelect.vue";

const emit = defineEmits<{ (e: "filter", filter: ProcessWhereInput): void }>();
const processFilter = reactive<ProcessWhereInput>({});
const setProcessCategory: ProcessCategorySelectProps["onChange"] = (option) => {
  if (option) {
    processFilter.processCategory = option.value;
  } else {
    processFilter.processCategory = undefined;
  }
};
</script>

<template>
  <q-form class="row q-col-gutter-sm" @submit="emit('filter', processFilter)">
    <div class="col-12 col-sm-6">
      <q-input v-model="processFilter.name" label="Nome do processo" outlined />
    </div>
    <div class="col-12 col-sm-3">
      <ProcessCategorySelect
        label="Categoria"
        :on-change="setProcessCategory"
      />
    </div>
    <div class="col-12 col-sm-3">
      <q-btn class="fit" label="Buscar" type="submit" icon="search" push />
    </div>
  </q-form>
</template>

<style scoped></style>
