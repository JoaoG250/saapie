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
import { Group, PageInfo, PaginationArgs } from "src/interfaces";
import { reactive, ref, watch } from "vue";

interface GroupStoreState {
  loading: boolean;
  items: Group[];
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

export const useGroupStore = defineStore("group", () => {
  const state = reactive<GroupStoreState>({
    loading: false,
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

  watch(queryLoading, (val) => {
    state.loading = val;
  });

  onResult((result) => {
    state.items = result.data.groups.edges.map(({ node }) => node);
    state.pageInfo = result.data.groups.pageInfo;
    state.totalCount = result.data.groups.totalCount;
    state.pagination.rowsNumber = result.data.groups.totalCount;
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

  async function createItem(args: CreateGroupMutationVariables) {
    const { mutate } = await useMutation<
      CreateGroupMutationResult,
      CreateGroupMutationVariables
    >(CREATE_GROUP_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error creating group");
    }
    return response.data.createGroup;
  }

  async function updateItem(args: UpdateGroupMutationVariables) {
    const { mutate } = await useMutation<
      UpdateGroupMutationResult,
      UpdateGroupMutationVariables
    >(UPDATE_GROUP_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error updating group");
    }
    return response.data.updateGroup;
  }

  async function deleteItem(args: DeleteGroupMutationVariables) {
    const { mutate } = await useMutation<
      DeleteGroupMutationResult,
      DeleteGroupMutationVariables
    >(DELETE_GROUP_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error deleting group");
    }
    return response.data.deleteGroup;
  }

  return {
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
