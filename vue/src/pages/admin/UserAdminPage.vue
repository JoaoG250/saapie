<script setup lang="ts">
import UserAdminTable, {
  UserAdminTableProps,
} from "components/admin/UserAdminTable.vue";
import {
  UsersQueryResult,
  UsersQueryVariables,
  USERS_QUERY,
} from "src/apollo/queries";
import { useAsyncQuery } from "src/composables";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateUserMutationResult,
  CreateUserMutationVariables,
  CREATE_USER_MUTATION,
  UpdateUserMutationResult,
  UpdateUserMutationVariables,
  UPDATE_USER_MUTATION,
  DeleteUserMutationResult,
  DeleteUserMutationVariables,
  DELETE_USER_MUTATION,
} from "src/apollo/mutations";

const defaultItem: UserAdminTableProps["defaultItem"] = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  isActive: false,
  isVerified: false,
};
const columns: UserAdminTableProps["columns"] = [
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
const crud: UserAdminTableProps["crud"] = {
  async list(args: UsersQueryVariables) {
    const data = await useAsyncQuery<UsersQueryResult, UsersQueryVariables>(
      USERS_QUERY,
      { variables: args, fetchPolicy: "network-only" }
    );
    return {
      items: data.users.edges.map(({ node }) => node),
      pageInfo: data.users.pageInfo,
    };
  },
  async create(args: CreateUserMutationVariables) {
    const { mutate } = await useMutation<
      CreateUserMutationResult,
      CreateUserMutationVariables
    >(CREATE_USER_MUTATION, {
      variables: args,
    });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error creating user");
    }
    return response.data.createUser;
  },
  async update(args: UpdateUserMutationVariables) {
    const { mutate } = useMutation<
      UpdateUserMutationResult,
      UpdateUserMutationVariables
    >(UPDATE_USER_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error updating user");
    }
    return response.data.updateUser;
  },
  async delete(args: DeleteUserMutationVariables) {
    const { mutate } = useMutation<
      DeleteUserMutationResult,
      DeleteUserMutationVariables
    >(DELETE_USER_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error deleting user");
    }
    return response.data.deleteUser;
  },
};
</script>

<template>
  <q-page class="row">
    <UserAdminTable
      item-name="Usuário"
      :default-item="defaultItem"
      :columns="columns"
      :items-per-page="10"
      :crud="crud"
    />
  </q-page>
</template>

<style scoped></style>
