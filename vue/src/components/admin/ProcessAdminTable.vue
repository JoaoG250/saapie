<script setup lang="ts">
import { QTableProps } from "quasar";
import {
  CreateProcessMutationVariables,
  DeleteProcessMutationVariables,
  UpdateProcessMutationVariables,
} from "src/apollo/mutations";
import { ProcessesQueryVariables } from "src/apollo/queries";
import { PageInfo, Process } from "src/interfaces";
import { computed, ref, watch } from "vue";
import { useCrudAdminTable } from "src/composables";

export interface ProcessAdminTableProps {
  itemName: string;
  defaultItem: Process;
  columns: NonNullable<QTableProps["columns"]>;
  crud: {
    list: (
      args: ProcessesQueryVariables
    ) => Promise<{ items: Process[]; pageInfo: PageInfo }>;
    create?: (args: CreateProcessMutationVariables) => Promise<Process>;
    update?: (args: UpdateProcessMutationVariables) => Promise<Process>;
    delete?: (args: DeleteProcessMutationVariables) => Promise<Process>;
  };
  itemsPerPage: number;
}

const props = defineProps<ProcessAdminTableProps>();
const extraData = ref({
  form: {
    name: "",
    definition: "",
  },
});
const {
  dialogOpen,
  loading,
  items,
  editedIndex,
  editedItem,
  openDialog,
  closeDialog,
  editItem,
  deleteItem,
  save,
} = useCrudAdminTable<Process>({
  itemName: props.itemName,
  defaultItem: props.defaultItem,
  crud: props.crud,
  itemsPerPage: props.itemsPerPage,
  extraCreateData: extraData,
  extraUpdateData: extraData,
  stripFields: ["slug"],
});

watch(editedItem, (item) => {
  extraData.value.form = {
    name: item.form.name,
    definition: JSON.stringify(item.form.definition),
  };
});

const itemNameLowerCase = computed(() => props.itemName.toLowerCase());
const formTitle = computed(() => {
  return editedIndex.value === -1
    ? `Novo ${itemNameLowerCase.value}`
    : `Editar ${itemNameLowerCase.value}`;
});
const tableColumns = computed(() => {
  if (props.crud.update || props.crud.delete) {
    return props.columns;
  }
  return props.columns.filter((column) => column.name !== "actions");
});
</script>

<template>
  <div class="q-pa-md">
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-mr-md">{{ formTitle }}</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </q-card-section>
        <q-card-section>
          <q-input v-model="editedItem.name" label="Nome" />
          <q-input
            v-model="editedItem.description"
            label="Descrição"
            type="textarea"
          />
          <q-input v-model="editedItem.targetGroupId" label="Grupo alvo" />
          <q-input v-model="extraData.form.name" label="Nome do formulário" />
          <q-input
            v-model="extraData.form.definition"
            label="Definição do formulário"
            type="textarea"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="closeDialog" />
          <q-btn color="primary" label="Salvar" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      :loading="loading"
      :rows="items"
      :columns="tableColumns"
      row-key="name"
    >
      <template #top>
        <div class="q-table__title">{{ itemName }}</div>
        <q-space />
        <q-btn
          v-if="crud.create"
          :label="`Novo ${itemNameLowerCase}`"
          icon="add"
          color="primary"
          @click="openDialog"
        />
      </template>
      <template #body-cell-actions="slotItem">
        <q-td :props="slotItem">
          <q-btn
            v-if="crud.update"
            round
            icon="edit"
            size="xs"
            @click="editItem(slotItem.row)"
          />
          <q-btn
            v-if="crud.delete"
            class="q-ml-sm"
            round
            icon="delete"
            size="xs"
            @click="deleteItem(slotItem.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style scoped></style>
