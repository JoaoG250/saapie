<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestQueryResult,
  ProcessRequestQueryVariables,
  PROCESS_REQUEST_QUERY,
} from "src/apollo/queries";
import { FormKitSchema } from "@formkit/vue";
import { ProcessRequestWithProcessAndUser } from "src/interfaces";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { FormKitSchemaNode } from "@formkit/core";

const route = useRoute();
const processRequest = ref<ProcessRequestWithProcessAndUser>();
const editing = ref(false);
const processId = computed<string>(() => {
  const id = route.params.id;
  if (typeof id === "string") {
    return id;
  } else {
    throw new Error("Invalid id");
  }
});
const { onResult } = useQuery<
  ProcessRequestQueryResult,
  ProcessRequestQueryVariables
>(
  PROCESS_REQUEST_QUERY,
  { id: processId.value },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  processRequest.value = result.data.processRequest;
});

const formData = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const computedData: { [key: string]: any } = {};
  if (processRequest.value) {
    const data = processRequest.value.data;
    if (typeof data === "object") {
      for (const key in data) {
        const value = data[key];
        if (
          Array.isArray(value) &&
          value.length &&
          typeof value[0] === "object"
        ) {
          computedData[key] = {
            value: value,
            help: "Visualizar o arquivo",
            "sections-schema": {
              help: {
                $el: "a",
                attrs: { href: value[0].name, target: "_blank" },
              },
            },
          };
        } else {
          computedData[key] = {
            value: value,
          };
        }
      }
    }
  }
  return computedData;
});

const schema = computed<FormKitSchemaNode[]>(() => {
  if (processRequest.value) {
    return processRequest.value.process.form.definition as FormKitSchemaNode[];
  }
  return [];
});
</script>

<template>
  <q-page class="container">
    <template v-if="processRequest">
      <div class="text-h4 text-weight-bold q-my-md">
        {{ processRequest.process.name }}
      </div>
      <div class="row">
        <q-space />
        <q-toggle v-model="editing" label="Ativar edição" left-label />
      </div>
      <FormKit
        type="form"
        submit-label="Salvar"
        :actions="editing"
        :disabled="!editing"
      >
        <FormKitSchema :data="formData" :schema="schema" />
      </FormKit>
    </template>
  </q-page>
</template>

<style lang="scss" scoped>
.container {
  --fk-max-width-input: 100%;
}
</style>
