<script setup lang="ts">
import {
  GroupsQueryResult,
  GroupsQueryVariables,
  GROUPS_QUERY,
} from "src/apollo/queries";
import { GroupAdminTableProps } from "src/components/admin/GroupAdminTable.vue";
import GroupAdminTable from "src/components/admin/GroupAdminTable.vue";
import { useAsyncQuery } from "src/composables";
import {
  CreateGroupMutationResult,
  CreateGroupMutationVariables,
  CREATE_GROUP_MUTATION,
  DeleteGroupMutationResult,
  DeleteGroupMutationVariables,
  DELETE_GROUP_MUTATION,
  UpdateGroupMutationResult,
  UpdateGroupMutationVariables,
  UPDATE_GROUP_MUTATION,
} from "src/apollo/mutations";
import { useMutation } from "@vue/apollo-composable";

const defaultItem: GroupAdminTableProps["defaultItem"] = {
  id: "",
  name: "",
};
const columns: GroupAdminTableProps["columns"] = [
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
const crud: GroupAdminTableProps["crud"] = {
  async list(args: GroupsQueryVariables) {
    const data = await useAsyncQuery<GroupsQueryResult, GroupsQueryVariables>(
      GROUPS_QUERY,
      { variables: args, fetchPolicy: "network-only" }
    );
    return {
      items: data.groups.edges.map(({ node }) => node),
      pageInfo: data.groups.pageInfo,
    };
  },
  async create(args: CreateGroupMutationVariables) {
    const { mutate } = await useMutation<
      CreateGroupMutationResult,
      CreateGroupMutationVariables
    >(CREATE_GROUP_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error creating group");
    }
    return response.data.createGroup;
  },
  async update(args: UpdateGroupMutationVariables) {
    const { mutate } = await useMutation<
      UpdateGroupMutationResult,
      UpdateGroupMutationVariables
    >(UPDATE_GROUP_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error updating group");
    }
    return response.data.updateGroup;
  },
  async delete(args: DeleteGroupMutationVariables) {
    const { mutate } = await useMutation<
      DeleteGroupMutationResult,
      DeleteGroupMutationVariables
    >(DELETE_GROUP_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error deleting group");
    }
    return response.data.deleteGroup;
  },
};
</script>

<template>
  <q-page>
    <GroupAdminTable
      item-name="Grupo"
      :default-item="defaultItem"
      :columns="columns"
      :items-per-page="10"
      :crud="crud"
    />
  </q-page>
</template>

<style scoped></style>
