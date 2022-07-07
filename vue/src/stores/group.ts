import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
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
import {
  GroupsQueryResult,
  GroupsQueryVariables,
  GROUPS_QUERY,
} from "src/apollo/queries";
import {
  Group,
  PageInfo,
  TablePaginateArgs,
  PaginationArgs,
  TablePagination,
} from "src/interfaces";
import { reactive, ref, watch } from "vue";
import { tablePaginate } from "./helpers";

interface GroupStoreState {
  items: Group[];
  pageInfo: PageInfo;
  totalCount: number;
  pagination: TablePagination;
}

export const useGroupStore = defineStore("group", () => {
  const state = reactive<GroupStoreState>({
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
    GroupsQueryResult,
    GroupsQueryVariables
  >(GROUPS_QUERY, fetchVariables, { fetchPolicy: "network-only" });
  const loading = ref(queryLoading.value);

  watch(queryLoading, (val) => {
    loading.value = val;
  });

  onResult((result) => {
    state.items = result.data.groups.edges.map(({ node }) => node);
    state.pageInfo = result.data.groups.pageInfo;
    state.totalCount = result.data.groups.totalCount;
    state.pagination.rowsNumber = result.data.groups.totalCount;
  });

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
  }

  async function createItem(args: CreateGroupMutationVariables) {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        CreateGroupMutationResult,
        CreateGroupMutationVariables
      >(CREATE_GROUP_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error creating group");
      }
      return response.data.createGroup;
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(args: UpdateGroupMutationVariables) {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        UpdateGroupMutationResult,
        UpdateGroupMutationVariables
      >(UPDATE_GROUP_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error updating group");
      }
      return response.data.updateGroup;
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(args: DeleteGroupMutationVariables) {
    try {
      loading.value = true;
      const { mutate } = await useMutation<
        DeleteGroupMutationResult,
        DeleteGroupMutationVariables
      >(DELETE_GROUP_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error deleting group");
      }
      return response.data.deleteGroup;
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
