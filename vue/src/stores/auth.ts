import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import {
  SigninMutationResult,
  SigninMutationVariables,
  SIGNIN_MUTATION,
  SignupMutationResult,
  SignupMutationVariables,
  SIGNUP_MUTATION,
} from "src/apollo/mutations";
import { MeQueryResult, ME_QUERY } from "src/apollo/queries";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "src/common/auth";
import { useAsyncQuery } from "src/composables";
import { SigninError, SignupError } from "src/errors";
import { User } from "src/interfaces";
import { computed, reactive } from "vue";

interface AuthStoreState {
  loading: boolean;
  user: User | null;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export const useAuthStore = defineStore("auth", () => {
  const state = reactive<AuthStoreState>({
    loading: false,
    user: null,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });
  const isAuthenticated = computed(() => !!state.accessToken);
  const { onResult } = useQuery<MeQueryResult>(ME_QUERY, undefined, {
    enabled: isAuthenticated.value,
    fetchPolicy: "network-only",
  });

  onResult((result) => {
    state.user = result.data.me;
  });

  function setTokens(accessToken: string, refreshToken: string) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }

  function clearTokens() {
    state.accessToken = undefined;
    state.refreshToken = undefined;
    deleteAccessToken();
    deleteRefreshToken();
  }

  async function fetchUser() {
    const user = await useAsyncQuery<MeQueryResult>(ME_QUERY, {
      fetchPolicy: "network-only",
    });
    state.user = user.me;
  }

  async function signin(data: SigninMutationVariables) {
    const { mutate } = useMutation<
      SigninMutationResult,
      SigninMutationVariables
    >(SIGNIN_MUTATION, { variables: data });

    try {
      state.loading = true;
      const response = await mutate();
      if (!response?.data) {
        throw new SigninError("Signin failed");
      }

      const { accessToken, refreshToken } = response.data.signin;
      setTokens(accessToken, refreshToken);
      await fetchUser();

      return {
        accessToken,
        refreshToken,
      };
    } finally {
      state.loading = false;
    }
  }

  async function signup(data: SignupMutationVariables) {
    const { mutate } = useMutation<
      SignupMutationResult,
      SignupMutationVariables
    >(SIGNUP_MUTATION, { variables: data });

    try {
      state.loading = true;
      const response = await mutate();
      if (!response?.data) {
        throw new SignupError("Signup failed");
      }

      return response.data.signup;
    } finally {
      state.loading = false;
    }
  }

  function signout() {
    state.user = null;
    clearTokens();
  }

  return {
    state,
    getters: {
      isAuthenticated: () => isAuthenticated.value,
    },
    actions: {
      signin,
      signup,
      signout,
    },
  };
});
