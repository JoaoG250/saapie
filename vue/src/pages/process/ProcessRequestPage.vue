<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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

interface Data {
  [key: string]: any;
}
interface Files {
  [key: string]: string[];
}

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
  const data: { data: Data; files: Files } = {
    data: {},
    files: {},
  };
  if (!processRequest.value) return data;
  const requestData = processRequest.value.data;
  for (const key in requestData) {
    const value = requestData[key];
    if (Array.isArray(value) && value.length) {
      for (const item of value) {
        if (typeof item !== "object") continue;
        if (!data.files[key]) {
          data.files[key] = [];
        }
        data.files[key].push(item.name);
      }
    }
    data.data[key] = {
      value: value,
    };
  }
  return data;
});
const hasAttachments = computed(() => {
  const data = formData.value;
  for (const key in data.files) {
    if (data.files[key].length) return true;
  }
  return false;
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
    setTimeout(() => {
      editing.value = false;
    }, 100);
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

function downloadFile(url: string) {
  const filename = url.split("/").pop();
  if (!filename) return;
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
        <FormKitSchema :data="formData.data" :schema="schema" />
      </FormKit>

      <template v-if="hasAttachments">
        <div class="text-h4 text-center text-weight-bold q-my-lg">Anexos</div>
        <q-separator class="q-mb-md" inset />
        <div class="row">
          <div
            v-for="(urls, field) in formData.files"
            :key="field"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6 text-center">
                  {{ field.toString().toUpperCase() }}
                </div>
              </q-card-section>
              <q-list>
                <q-item v-for="(url, index) in urls" :key="index">
                  <q-item-section avatar>
                    <q-icon name="description" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Anexo {{ index + 1 }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="q-gutter-xs">
                      <q-btn
                        :href="url"
                        target="_blank"
                        icon="visibility"
                        flat
                        dense
                        round
                      />
                      <q-btn
                        icon="file_download"
                        flat
                        dense
                        round
                        @click="downloadFile(url)"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </template>
    </template>
  </q-page>
</template>

<style lang="scss" scoped>
.container :deep(.formkit-form) {
  --fk-max-width-input: 100%;
}
</style>
