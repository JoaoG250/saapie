<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import { Process, ProcessCategory } from "src/interfaces";
import {
  ProcessCategoryProcessesQueryNode,
  ProcessCategoryProcessesQueryResult,
  ProcessCategoryProcessesQueryVariables,
  PROCESS_CATEGORY_PROCESSES_QUERY,
} from "src/apollo/queries";
import { ref } from "vue";
import { QTableProps, useQuasar } from "quasar";
import {
  RemoveProcessFromCategoryMutationResult,
  RemoveProcessFromCategoryMutationVariables,
  REMOVE_PROCESS_FROM_CATEGORY_MUTATION,
} from "src/apollo/mutations";
import AddProcessToCategoryDialog from "./AddProcessToCategoryDialog.vue";

interface EditProcessCategoryProcessesProps {
  processCategory: ProcessCategory;
}

const props = defineProps<EditProcessCategoryProcessesProps>();
const $q = useQuasar();
const processes = ref<ProcessCategoryProcessesQueryNode[]>([]);
const columns: NonNullable<QTableProps["columns"]> = [
  {
    name: "name",
    label: "Nome",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "actions",
    label: "Ações",
    align: "right",
    field: () => {
      return;
    },
  },
];
const { onResult, loading, refetch } = useQuery<
  ProcessCategoryProcessesQueryResult,
  ProcessCategoryProcessesQueryVariables
>(
  PROCESS_CATEGORY_PROCESSES_QUERY,
  { id: props.processCategory.id },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  processes.value = result.data.processCategory.processes;
});

function onAddProcess() {
  refetch();
}

async function removeProcessFromCategory(process: Process) {
  const { mutate } = useMutation<
    RemoveProcessFromCategoryMutationResult,
    RemoveProcessFromCategoryMutationVariables
  >(REMOVE_PROCESS_FROM_CATEGORY_MUTATION, {
    variables: {
      processId: process.id,
      processCategoryId: props.processCategory.id,
    },
  });
  $q.dialog({
    title: "Confirmação",
    message: "Deseja realmente remover o processo da categoria?",
    ok: { label: "Ok" },
    cancel: { flat: true, label: "Cancelar" },
    persistent: true,
  }).onOk(async () => {
    try {
      await mutate();
      $q.notify({
        position: "top",
        color: "positive",
        message: "Processo removido da categoria com sucesso!",
        icon: "check",
      });
      processes.value = processes.value.filter((p) => p.id !== process.id);
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
</script>

<template>
  <AddProcessToCategoryDialog
    :process-category="props.processCategory"
    @add-process="onAddProcess"
  >
    <template #activator="{ open, loading: addProcessToCategoryLoading }">
      <q-btn
        :loading="addProcessToCategoryLoading"
        class="q-mb-sm full-width"
        color="primary"
        label="Adicionar processo"
        @click="open"
      />
    </template>
  </AddProcessToCategoryDialog>
  <q-table
    :loading="loading"
    :rows="processes"
    :columns="columns"
    loading-label="Carregando..."
    row-key="name"
    no-data-label="Nenhum processo encontrado"
  >
    <template #body-cell-actions="slotItem">
      <q-td :props="slotItem">
        <q-btn
          class="q-ml-sm"
          round
          icon="delete"
          size="xs"
          @click="removeProcessFromCategory(slotItem.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
