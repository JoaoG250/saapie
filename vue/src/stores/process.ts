import { useMutation } from "@vue/apollo-composable";
import { defineStore } from "pinia";
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
import { useAsyncQuery } from "src/composables";
import {
  Process,
  PageInfo,
  PaginationArgs,
  TablePaginateArgs,
  TablePagination,
} from "src/interfaces";
import { onMounted, reactive, ref } from "vue";
import { tablePaginate } from "./helpers";

interface ProcessStoreState {
  items: Process[];
  pageInfo: PageInfo;
  totalCount: number;
  pagination: TablePagination;
}

export const useProcessStore = defineStore("process", () => {
  const state = reactive<ProcessStoreState>({
    items: [],
    pageInfo: {
      startCursor: "",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
    },
    totalCount: 0,
    pagination: {
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10,
    },
  });
  const loading = ref(false);
  const fetchVariables = ref<PaginationArgs>({
    first: state.pagination.rowsPerPage,
  });

  onMounted(() => {
    fetch();
  });

  async function fetch() {
    try {
      loading.value = true;
      const data = await useAsyncQuery<
        ProcessesQueryResult,
        ProcessesQueryVariables
      >(PROCESSES_QUERY, {
        variables: fetchVariables.value,
        fetchPolicy: "network-only",
      });
      state.items = data.processes.edges.map(({ node }) => node);
      state.pageInfo = data.processes.pageInfo;
      state.totalCount = data.processes.totalCount;
      state.pagination.rowsNumber = data.processes.totalCount;
    } finally {
      loading.value = false;
    }
  }

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
    fetch();
  }

  async function createItem(
    args: CreateProcessMutationVariables
  ): Promise<Process> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        CreateProcessMutationResult,
        CreateProcessMutationVariables
      >(CREATE_PROCESS_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error creating process");
      }
      return response.data.createProcess;
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(
    args: UpdateProcessMutationVariables
  ): Promise<Process> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        UpdateProcessMutationResult,
        UpdateProcessMutationVariables
      >(UPDATE_PROCESS_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error updating process");
      }
      return response.data.updateProcess;
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(
    args: DeleteProcessMutationVariables
  ): Promise<Process> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        DeleteProcessMutationResult,
        DeleteProcessMutationVariables
      >(DELETE_PROCESS_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error deleting process");
      }
      return response.data.deleteProcess;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    state,
    actions: {
      paginate,
      createItem,
      updateItem,
      deleteItem,
    },
  };
});
