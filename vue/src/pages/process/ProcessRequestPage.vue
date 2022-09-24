<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestQueryResult,
  ProcessRequestQueryVariables,
  PROCESS_REQUEST_QUERY,
} from "src/apollo/queries";
import { FormKitSchema } from "@formkit/vue";
import { FormKitData, OnUpdateProcessRequestData } from "src/interfaces";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FormKitSchemaNode } from "@formkit/core";
import { getFilesFromFormKitData } from "src/common/forms";
import {
  UpdateProcessRequestMutationResult,
  UpdateProcessRequestMutationVariables,
  UPDATE_PROCESS_REQUEST_MUTATION,
} from "src/apollo/mutations";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { formatStatus } from "src/common/format";
import ProcessRequestAttachmentList from "src/components/process/ProcessRequestAttachmentList.vue";
import ProcessRequestActions from "src/components/process/ProcessRequestActions.vue";
import ProcessRequestInfo from "src/components/process/ProcessRequestInfo.vue";

interface Data {
  [key: string]: any;
}
interface Files {
  [key: string]: string[];
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const processRequest = ref<ProcessRequestQueryResult["processRequest"]>();
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
  if (result.data.processRequest) {
    processRequest.value = result.data.processRequest;
    document.title = `Pedido para ${processRequest.value.process.name} - SAAPIE`;
  } else {
    router.push({ name: "not-found" });
  }
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
const allowEdit = computed(() => {
  if (!authStore.state.user || !processRequest.value) return false;
  if (processRequest.value.user.id === authStore.state.user.id) return true;
  return false;
});
const schema = computed<FormKitSchemaNode[]>(() => {
  if (processRequest.value) {
    return processRequest.value.process.form.definition as FormKitSchemaNode[];
  }
  return [];
});
const statusChipProps = computed(() => {
  const defaultValue = { color: undefined, icon: undefined };
  if (!processRequest.value) return defaultValue;
  switch (processRequest.value.status) {
    case "OPEN":
      return { color: "yellow-8", icon: "pending" };
    case "CLOSED":
      return { color: "positive", icon: "check" };
    case "FORWARDED":
      return { color: "light-blue-9", icon: "forward" };
    case "PENDING_CHANGE":
      return { color: "red-7", icon: "warning" };
    default:
      return defaultValue;
  }
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
        message:
          "Não foi possível atualizar o pedido de abertura de processo. Tente novamente.",
        icon: "report_problem",
      });
    }
    throw err;
  }
}

function onUpdateProcessRequest(data: OnUpdateProcessRequestData) {
  if (!processRequest.value) return;
  processRequest.value = { ...processRequest.value, ...data };
}
</script>

<template>
  <q-page class="container">
    <template v-if="processRequest">
      <div class="text-h4 text-center q-my-md page-heading process-name">
        {{ processRequest.process.name.toUpperCase() }}
      </div>
      <q-separator class="q-mb-sm" inset />
      <ProcessRequestInfo :process-request="processRequest" />
      <div class="row items-center q-mb-sm">
        <div>
          <span class="text-weight-bold">Situação:</span>
          <q-chip
            text-color="white"
            :label="formatStatus(processRequest.status)"
            :color="statusChipProps.color"
            :icon-right="statusChipProps.icon"
            flat
          />
        </div>
        <q-space />
        <q-toggle
          v-if="allowEdit"
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
        <div class="text-h4 text-center page-heading q-my-lg">Anexos</div>
        <q-separator class="q-mb-md" inset />
        <ProcessRequestAttachmentList :files="formData.files" />
      </template>

      <ProcessRequestActions
        :process-request="processRequest"
        @update-process-request="onUpdateProcessRequest"
      />
    </template>
  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/mixins";
.container :deep(.formkit-form) {
  --fk-max-width-input: 100%;
  --fk-bg-submit: #1976d2;
  --fk-color-submit: white;
  --fk-bg-submit-hover: #3988d6;
}
@include screen(xs) {
  .process-name {
    font-size: 1.6rem;
  }
}
</style>
