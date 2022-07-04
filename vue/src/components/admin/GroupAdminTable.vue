<script setup lang="ts">
import { QTableProps } from "quasar";
import {
  CreateGroupMutationVariables,
  DeleteGroupMutationVariables,
  UpdateGroupMutationVariables,
} from "src/apollo/mutations";
import { GroupsQueryVariables } from "src/apollo/queries";
import { PageInfo, Group } from "src/interfaces";
import { computed } from "vue";
import { useCrudAdminTable } from "src/composables";
import { groupRules } from "src/validation/group";

export interface GroupAdminTableProps {
  itemName: string;
  defaultItem: Group;
  columns: NonNullable<QTableProps["columns"]>;
  crud: {
    list: (
      args: GroupsQueryVariables
    ) => Promise<{ items: Group[]; pageInfo: PageInfo }>;
    create?: (args: CreateGroupMutationVariables) => Promise<Group>;
    update?: (args: UpdateGroupMutationVariables) => Promise<Group>;
    delete?: (args: DeleteGroupMutationVariables) => Promise<Group>;
  };
  itemsPerPage: number;
}

const props = defineProps<GroupAdminTableProps>();
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
} = useCrudAdminTable<Group>({
  itemName: props.itemName,
  defaultItem: props.defaultItem,
  crud: props.crud,
  itemsPerPage: props.itemsPerPage,
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
            <q-btn color="primary" label="Salvar" type="submit" />
          </q-card-actions>
        </q-form>
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
