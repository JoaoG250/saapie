<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  AddProcessToCategoryMutationResult,
  AddProcessToCategoryMutationVariables,
  ADD_PROCESS_TO_CATEGORY_MUTATION,
} from "src/apollo/mutations";
import { ProcessCategory } from "src/interfaces";
import { ref } from "vue";
import ProcessSelect, { ProcessSelectProps } from "./ProcessSelect.vue";
import { ProcessCategoryProcessesQueryNode } from "src/apollo/queries";

interface AddProcessToCategoryDialogProps {
  processCategory: ProcessCategory;
}

const props = defineProps<AddProcessToCategoryDialogProps>();
const emit = defineEmits<{ (e: "add-process"): void }>();
const $q = useQuasar();
const process =
  ref<Omit<ProcessCategoryProcessesQueryNode, "slug" | "description">>();
const open = ref(false);
const loading = ref(false);
const setProcess: ProcessSelectProps["onChange"] = (option) => {
  if (option) {
    process.value = {
      id: option.value,
      name: option.label,
    };
  } else {
    process.value = undefined;
  }
};

function openDialog() {
  open.value = true;
}

async function addProcessToCategory() {
  if (!process.value) return;
  const { mutate } = useMutation<
    AddProcessToCategoryMutationResult,
    AddProcessToCategoryMutationVariables
  >(ADD_PROCESS_TO_CATEGORY_MUTATION, {
    variables: {
      processCategoryId: props.processCategory.id,
      processId: process.value.id,
    },
  });

  try {
    loading.value = true;
    await mutate();
    $q.notify({
      position: "top",
      color: "positive",
      message: "Processo adicionado a categoria com sucesso!",
      icon: "check",
    });
    emit("add-process");
    open.value = false;
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
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <slot name="activator" :open="openDialog" :loading="loading"></slot>
  <q-dialog v-model="open" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 q-mr-md">Adicionar processo a categoria</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>
      <q-card-section>
        <ProcessSelect label="Processo" :on-change="setProcess" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup label="Cancelar" />
        <q-btn
          color="primary"
          label="Adicionar"
          @click="addProcessToCategory"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
