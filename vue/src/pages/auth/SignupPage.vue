<script setup lang="ts">
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/auth";
import { reactive, ref } from "vue";
import { userRules } from "src/validation/user";
import { matches } from "src/validation";
import { useAsyncQuery } from "src/composables";
import {
  IsEmailAvailableQueryResult,
  IsEmailAvailableQueryVariables,
  IS_EMAIL_AVAILABLE_QUERY,
} from "src/apollo/queries";

const $q = useQuasar();
const authStore = useAuthStore();
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});
const success = ref(false);
const confirmPassword = ref("");
const confirmPasswordRules = [
  ...userRules["password"],
  (value: string) =>
    matches({
      value,
      target: form.password,
      valueLabel: "Confirmação de senha",
      targetLabel: "Senha",
    }),
];

async function isEmailAvailable(email: string): Promise<boolean> {
  const data = await useAsyncQuery<
    IsEmailAvailableQueryResult,
    IsEmailAvailableQueryVariables
  >(IS_EMAIL_AVAILABLE_QUERY, { variables: { email } });
  if (!data.isEmailAvailable) {
    $q.notify({
      position: "top",
      color: "negative",
      message: "Este email já está sendo usado",
      icon: "report_problem",
    });
  }
  return data.isEmailAvailable;
}

async function signup() {
  try {
    if (!(await isEmailAvailable(form.email))) return;
    success.value = await authStore.actions.signup(form);
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
  }
  $q.notify({
    position: "top",
    color: "positive",
    message: "Cadastro realizado com sucesso!",
    icon: "check",
  });
}
</script>

<template>
  <q-page class="row items-center justify-center">
    <q-card style="width: 450px">
      <q-form v-if="!success" @submit="signup">
        <q-card-section>
          <div class="text-h4 text-center">Cadastro</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="form.firstName"
            label="Nome"
            :rules="userRules.firstName"
          />
          <q-input
            v-model="form.lastName"
            label="Sobrenome"
            :rules="userRules.lastName"
          />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            name="email"
            :rules="userRules.email"
          />
          <q-input
            v-model="form.password"
            label="Senha"
            type="password"
            :rules="userRules.password"
          />
          <q-input
            v-model="confirmPassword"
            label="Confirmação de senha"
            type="password"
            :rules="confirmPasswordRules"
          />
        </q-card-section>
        <q-card-section class="row justify-center">
          <div class="column text-center">
            <q-btn
              :loading="authStore.state.loading"
              color="primary"
              type="submit"
            >
              Cadastrar
            </q-btn>
            <span class="q-mt-lg">
              Já possui cadastro?
              <router-link :to="{ name: 'signin' }"> Autenticar </router-link>
            </span>
            <span class="q-mt-sm">
              Voltar a
              <router-link :to="{ name: 'index' }">
                página inicial
              </router-link>
            </span>
          </div>
        </q-card-section>
      </q-form>
      <q-card-section v-else>
        <q-banner rounded class="text-white bg-positive">
          <template #avatar>
            <q-icon name="check" color="white" />
          </template>
          <div class="text-h6 q-mb-md">Cadastro realizado com sucesso!</div>
          <p>
            Antes de você poder autenticar você precisa ativar sua conta.<br />
            Enviamos um email de ativação.<br />
            Por favor, verifique sua caixa de entrada e clique no link no email
            para ativar sua conta.
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
