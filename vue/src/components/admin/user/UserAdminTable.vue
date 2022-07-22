<script setup lang="ts">
import { QTableProps } from "quasar";
import { User } from "src/interfaces";
import { ref } from "vue";
import { useCrudAdminTable } from "src/composables";
import { userRules } from "src/validation/user";
import { useUserStore } from "src/stores/user";
import EditUserGroups from "./EditUserGroups.vue";

const itemName = "Usuário";
const defaultItem: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  isActive: false,
  isVerified: false,
};
const columns: NonNullable<QTableProps["columns"]> = [
  {
    name: "firstName",
    label: "Nome",
    field: "firstName",
    align: "left",
    sortable: true,
  },
  {
    name: "lastName",
    label: "Sobrenome",
    field: "lastName",
    align: "center",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    align: "center",
    sortable: true,
  },
  {
    name: "isActive",
    label: "Ativo",
    field: "isActive",
    align: "center",
    sortable: true,
  },
  {
    name: "isVerified",
    label: "Verificado",
    field: "isVerified",
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

const userStore = useUserStore();
const editGroups = ref(false);
const extraCreateData = ref({
  password: "",
});
const {
  dialogOpen,
  editedIndex,
  editedItem,
  itemNameLowerCase,
  formTitle,
  onRequest,
  openDialog,
  closeDialog,
  editItem,
  deleteItem,
  save,
} = useCrudAdminTable<User>({
  itemName,
  defaultItem: defaultItem,
  store: userStore,
  extraCreateData,
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
          <q-btn
            v-if="editedIndex > -1"
            class="q-my-sm full-width"
            color="secondary"
            label="Editar grupos"
            @click="editGroups = !editGroups"
          />
          <EditUserGroups v-if="editGroups" :user="editedItem" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="closeDialog" />
          <q-btn
            :loading="userStore.loading"
            color="primary"
            label="Salvar"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-table
    v-model:pagination="userStore.state.pagination"
    :loading="userStore.loading"
    :rows="userStore.state.items"
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
