<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  UpdateProcessRequestStatusMutationResult,
  UpdateProcessRequestStatusMutationVariables,
  UPDATE_PROCESS_REQUEST_STATUS_MUTATION,
} from "src/apollo/mutations";
import { ProcessRequestQueryResult } from "src/apollo/queries";
import { ProcessRequestStatus } from "src/interfaces";

interface ProcessRequestActionsProps {
  processRequest: ProcessRequestQueryResult["processRequest"];
}

const props = defineProps<ProcessRequestActionsProps>();
const $q = useQuasar();

const emit = defineEmits<{
  (e: "update-status", status: ProcessRequestStatus): void;
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
      emit("update-status", response.data.updateProcessRequestStatus.status);
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
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
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

<style scoped></style>
