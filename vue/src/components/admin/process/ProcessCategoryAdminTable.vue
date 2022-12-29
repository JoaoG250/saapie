<script setup lang="ts">
import { ref } from "vue";
import { QTableProps } from "quasar";
import { ProcessCategory } from "src/interfaces";
import { useCrudAdminTable } from "src/composables";
import { useProcessCategoryStore } from "src/stores/process-category";
import { processCategoryRules } from "src/validation/process";
import EditProcessCategories from "./EditProcessCategories.vue";

const itemName = "Categoria de processo";
const defaultItem: ProcessCategory = {
  id: "",
  name: "",
  slug: "",
};
const columns: NonNullable<QTableProps["columns"]> = [
  {
    name: "name",
    label: "Nome",
    field: (row: ProcessCategory) => row.name,
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

const editProcesses = ref(false);
const processCategoryStore = useProcessCategoryStore();
const {
  dialogOpen,
  editedItem,
  editedIndex,
  itemNameLowerCase,
  formTitle,
  onRequest,
  openDialog,
  closeDialog,
  editItem,
  deleteItem,
  save,
} = useCrudAdminTable<ProcessCategory>({
  itemName,
  defaultItem: defaultItem,
  store: processCategoryStore,
  omitOnCreate: ["slug"],
  omitOnUpdate: ["slug"],
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
        <q-card-section>
          <q-input
            v-model="editedItem.name"
            label="Nome"
            :rules="processCategoryRules.name"
          />
          <q-btn
            v-if="editedIndex > -1"
            class="q-my-sm full-width"
            color="secondary"
            label="Editar processos"
            @click="editProcesses = !editProcesses"
          />
          <EditProcessCategories
            v-if="editedIndex > -1 && editProcesses"
            :process-category="editedItem"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="closeDialog" />
          <q-btn
            :loading="processCategoryStore.loading"
            color="primary"
            label="Salvar"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-table
    v-model:pagination="processCategoryStore.state.pagination"
    :loading="processCategoryStore.loading"
    :rows="processCategoryStore.state.items"
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
        :label="`Novo ${itemNameLowerCase}`"
        icon="add"
        color="primary"
        @click="openDialog"
      />
    </template>
    <template #body-cell-actions="slotItem">
      <q-td :props="slotItem">
        <q-btn round icon="edit" size="xs" @click="editItem(slotItem.row)" />
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
