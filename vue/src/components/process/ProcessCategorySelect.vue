<script setup lang="ts">
import * as _ from "lodash";
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessCategoriesQueryResult,
  ProcessCategoriesQueryVariables,
  PROCESS_CATEGORIES_QUERY,
} from "src/apollo/queries";
import { ref } from "vue";
import { SelectOption } from "src/interfaces";
import AppAutocomplete, {
  AppAutocompleteProps,
} from "components/AppAutocomplete.vue";

export interface ProcessCategorySelectProps {
  label: string;
  onChange: (option: SelectOption | null | undefined) => void;
  rules?: AppAutocompleteProps["rules"];
  initialSelected?: SelectOption;
}

const props = defineProps<ProcessCategorySelectProps>();
const options = ref<SelectOption[]>(
  props.initialSelected ? [props.initialSelected] : []
);
const cache = ref<SelectOption[]>([...options.value]);
const variables = ref<ProcessCategoriesQueryVariables>({
  first: 5,
});
const { onResult, loading } = useQuery<
  ProcessCategoriesQueryResult,
  ProcessCategoriesQueryVariables
>(PROCESS_CATEGORIES_QUERY, variables, { fetchPolicy: "network-only" });

onResult((result) => {
  options.value = result.data.processCategories.edges.map((edge) => ({
    label: edge.node.name,
    value: edge.node.id,
  }));
  cache.value = _.uniqBy([...cache.value, ...options.value], "value");
});

const onFilter: AppAutocompleteProps["onFilter"] = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = cache.value;
    });
  } else {
    update(() => {
      variables.value.where = {
        name: val,
      };
    });
  }
};
</script>

<template>
  <AppAutocomplete
    :label="label"
    :loading="loading"
    :options="options"
    :on-filter="onFilter"
    :on-change="onChange"
    :rules="rules"
    :initial-selected="initialSelected"
    outlined
  />
</template>

<style scoped></style>
