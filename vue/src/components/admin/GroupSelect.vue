<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  GroupsQueryResult,
  GroupsQueryVariables,
  GROUPS_QUERY,
} from "src/apollo/queries";
import { ref } from "vue";
import { SelectOption } from "src/interfaces";
import AppAutocomplete, {
  AppAutocompleteProps,
} from "components/AppAutocomplete.vue";

export interface GroupSelectProps {
  label: string;
  onChange: (option: SelectOption | null | undefined) => void;
  rules?: AppAutocompleteProps["rules"];
}

defineProps<GroupSelectProps>();
const options = ref<SelectOption[]>([]);
const cache = ref<SelectOption[]>([]);
const variables = ref<GroupsQueryVariables>({
  first: 5,
});
const { onResult, loading } = useQuery<GroupsQueryResult, GroupsQueryVariables>(
  GROUPS_QUERY,
  variables,
  { fetchPolicy: "network-only" }
);

onResult((result) => {
  options.value = result.data.groups.edges.map((edge) => ({
    label: edge.node.name,
    value: edge.node.id,
  }));
  cache.value = [...new Set([...cache.value, ...options.value])];
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
  />
</template>

<style scoped></style>
