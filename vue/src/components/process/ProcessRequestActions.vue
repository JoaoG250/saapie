<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  UpdateProcessRequestStatusMutationResult,
  UpdateProcessRequestStatusMutationVariables,
  UPDATE_PROCESS_REQUEST_STATUS_MUTATION,
} from "src/apollo/mutations";
import { ProcessRequestQueryResult } from "src/apollo/queries";
import {
  OnUpdateProcessRequestData,
  ProcessRequestStatus,
} from "src/interfaces";
import { computed } from "vue";
import { userIsFromGroup } from "src/common/permissions";
import { useAuthStore } from "src/stores/auth";
import AddProcessRequestExtraAttachmentDialog from "./AddProcessRequestExtraAttachmentDialog.vue";

interface ProcessRequestActionsProps {
  processRequest: NonNullable<ProcessRequestQueryResult["processRequest"]>;
}

const props = defineProps<ProcessRequestActionsProps>();
const $q = useQuasar();
const authStore = useAuthStore();

const showForwardBtn = computed(() => {
  if (!props.processRequest.process.forwardToGroup || !authStore.state.user) {
    return false;
  }
  if (
    props.processRequest.status === "CLOSED" ||
    props.processRequest.status === "FORWARDED"
  ) {
    return false;
  } else if (
    !userIsFromGroup(
      authStore.state.user.groups,
      props.processRequest.process.targetGroup
    )
  ) {
    return false;
  }
  return true;
});
const showCloseBtn = computed(() => {
  if (props.processRequest.status === "CLOSED" || !authStore.state.user) {
    return false;
  }
  if (props.processRequest.process.forwardToGroup) {
    if (props.processRequest.status !== "FORWARDED") {
      return false;
    } else if (
      !userIsFromGroup(
        authStore.state.user.groups,
        props.processRequest.process.forwardToGroup
      )
    ) {
      return false;
    }
  } else if (
    !userIsFromGroup(
      authStore.state.user.groups,
      props.processRequest.process.targetGroup
    )
  ) {
    return false;
  }
  return true;
});

const emit = defineEmits<{
  (e: "update-process-request", data: OnUpdateProcessRequestData): void;
}>();

function updateRequestStatus(
  status: ProcessRequestStatus,
  confirmMessage: string,
  successMessage: string
) {
  const { mutate } = useMutation<
    UpdateProcessRequestStatusMutationResult,
    UpdateProcessRequestStatusMutationVariables
  >(UPDATE_PROCESS_REQUEST_STATUS_MUTATION, {
    variables: { id: props.processRequest.id, status },
  });
  $q.dialog({
    title: "Confirmação",
    message: confirmMessage,
    ok: { label: "Ok" },
    cancel: { flat: true, label: "Cancelar" },
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error updating process request");
      }
      emit("update-process-request", {
        status: response.data.updateProcessRequestStatus.status,
      });
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
          message:
            "Não foi possível atualizar o pedido de abertura de processo. Tente novamente.",
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

function onUpdateProcessRequest(data: OnUpdateProcessRequestData) {
  emit("update-process-request", data);
}
</script>

<template>
  <q-page-sticky position="bottom-right" :offset="[30, 18]">
    <q-fab
      v-if="showForwardBtn || showCloseBtn"
      label="Ações"
      label-position="right"
      color="secondary"
      icon="keyboard_arrow_up"
      direction="up"
    >
      <q-fab-action
        v-if="showForwardBtn"
        color="primary"
        icon="forward"
        label="Encaminhar"
        @click="forwardRequest"
      />
      <q-fab-action
        v-if="showCloseBtn"
        color="positive"
        icon="check"
        label="Finalizar"
        @click="closeRequest"
      />
      <AddProcessRequestExtraAttachmentDialog
        :process-request="processRequest"
        @update-process-request="onUpdateProcessRequest"
      >
        <template #activator="{ open }">
          <q-fab-action
            color="amber"
            icon="attach_file"
            label="Adicionar anexo"
            @click="open"
          />
        </template>
      </AddProcessRequestExtraAttachmentDialog>
    </q-fab>
  </q-page-sticky>
</template>

<style scoped></style>
