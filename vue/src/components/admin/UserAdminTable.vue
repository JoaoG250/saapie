<script setup lang="ts">
import { QTableProps } from "quasar";
import {
  CreateUserMutationVariables,
  DeleteUserMutationVariables,
  UpdateUserMutationVariables,
} from "src/apollo/mutations";
import { UsersQueryVariables } from "src/apollo/queries";
import { User, PageInfo } from "src/interfaces";
import { computed, ref } from "vue";
import { useCrudAdminTable } from "src/composables";
import { userRules } from "src/validation/user";

export interface UserAdminTableProps {
  itemName: string;
  defaultItem: User;
  columns: NonNullable<QTableProps["columns"]>;
  crud: {
    list: (
      args: UsersQueryVariables
    ) => Promise<{ items: User[]; pageInfo: PageInfo }>;
    create?: (args: CreateUserMutationVariables) => Promise<User>;
    update?: (args: UpdateUserMutationVariables) => Promise<User>;
    delete?: (args: DeleteUserMutationVariables) => Promise<User>;
  };
  itemsPerPage: number;
}

const props = defineProps<UserAdminTableProps>();
const extraCreateData = ref({
  password: "",
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
} = useCrudAdminTable<User>({
  itemName: props.itemName,
  defaultItem: props.defaultItem,
  crud: props.crud,
  itemsPerPage: props.itemsPerPage,
  extraCreateData,
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
              v-model="editedItem.firstName"
              label="Nome"
              :rules="userRules.firstName"
            />
            <q-input
              v-model="editedItem.lastName"
              label="Sobrenome"
              :rules="userRules.lastName"
            />
            <q-input
              v-model="editedItem.email"
              label="Email"
              :rules="userRules.email"
            />
            <q-input
              v-if="editedIndex === -1"
              v-model="extraCreateData.password"
              label="Senha"
              type="password"
              :rules="userRules.password"
            />
            <div class="q-mt-sm">
              <q-checkbox
                v-model="editedItem.isActive"
                class="q-mr-sm"
                label="Ativo"
              />
              <q-checkbox v-model="editedItem.isVerified" label="Verificado" />
            </div>
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
