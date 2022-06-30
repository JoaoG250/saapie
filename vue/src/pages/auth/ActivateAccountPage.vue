<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  ActivateAccountMutationResult,
  ActivateAccountMutationVariables,
  ACTIVATE_ACCOUNT_MUTATION,
} from "src/apollo/mutations";
import { useRoute, useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { AccountActivationError } from "src/errors";
import { useQuasar } from "quasar";

const loading = ref(true);
const activated = ref(false);
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const token = computed(() => {
  const token = route.params.token;
  if (typeof token === "string") {
    return token;
  }
  throw new Error("Invalid token");
});
const banner = computed(() => {
  if (activated.value) {
    return {
      class: "text-white bg-positive",
      icon: "check",
      title: "Conta ativada com sucesso!",
      message: "Agora você pode autenticar com seu email e senha.",
    };
  } else {
    return {
      class: "text-white bg-red",
      icon: "report_problem",
      title: "Não foi possível ativar a conta.",
      message:
        "O token que você forneceu é inválido ou expirou. Por favor, solicite um novo.",
    };
  }
});

onMounted(async () => {
  await activateAccount();
});

async function activateAccount() {
  const { mutate } = useMutation<
    ActivateAccountMutationResult,
    ActivateAccountMutationVariables
  >(ACTIVATE_ACCOUNT_MUTATION, { variables: { token: token.value } });

  try {
    const response = await mutate();
    if (!response?.data) {
      throw new AccountActivationError("Account activation failed");
    }

    activated.value = response.data.activateAccount;
    if (activated.value) {
      $q.notify({
        position: "top",
        color: "positive",
        message: "Conta ativada com sucesso! Redirecionando para autenticação.",
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
        <div class="text-h4 text-center">Ativação de conta</div>
      </q-card-section>
      <q-card-section v-if="loading" class="column q-mt-lg">
        <q-spinner-hourglass color="primary" size="4em" class="self-center" />
        <div class="text-h5 text-center">Ativando conta...</div>
      </q-card-section>
      <q-card-section v-else>
        <q-banner rounded :class="banner.class">
          <template #avatar>
            <q-icon :name="banner.icon" color="white" />
          </template>
          <div class="text-h6 q-mb-md">{{ banner.title }}</div>
          <p>
            {{ banner.message }}
          </p>
          <template #action>
            <q-btn
              :to="{ name: 'signin' }"
              flat
              label="Voltar para autenticação"
            />
          </template>
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
