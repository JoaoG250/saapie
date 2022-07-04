import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import {
  CreateUserMutationResult,
  CreateUserMutationVariables,
  CREATE_USER_MUTATION,
  DeleteUserMutationResult,
  DeleteUserMutationVariables,
  DELETE_USER_MUTATION,
  UpdateUserMutationResult,
  UpdateUserMutationVariables,
  UPDATE_USER_MUTATION,
} from "src/apollo/mutations";
import {
  UsersQueryResult,
  UsersQueryVariables,
  USERS_QUERY,
} from "src/apollo/queries";
import { User, PageInfo, PaginationArgs } from "src/interfaces";
import { reactive, ref, watch } from "vue";

interface UserStoreState {
  loading: boolean;
  items: User[];
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

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserStoreState>({
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
    UsersQueryResult,
    UsersQueryVariables
  >(USERS_QUERY, fetchVariables, { fetchPolicy: "network-only" });

  watch(queryLoading, (val) => {
    state.loading = val;
  });

  onResult((result) => {
    state.items = result.data.users.edges.map(({ node }) => node);
    state.pageInfo = result.data.users.pageInfo;
    state.totalCount = result.data.users.totalCount;
    state.pagination.rowsNumber = result.data.users.totalCount;
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

  async function createItem(args: CreateUserMutationVariables) {
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
  }

  async function updateItem(args: UpdateUserMutationVariables) {
    const { mutate } = useMutation<
      UpdateUserMutationResult,
      UpdateUserMutationVariables
    >(UPDATE_USER_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error updating user");
    }
    return response.data.updateUser;
  }

  async function deleteItem(args: DeleteUserMutationVariables) {
    const { mutate } = useMutation<
      DeleteUserMutationResult,
      DeleteUserMutationVariables
    >(DELETE_USER_MUTATION, { variables: args });
    const response = await mutate();
    if (!response?.data) {
      throw new Error("Error deleting user");
    }
    return response.data.deleteUser;
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
