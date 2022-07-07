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
import {
  User,
  PageInfo,
  UserWhereInput,
  TablePaginateArgs,
  TablePagination,
} from "src/interfaces";
import { reactive, ref, watch } from "vue";
import { tablePaginate } from "./helpers";

interface UserStoreState {
  items: User[];
  pageInfo: PageInfo;
  totalCount: number;
  pagination: TablePagination;
}

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserStoreState>({
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
  const fetchVariables = ref<UsersQueryVariables>({
    first: state.pagination.rowsPerPage,
  });
  const { onResult, loading: queryLoading } = useQuery<
    UsersQueryResult,
    UsersQueryVariables
  >(USERS_QUERY, fetchVariables, { fetchPolicy: "network-only" });
  const loading = ref(queryLoading.value);

  watch(queryLoading, (val) => {
    loading.value = val;
  });

  onResult((result) => {
    state.items = result.data.users.edges.map(({ node }) => node);
    state.pageInfo = result.data.users.pageInfo;
    state.totalCount = result.data.users.totalCount;
    state.pagination.rowsNumber = result.data.users.totalCount;
  });

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
  }

  function filter(filter: UserWhereInput) {
    if (filter.email) {
      fetchVariables.value.where = { email: filter.email };
    } else {
      fetchVariables.value.where = undefined;
    }
  }

  async function createItem(args: CreateUserMutationVariables) {
    try {
      loading.value = true;
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
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(args: UpdateUserMutationVariables) {
    try {
      loading.value = true;
      const { mutate } = useMutation<
        UpdateUserMutationResult,
        UpdateUserMutationVariables
      >(UPDATE_USER_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error updating user");
      }
      return response.data.updateUser;
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(args: DeleteUserMutationVariables) {
    try {
      loading.value = true;
      const { mutate } = useMutation<
        DeleteUserMutationResult,
        DeleteUserMutationVariables
      >(DELETE_USER_MUTATION, { variables: args });
      const response = await mutate();
      if (!response?.data) {
        throw new Error("Error deleting user");
      }
      return response.data.deleteUser;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    state,
    fetchVariables,
    actions: {
      filter,
      paginate,
      createItem,
      updateItem,
      deleteItem,
    },
  };
});
