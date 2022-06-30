<script setup lang="ts">
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/auth";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});
// TODO: Add field validation

async function signup() {
  try {
    await authStore.actions.signup(form);
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
  await router.push({ name: "signin" });
}
</script>

<template>
  <q-page class="row items-center justify-center">
    <q-card style="width: 450px">
      <q-card-section>
        <div class="text-h4 text-center">Cadastro</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="form.firstName" label="Nome" />
        <q-input v-model="form.lastName" label="Sobrenome" />
        <q-input v-model="form.email" label="Email" type="email" />
        <q-input v-model="form.password" label="Senha" type="password" />
      </q-card-section>
      <q-card-section class="row justify-center">
        <div class="column text-center">
          <q-btn
            :loading="authStore.state.loading"
            color="primary"
            @click="signup"
            >Cadastrar</q-btn
          >
          <span class="q-mt-lg">
            Já possui cadastro?
            <router-link :to="{ name: 'signin' }"> Autenticar </router-link>
          </span>
          <span class="q-mt-sm">
            Voltar a
            <router-link :to="{ name: 'index' }"> página inicial </router-link>
          </span>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
