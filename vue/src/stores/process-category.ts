import { useMutation } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import {
  CREATE_PROCESS_CATEGORY_MUTATION,
  CreateProcessCategoryMutationResult,
  CreateProcessCategoryMutationVariables,
  DELETE_PROCESS_CATEGORY_MUTATION,
  DeleteProcessCategoryMutationResult,
  DeleteProcessCategoryMutationVariables,
  UPDATE_PROCESS_CATEGORY_MUTATION,
  UpdateProcessCategoryMutationResult,
  UpdateProcessCategoryMutationVariables,
} from "src/apollo/mutations";
import {
  PROCESS_CATEGORIES_QUERY,
  ProcessCategoriesQueryResult,
  ProcessCategoriesQueryVariables,
} from "src/apollo/queries";
import { useAsyncQuery } from "src/composables";
import {
  PageInfo,
  TablePaginateArgs,
  TablePagination,
  ProcessCategory,
} from "src/interfaces";
import { onMounted, reactive, ref } from "vue";
import { tablePaginate } from "./helpers";

interface ProcessCategoryStoreState {
  items: ProcessCategory[];
  pageInfo: PageInfo;
  totalCount: number;
  pagination: TablePagination;
}

export const useProcessCategoryStore = defineStore("process-category", () => {
  const state = reactive<ProcessCategoryStoreState>({
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
  const fetchVariables = ref<ProcessCategoriesQueryVariables>({
    first: state.pagination.rowsPerPage,
  });

  onMounted(() => {
    fetch();
  });

  async function fetch() {
    try {
      loading.value = true;
      const data = await useAsyncQuery<
        ProcessCategoriesQueryResult,
        ProcessCategoriesQueryVariables
      >(PROCESS_CATEGORIES_QUERY, {
        variables: fetchVariables.value,
        fetchPolicy: "network-only",
      });
      state.items = data.processCategories.edges.map(({ node }) => node);
      state.pageInfo = data.processCategories.pageInfo;
      state.totalCount = data.processCategories.totalCount;
      state.pagination.rowsNumber = data.processCategories.totalCount;
    } finally {
      loading.value = false;
    }
  }

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
    fetch();
  }

  async function createItem(
    args: CreateProcessCategoryMutationVariables
  ): Promise<ProcessCategory> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        CreateProcessCategoryMutationResult,
        CreateProcessCategoryMutationVariables
      >(CREATE_PROCESS_CATEGORY_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error creating process");
      }
      return response.data.createProcessCategory;
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(
    args: UpdateProcessCategoryMutationVariables
  ): Promise<ProcessCategory> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        UpdateProcessCategoryMutationResult,
        UpdateProcessCategoryMutationVariables
      >(UPDATE_PROCESS_CATEGORY_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error updating process");
      }
      return response.data.updateProcessCategory;
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(
    args: DeleteProcessCategoryMutationVariables
  ): Promise<ProcessCategory> {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        DeleteProcessCategoryMutationResult,
        DeleteProcessCategoryMutationVariables
      >(DELETE_PROCESS_CATEGORY_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error deleting process category");
      }
      return response.data.deleteProcessCategory;
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
