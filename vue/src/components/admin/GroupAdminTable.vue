<script setup lang="ts">
import { QTableProps } from "quasar";
import { Group } from "src/interfaces";
import { useCrudAdminTable } from "src/composables";
import { groupRules } from "src/validation/group";
import { useGroupStore } from "stores/group";

const itemName = "Grupo";
const defaultItem: Group = {
  id: "",
  name: "",
};
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

const groupStore = useGroupStore();
const {
  dialogOpen,
  editedItem,
  itemNameLowerCase,
  formTitle,
  onRequest,
  openDialog,
  closeDialog,
  editItem,
  deleteItem,
  save,
} = useCrudAdminTable<Group>({
  itemName,
  defaultItem: defaultItem,
  store: groupStore,
});
</script>

<template>
  <div class="q-pa-md">
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 400px">
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
              :rules="groupRules.name"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn label="Cancelar" @click="closeDialog" />
            <q-btn
              :loading="groupStore.loading"
              color="primary"
              label="Salvar"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-table
      v-model:pagination="groupStore.state.pagination"
      :loading="groupStore.loading"
      :rows="groupStore.state.items"
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
  </div>
</template>

<style scoped></style>
