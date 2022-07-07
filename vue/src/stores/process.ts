import { useMutation, useQuery } from "@vue/apollo-composable";
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
import { Process, PageInfo, PaginationArgs } from "src/interfaces";
import { reactive, ref, watch } from "vue";

interface ProcessStoreState {
  items: Process[];
  pageInfo: PageInfo;
  totalCount: number;
  pagination: {
    page: number;
    rowsNumber: number;
    descending?: boolean;
    rowsPerPage?: number;
    sortBy?: string;
  };
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
  const fetchVariables = ref<PaginationArgs>({
    first: state.pagination.rowsPerPage,
  });
  const { onResult, loading: queryLoading } = useQuery<
    ProcessesQueryResult,
    ProcessesQueryVariables
  >(PROCESSES_QUERY, fetchVariables, { fetchPolicy: "network-only" });
  const loading = ref(queryLoading.value);

  watch(queryLoading, (val) => {
    loading.value = val;
  });

  onResult((result) => {
    state.items = result.data.processes.edges.map(({ node }) => node);
    state.pageInfo = result.data.processes.pageInfo;
    state.totalCount = result.data.processes.totalCount;
    state.pagination.rowsNumber = result.data.processes.totalCount;
  });

  function paginate(paginate: {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
  }) {
    const goingForward = paginate.page > state.pagination.page;
    const goingBackward = paginate.page < state.pagination.page;
    if (goingForward && state.pageInfo.hasNextPage) {
      fetchVariables.value = {
        first: paginate.rowsPerPage,
        after: state.pageInfo.endCursor,
      };
      state.pagination = { ...state.pagination, ...paginate };
    } else if (goingBackward && state.pageInfo.hasPreviousPage) {
      fetchVariables.value = {
        last: paginate.rowsPerPage,
        before: state.pageInfo.startCursor,
      };
      state.pagination = { ...state.pagination, ...paginate };
    } else if (
      !!paginate.rowsPerPage &&
      paginate.rowsPerPage !== state.pagination.rowsPerPage
    ) {
      if (fetchVariables.value.first) {
        fetchVariables.value.first = paginate.rowsPerPage;
      } else {
        fetchVariables.value.last = paginate.rowsPerPage;
      }
      state.pagination = { ...state.pagination, ...paginate };
    }
  }

  async function createItem(args: CreateProcessMutationVariables) {
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

  async function updateItem(args: UpdateProcessMutationVariables) {
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

  async function deleteItem(args: DeleteProcessMutationVariables) {
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
    fetchVariables,
    actions: {
      paginate,
      createItem,
      updateItem,
      deleteItem,
    },
  };
});
