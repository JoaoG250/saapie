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
import { computed } from "vue";
import { userIsFromGroup } from "src/common/permissions";
import { useAuthStore } from "src/stores/auth";

interface ProcessRequestActionsProps {
  processRequest: ProcessRequestQueryResult["processRequest"];
}

const props = defineProps<ProcessRequestActionsProps>();
const $q = useQuasar();
const authStore = useAuthStore();

const showForwardBtn = computed(() => {
  if (!props.processRequest.process.forwardToGroup) {
    return false;
  }
  if (props.processRequest.status === "FORWARDED") {
    return false;
  }
  if (!authStore.state.user) {
    return false;
  }
  if (
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
  if (props.processRequest.status === "CLOSED") {
    return false;
  }
  if (!authStore.state.user) {
    return false;
  }
  if (
    props.processRequest.process.forwardToGroup &&
    props.processRequest.status !== "FORWARDED"
  ) {
    return false;
  }
  if (
    props.processRequest.process.forwardToGroup &&
    props.processRequest.status === "FORWARDED" &&
    !userIsFromGroup(
      authStore.state.user.groups,
      props.processRequest.process.forwardToGroup
    )
  ) {
    return false;
  }
  return true;
});

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
    <q-btn
      v-if="showForwardBtn"
      color="primary"
      icon="forward"
      label="Encaminhar"
      fab
      @click="forwardRequest"
    />
    <q-btn
      v-if="showCloseBtn"
      color="positive"
      icon="check"
      label="Finalizar"
      fab
      @click="closeRequest"
    />
  </q-page-sticky>
</template>

<style scoped></style>
