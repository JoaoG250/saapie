import { useMutation } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import {
  SigninMutationResult,
  SigninMutationVariables,
  SIGNIN_MUTATION,
} from "src/apollo/mutations";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "src/common/auth";
import { SigninError } from "src/errors";
import { User } from "src/models";
import { computed, reactive } from "vue";

interface AuthStoreState {
  user: User | null;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export const useAuthStore = defineStore("auth", () => {
  const state = reactive<AuthStoreState>({
    user: null,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });
  const isAuthenticated = computed(() => !!state.accessToken);

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

  async function signin(data: { email: string; password: string }) {
    const { mutate } = useMutation<
      SigninMutationResult,
      SigninMutationVariables
    >(SIGNIN_MUTATION, { variables: data });

    const response = await mutate();
    if (!response?.data) {
      throw new SigninError("Signin failed");
    }

    const { accessToken, refreshToken } = response.data.signin;
    setTokens(accessToken, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
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
      signout,
    },
  };
});
