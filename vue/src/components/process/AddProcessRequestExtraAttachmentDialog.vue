<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  AddProcessRequestExtraAttachmentMutationResult,
  AddProcessRequestExtraAttachmentMutationVariables,
  ADD_PROCESS_REQUEST_EXTRA_ATTACHMENT_MUTATION,
} from "src/apollo/mutations";
import { ProcessRequestQueryResult } from "src/apollo/queries";
import { OnUpdateProcessRequestData } from "src/interfaces";
import { ref, reactive, computed } from "vue";

interface AddProcessRequestExtraAttachmentDialogProps {
  processRequest: NonNullable<ProcessRequestQueryResult["processRequest"]>;
}

const props = defineProps<AddProcessRequestExtraAttachmentDialogProps>();
const emit = defineEmits<{
  (e: "update-process-request", data: OnUpdateProcessRequestData): void;
}>();
const $q = useQuasar();
const open = ref(false);
const loading = ref(false);
const form = reactive<{ id: string; attachment: File | null }>({
  id: "",
  attachment: null,
});

const hasExtraAttachment = computed(() => {
  return !!props.processRequest.data.extra;
});
const dialogText = computed(() => {
  const text = {
    title: "Adicionar anexo extra ao pedido",
    btn: "Adicionar",
  };
  if (hasExtraAttachment.value) {
    text.title = "Substituir anexo extra do pedido";
    text.btn = "Substituir";
  }
  return text;
});

function openDialog() {
  open.value = true;
}

async function addProcessRequestExtraAttachment() {
  if (!form.attachment) return;
  const { mutate } = useMutation<
    AddProcessRequestExtraAttachmentMutationResult,
    AddProcessRequestExtraAttachmentMutationVariables
  >(ADD_PROCESS_REQUEST_EXTRA_ATTACHMENT_MUTATION, {
    variables: { id: props.processRequest.id, attachment: form.attachment },
  });

  try {
    loading.value = true;
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error adding process request extra attachment");
    }
    $q.notify({
      position: "top",
      color: "positive",
      message: "Anexo extra adicionado ao pedido com sucesso!",
      icon: "check",
    });
    emit(
      "update-process-request",
      response.data.addProcessRequestExtraAttachment
    );
    open.value = false;
  } catch (err) {
    if (err instanceof Error) {
      $q.notify({
        position: "top",
        color: "negative",
        message:
          "Não foi possível adicionar o anexo ao pedido. Tente novamente.",
        icon: "report_problem",
      });
    }
    throw err;
  } finally {
    loading.value = false;
  }
}

async function handleConfirm() {
  if (hasExtraAttachment.value) {
    $q.dialog({
      title: "Confirmação",
      message: "Deseja substituir anexo extra do pedido?",
      ok: { label: "Ok" },
      cancel: { flat: true, label: "Cancelar" },
      persistent: true,
    }).onOk(async () => {
      await addProcessRequestExtraAttachment();
    });
  } else {
    await addProcessRequestExtraAttachment();
  }
}
</script>

<template>
  <slot name="activator" :open="openDialog"></slot>
  <q-dialog v-model="open" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 q-mr-md">{{ dialogText.title }}</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>
      <q-card-section>
        <q-file v-model="form.attachment" label="Anexo" accept=".pdf">
          <template #prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup label="Cancelar" />
        <q-btn
          color="primary"
          :label="dialogText.btn"
          :loading="loading"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
