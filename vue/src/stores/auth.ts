import { useMutation } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import {
  SigninMutationResult,
  SigninMutationVariables,
  SIGNIN_MUTATION,
} from "src/apollo/mutations";
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
    accessToken: undefined,
    refreshToken: undefined,
  });
  const isAuthenticated = computed(() => !!state.accessToken);

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
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;

    return {
      accessToken,
      refreshToken,
    };
  }

  return {
    state,
    getters: {
      isAuthenticated: () => isAuthenticated.value,
    },
    actions: {
      signin,
    },
  };
});
