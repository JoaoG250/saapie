<script setup lang="ts">
import UserAdminTable from "components/admin/UserAdminTable.vue";
import { QTableProps } from "quasar";
import { PageInfo, PaginationArgs, User } from "src/interfaces";

const defaultItem: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  isActive: false,
  isVerified: false,
};
const columns: QTableProps["columns"] = [
  {
    name: "firstName",
    label: "Nome",
    field: "firstName",
    sortable: true,
  },
  {
    name: "lastName",
    label: "Sobrenome",
    field: "lastName",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true,
  },
  {
    name: "isActive",
    label: "Ativo",
    field: "isActive",
    sortable: true,
  },
  {
    name: "isVerified",
    label: "Verificado",
    field: "isVerified",
    sortable: true,
  },
  {
    name: "actions",
    label: "Ações",
    field: () => {
      return;
    },
  },
];

const crud = {
  async list(
    args: PaginationArgs
  ): Promise<{ items: User[]; pageInfo: PageInfo }> {
    return {
      items: [],
      pageInfo: {
        startCursor: "",
        endCursor: "",
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },
  async delete(args: { id: string }): Promise<User> {
    return {
      ...defaultItem,
    };
  },
  async update(args: { id: string; data: User }): Promise<User> {
    return {
      ...defaultItem,
    };
  },
};
</script>

<template>
  <q-page class="row">
    <UserAdminTable
      :default-item="defaultItem"
      :columns="columns"
      :items-per-page="10"
      :crud="crud"
    />
  </q-page>
</template>

<style scoped></style>
