import { useMutation } from "@vue/apollo-composable";
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
import { useAsyncQuery } from "src/composables";
import {
  Group,
  PageInfo,
  TablePaginateArgs,
  PaginationArgs,
  TablePagination,
} from "src/interfaces";
import { onMounted, reactive, ref } from "vue";
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
      const data = await useAsyncQuery<GroupsQueryResult, GroupsQueryVariables>(
        GROUPS_QUERY,
        {
          variables: fetchVariables.value,
          fetchPolicy: "network-only",
        }
      );
      state.items = data.groups.edges.map(({ node }) => node);
      state.pageInfo = data.groups.pageInfo;
      state.totalCount = data.groups.totalCount;
      state.pagination.rowsNumber = data.groups.totalCount;
    } finally {
      loading.value = false;
    }
  }

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
    fetch();
  }

  async function createItem(
    args: CreateGroupMutationVariables
  ): Promise<Group> {
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

  async function updateItem(
    args: UpdateGroupMutationVariables
  ): Promise<Group> {
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

  async function deleteItem(
    args: DeleteGroupMutationVariables
  ): Promise<Group> {
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
    actions: {
      paginate,
      createItem,
      updateItem,
      deleteItem,
    },
  };
});
