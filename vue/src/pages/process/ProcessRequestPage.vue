<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestQueryResult,
  ProcessRequestQueryVariables,
  PROCESS_REQUEST_QUERY,
} from "src/apollo/queries";
import { FormKitSchema } from "@formkit/vue";
import { FormKitData, ProcessRequestWithProcessAndUser } from "src/interfaces";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { FormKitSchemaNode } from "@formkit/core";
import { getFilesFromFormKitData } from "src/common/forms";
import {
  UpdateProcessRequestMutationResult,
  UpdateProcessRequestMutationVariables,
  UPDATE_PROCESS_REQUEST_MUTATION,
} from "src/apollo/mutations";
import { useQuasar } from "quasar";

const route = useRoute();
const $q = useQuasar();
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

async function submitHandler(data: FormKitData) {
  if (!processRequest.value) return;
  const attachments = getFilesFromFormKitData(data, true);
  const { mutate } = useMutation<
    UpdateProcessRequestMutationResult,
    UpdateProcessRequestMutationVariables
  >(UPDATE_PROCESS_REQUEST_MUTATION, {
    variables: { id: processRequest.value.id, data, attachments },
  });

  try {
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error updating process request");
    }
    processRequest.value = {
      ...processRequest.value,
      ...response.data.updateProcessRequest,
    };
    $q.notify({
      position: "top",
      color: "positive",
      message: "Pedido de abertura de processo atualizado com sucesso!",
      icon: "check",
    });
  } catch (err) {
    if (err instanceof Error) {
      $q.notify({
        position: "top",
        color: "negative",
        message: err.message,
        icon: "report_problem",
      });
    }
    throw err;
  }
}
</script>

<template>
  <q-page class="container">
    <template v-if="processRequest">
      <div class="text-h4 text-weight-bold q-my-md">
        {{ processRequest.process.name }}
      </div>
      <div class="row">
        <q-space />
        <q-toggle
          v-model="editing"
          label="Ativar edição"
          left-label
          :disable="processRequest.status === 'CLOSED'"
        />
      </div>
      <FormKit
        type="form"
        submit-label="Salvar"
        :actions="editing"
        :disabled="!editing"
        @submit="submitHandler"
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
