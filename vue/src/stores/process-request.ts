import { useMutation } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import {
  DeleteProcessRequestMutationResult,
  DeleteProcessRequestMutationVariables,
  DELETE_PROCESS_REQUEST_MUTATION,
} from "src/apollo/mutations";
import {
  ProcessRequestsQueryResult,
  ProcessRequestsQueryVariables,
  PROCESS_REQUESTS_QUERY,
} from "src/apollo/queries";
import { useAsyncQuery } from "src/composables";
import {
  ProcessRequest,
  PageInfo,
  TablePaginateArgs,
  TablePagination,
} from "src/interfaces";
import { onMounted, reactive, ref } from "vue";
import { tablePaginate } from "./helpers";

interface ProcessRequestStoreState {
  items: ProcessRequest[];
  pageInfo: PageInfo;
  totalCount: number;
  pagination: TablePagination;
}

export const useProcessRequestStore = defineStore("process-request", () => {
  const state = reactive<ProcessRequestStoreState>({
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
  const fetchVariables = ref<ProcessRequestsQueryVariables>({
    first: state.pagination.rowsPerPage,
    where: {},
  });

  onMounted(() => {
    fetch();
  });

  async function fetch() {
    try {
      loading.value = true;
      const data = await useAsyncQuery<
        ProcessRequestsQueryResult,
        ProcessRequestsQueryVariables
      >(PROCESS_REQUESTS_QUERY, {
        variables: fetchVariables.value,
        fetchPolicy: "network-only",
      });
      state.items = data.processRequests.edges.map(({ node }) => node);
      state.pageInfo = data.processRequests.pageInfo;
      state.totalCount = data.processRequests.totalCount;
      state.pagination.rowsNumber = data.processRequests.totalCount;
    } finally {
      loading.value = false;
    }
  }

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
    fetch();
  }

  async function deleteItem(
    args: DeleteProcessRequestMutationVariables
  ): Promise<ProcessRequest> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        DeleteProcessRequestMutationResult,
        DeleteProcessRequestMutationVariables
      >(DELETE_PROCESS_REQUEST_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error deleting process request");
      }
      return response.data.deleteProcessRequest;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    state,
    actions: {
      paginate,
      deleteItem,
    },
  };
});
