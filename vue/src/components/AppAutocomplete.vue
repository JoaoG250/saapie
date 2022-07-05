<script setup lang="ts">
import { QSelectProps } from "quasar";
import { SelectOption } from "src/interfaces";
import { ref } from "vue";

export interface AppAutocompleteProps {
  label: string;
  loading: boolean;
  options: SelectOption[];
  onFilter: QSelectProps["onFilter"];
  onChange: QSelectProps["onUpdate:modelValue"];
}

defineProps<AppAutocompleteProps>();
const model = ref<SelectOption | null>(null);
</script>

<template>
  <q-select
    v-model="model"
    :label="label"
    input-debounce="500"
    use-input
    clearable
    :loading="loading"
    :options="options"
    @filter="onFilter"
    @update:model-value="onChange"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> Nenhum resultado </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style scoped></style>
