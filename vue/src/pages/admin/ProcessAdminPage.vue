<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import {
  CreateProcessMutationResult,
  CreateProcessMutationVariables,
  CREATE_PROCESS_MUTATION,
  DeleteProcessMutationResult,
  DeleteProcessMutationVariables,
  DELETE_PROCESS_MUTATION,
  UpdateProcessMutationResult,
  UpdateProcessMutationVariables,
  UPDATE_PROCESS_MUTATION,
} from "src/apollo/mutations";
import {
  ProcessesQueryResult,
  ProcessesQueryVariables,
  PROCESSES_QUERY,
} from "src/apollo/queries";
import { ProcessAdminTableProps } from "src/components/admin/ProcessAdminTable.vue";
import { useAsyncQuery } from "src/composables";
import ProcessAdminTable from "../../components/admin/ProcessAdminTable.vue";

const defaultItem: ProcessAdminTableProps["defaultItem"] = {
  id: "",
  name: "",
  slug: "",
  description: "",
  targetGroupId: "",
  forwardToGroupId: undefined,
  form: {
    id: "",
    name: "",
    definition: {},
  },
};
const columns: ProcessAdminTableProps["columns"] = [
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
const crud: ProcessAdminTableProps["crud"] = {
  async list(args: ProcessesQueryVariables) {
    const data = await useAsyncQuery<
      ProcessesQueryResult,
      ProcessesQueryVariables
    >(PROCESSES_QUERY, { variables: args, fetchPolicy: "network-only" });
    return {
      items: data.processes.edges.map(({ node }) => node),
      pageInfo: data.processes.pageInfo,
    };
  },
  async create(args: CreateProcessMutationVariables) {
    const { mutate } = await useMutation<
      CreateProcessMutationResult,
      CreateProcessMutationVariables
    >(CREATE_PROCESS_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error creating process");
    }
    return response.data.createProcess;
  },
  async update(args: UpdateProcessMutationVariables) {
    const { mutate } = await useMutation<
      UpdateProcessMutationResult,
      UpdateProcessMutationVariables
    >(UPDATE_PROCESS_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error updating process");
    }
    return response.data.updateProcess;
  },
  async delete(args: DeleteProcessMutationVariables) {
    const { mutate } = await useMutation<
      DeleteProcessMutationResult,
      DeleteProcessMutationVariables
    >(DELETE_PROCESS_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error deleting process");
    }
    return response.data.deleteProcess;
  },
};
</script>

<template>
  <q-page>
    <ProcessAdminTable
      item-name="Processo"
      :default-item="defaultItem"
      :columns="columns"
      :items-per-page="10"
      :crud="crud"
    />
  </q-page>
</template>

<style scoped></style>
