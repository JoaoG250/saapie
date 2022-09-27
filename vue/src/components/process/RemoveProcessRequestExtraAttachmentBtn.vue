<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  RemoveProcessRequestExtraAttachmentMutationResult,
  RemoveProcessRequestExtraAttachmentMutationVariables,
  REMOVE_PROCESS_REQUEST_EXTRA_ATTACHMENT_MUTATION,
} from "src/apollo/mutations";
import { ProcessRequestQueryResult } from "src/apollo/queries";
import { OnUpdateProcessRequestData } from "src/interfaces";
import { ref } from "vue";

interface RemoveProcessRequestExtraAttachmentBtnProps {
  processRequest: NonNullable<ProcessRequestQueryResult["processRequest"]>;
}

const $q = useQuasar();
const props = defineProps<RemoveProcessRequestExtraAttachmentBtnProps>();
const emit = defineEmits<{
  (e: "update-process-request", data: OnUpdateProcessRequestData): void;
}>();
const loading = ref(false);

async function removeProcessRequestExtraAttachment() {
  const { mutate } = useMutation<
    RemoveProcessRequestExtraAttachmentMutationResult,
    RemoveProcessRequestExtraAttachmentMutationVariables
  >(REMOVE_PROCESS_REQUEST_EXTRA_ATTACHMENT_MUTATION, {
    variables: { id: props.processRequest.id },
  });

  try {
    loading.value = true;
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error removing process request extra attachment");
    }
    $q.notify({
      position: "top",
      color: "positive",
      message: "Anexo extra removido do pedido com sucesso!",
      icon: "check",
    });
    emit(
      "update-process-request",
      response.data.removeProcessRequestExtraAttachment
    );
  } catch (err) {
    if (err instanceof Error) {
      $q.notify({
        position: "top",
        color: "negative",
        message: "Não foi possível remover o anexo do pedido. Tente novamente.",
        icon: "report_problem",
      });
    }
    throw err;
  } finally {
    loading.value = false;
  }
}

async function handleClick() {
  $q.dialog({
    title: "Confirmação",
    message: "Deseja remover o anexo extra do pedido?",
    ok: { label: "Ok" },
    cancel: { flat: true, label: "Cancelar" },
    persistent: true,
  }).onOk(async () => {
    await removeProcessRequestExtraAttachment();
  });
}
</script>

<template>
  <q-fab-action
    :loading="loading"
    color="negative"
    icon="delete"
    label="Remover anexo"
    @click="handleClick"
  />
</template>

<style scoped></style>
