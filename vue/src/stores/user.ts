import { useMutation } from "@vue/apollo-composable";
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
import { useAsyncQuery } from "src/composables";
import {
  User,
  PageInfo,
  UserWhereInput,
  TablePaginateArgs,
  TablePagination,
} from "src/interfaces";
import { onMounted, reactive, ref } from "vue";
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
  const loading = ref(false);
  const fetchVariables = ref<UsersQueryVariables>({
    first: state.pagination.rowsPerPage,
  });

  onMounted(() => {
    fetch();
  });

  async function fetch() {
    try {
      loading.value = true;
      const data = await useAsyncQuery<UsersQueryResult, UsersQueryVariables>(
        USERS_QUERY,
        { variables: fetchVariables.value, fetchPolicy: "network-only" }
      );
      state.items = data.users.edges.map(({ node }) => node);
      state.pageInfo = data.users.pageInfo;
      state.totalCount = data.users.totalCount;
      state.pagination.rowsNumber = data.users.totalCount;
    } finally {
      loading.value = false;
    }
  }

  function paginate(paginate: TablePaginateArgs) {
    tablePaginate(state, paginate, fetchVariables);
    fetch();
  }

  function filter(filter: UserWhereInput) {
    if (filter.email) {
      fetchVariables.value.where = { email: filter.email };
    } else {
      fetchVariables.value.where = undefined;
    }
    fetch();
  }

  async function createItem(args: CreateUserMutationVariables): Promise<User> {
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

  async function updateItem(args: UpdateUserMutationVariables): Promise<User> {
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

  async function deleteItem(args: DeleteUserMutationVariables): Promise<User> {
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
    actions: {
      filter,
      paginate,
      createItem,
      updateItem,
      deleteItem,
    },
  };
});
