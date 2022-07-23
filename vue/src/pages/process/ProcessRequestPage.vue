<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  ProcessRequestQueryResult,
  ProcessRequestQueryVariables,
  PROCESS_REQUEST_QUERY,
} from "src/apollo/queries";
import { FormKitSchema } from "@formkit/vue";
import { FormKitData, ProcessRequestStatus } from "src/interfaces";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { FormKitSchemaNode } from "@formkit/core";
import { getFilesFromFormKitData } from "src/common/forms";
import {
  UpdateProcessRequestMutationResult,
  UpdateProcessRequestMutationVariables,
  UpdateProcessRequestStatusMutationResult,
  UpdateProcessRequestStatusMutationVariables,
  UPDATE_PROCESS_REQUEST_MUTATION,
  UPDATE_PROCESS_REQUEST_STATUS_MUTATION,
} from "src/apollo/mutations";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import ProcessRequestAttachmentList from "src/components/process/ProcessRequestAttachmentList.vue";

interface Data {
  [key: string]: any;
}
interface Files {
  [key: string]: string[];
}

const route = useRoute();
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
const allowEdit = computed(() => {
  if (!authStore.state.user || !processRequest.value) return false;
  if (processRequest.value.user.id === authStore.state.user.id) return true;
  return false;
});
const showFab = computed(() => {
  if (!authStore.state.user) return false;
  if (!processRequest.value) return false;
  if (
    processRequest.value.status !== "CLOSED" &&
    authStore.state.user.groups.length
  ) {
    return true;
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

function updateRequestStatus(
  status: ProcessRequestStatus,
  confirmMessage: string,
  successMessage: string
) {
  if (!processRequest.value) return;
  const { mutate } = useMutation<
    UpdateProcessRequestStatusMutationResult,
    UpdateProcessRequestStatusMutationVariables
  >(UPDATE_PROCESS_REQUEST_STATUS_MUTATION, {
    variables: { id: processRequest.value.id, status },
  });
  $q.dialog({
    title: "Confirmação",
    message: confirmMessage,
    ok: { label: "Ok" },
    cancel: { flat: true, label: "Cancelar" },
    persistent: true,
  }).onOk(async () => {
    try {
      if (!processRequest.value) return;
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error updating process request");
      }
      processRequest.value = {
        ...processRequest.value,
        ...response.data.updateProcessRequestStatus,
      };
      $q.notify({
        position: "top",
        color: "positive",
        message: successMessage,
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
  });
}

function closeRequest() {
  updateRequestStatus(
    "CLOSED",
    "Deseja marcar o pedido de abertura de processo como iniciado?",
    "Pedido de abertura de processo marcado como iniciado!"
  );
}

function forwardRequest() {
  updateRequestStatus(
    "FORWARDED",
    "Deseja encaminhar o pedido de abertura de processo?",
    "Pedido de abertura de processo encaminhado!"
  );
}
</script>

<template>
  <q-page class="container">
    <template v-if="processRequest">
      <div class="text-h4 text-weight-bold text-center q-my-md">
        {{ processRequest.process.name }}
      </div>
      <q-separator class="q-mb-md" inset />
      <div class="row">
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
        <div class="text-h4 text-center text-weight-bold q-my-lg">Anexos</div>
        <q-separator class="q-mb-md" inset />
        <ProcessRequestAttachmentList :files="formData.files" />
      </template>

      <q-page-sticky v-if="showFab" position="bottom-right" :offset="[18, 18]">
        <q-fab
          label="Opções"
          color="secondary"
          icon="keyboard_arrow_down"
          direction="up"
        >
          <q-fab-action
            v-if="processRequest.process.forwardToGroup"
            color="primary"
            icon="forward"
            label="Encaminhar"
            @click="forwardRequest"
          />
          <q-fab-action
            color="positive"
            icon="check"
            label="Finalizar"
            @click="closeRequest"
          />
        </q-fab>
      </q-page-sticky>
    </template>
  </q-page>
</template>

<style lang="scss" scoped>
.container :deep(.formkit-form) {
  --fk-max-width-input: 100%;
}
</style>
