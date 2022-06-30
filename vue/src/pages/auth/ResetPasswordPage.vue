<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  ResetPasswordMutationResult,
  ResetPasswordMutationVariables,
  RESET_PASSWORD_MUTATION,
} from "src/apollo/mutations";
import { PasswordResetError } from "src/errors";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const loading = ref(false);
const success = ref(false);
const form = reactive({
  password: "",
  passwordConfirmation: "",
});
// TODO: Add field validation

const token = computed(() => {
  const token = route.params.token;
  if (typeof token === "string") {
    return token;
  }
  throw new Error("Invalid token");
});

async function resetPassword() {
  const { mutate } = useMutation<
    ResetPasswordMutationResult,
    ResetPasswordMutationVariables
  >(RESET_PASSWORD_MUTATION, {
    variables: { token: token.value, password: form.password },
  });

  try {
    loading.value = true;
    const response = await mutate();
    if (!response?.data) {
      throw new PasswordResetError("Password reset failed");
    }

    success.value = response.data.resetPassword;
    if (success.value) {
      $q.notify({
        position: "top",
        color: "positive",
        message:
          "Senha redefinida com sucesso. Redirecionando para autenticação.",
        icon: "check",
      });
      setTimeout(() => {
        router.push({ name: "signin" });
      }, 4000);
    }
  } catch (err) {
    if (err instanceof Error) {
      $q.notify({
        position: "top",
        color: "negative",
        message: err.message,
        icon: "report_problem",
      });
    }
    throw err;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page class="row items-center justify-center">
    <q-card style="width: 450px">
      <q-card-section>
        <div class="text-h4 text-center">Redefinir senha</div>
      </q-card-section>
      <q-card-section class="column">
        <q-input v-model="form.password" label="Senha" type="password" />
        <q-input
          v-model="form.passwordConfirmation"
          label="Confirmar senha"
          type="password"
        />
      </q-card-section>
      <q-card-section class="column">
        <q-btn
          color="primary"
          class="q-mb-lg"
          label="Redefinir senha"
          :loading="loading"
          @click="resetPassword"
        />
        <q-btn :to="{ name: 'signin' }" flat label="Voltar para autenticação" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
