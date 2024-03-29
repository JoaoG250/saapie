<script setup lang="ts">
import { QTableProps } from "quasar";
import { ProcessRequest } from "src/interfaces";
import { useCrudAdminTable } from "src/composables";
import { useProcessRequestStore } from "src/stores/process-request";

const itemName = "Pedido de abertura de processo";
const defaultItem: ProcessRequest = {
  id: "",
  status: "OPEN",
  process: {
    id: "",
    name: "",
    slug: "",
  },
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  },
  data: {},
};
const columns: NonNullable<QTableProps["columns"]> = [
  {
    name: "user",
    label: "Usuário",
    field: (row: ProcessRequest) => row.user.email,
    align: "left",
    sortable: true,
  },
  {
    name: "process",
    label: "Processo",
    field: (row: ProcessRequest) => row.process.name,
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center",
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

const processRequestStore = useProcessRequestStore();
const {
  dialogOpen,
  itemNameLowerCase,
  formTitle,
  onRequest,
  openDialog,
  closeDialog,
  deleteItem,
  save,
} = useCrudAdminTable<ProcessRequest>({
  itemName,
  defaultItem: defaultItem,
  store: processRequestStore,
});
</script>

<template>
  <q-dialog v-model="dialogOpen" maximized persistent>
    <q-card>
      <q-form @submit="save">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-mr-md">{{ formTitle }}</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </q-card-section>
        <q-card-section> </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="closeDialog" />
          <q-btn
            :loading="processRequestStore.loading"
            color="primary"
            label="Salvar"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-table
    v-model:pagination="processRequestStore.state.pagination"
    :loading="processRequestStore.loading"
    :rows="processRequestStore.state.items"
    :columns="columns"
    :no-data-label="`Nenhum ${itemNameLowerCase} encontrado`"
    loading-label="Carregando..."
    row-key="name"
    @request="onRequest"
  >
    <template #top>
      <div class="q-table__title">{{ itemName }}</div>
      <q-space />
      <q-btn
        v-if="false"
        :label="`Novo ${itemNameLowerCase}`"
        icon="add"
        color="primary"
        @click="openDialog"
      />
    </template>
    <template #body-cell-actions="slotItem">
      <q-td :props="slotItem">
        <q-btn
          class="q-ml-sm"
          round
          icon="delete"
          size="xs"
          @click="deleteItem(slotItem.row)"
        />
      </q-td>
    </template>
    <template #pagination="scope">
      <q-btn
        icon="chevron_left"
        color="grey-8"
        round
        dense
        flat
        :disable="scope.isFirstPage"
        @click="scope.prevPage"
      />
      <q-btn
        icon="chevron_right"
        color="grey-8"
        round
        dense
        flat
        :disable="scope.isLastPage"
        @click="scope.nextPage"
      />
    </template>
  </q-table>
</template>

<style scoped></style>
