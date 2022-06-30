<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: "",
  password: "",
});

async function signin() {
  try {
    await authStore.actions.signin(form);
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
  await router.push({ name: "index" });
}
</script>

<template>
  <q-page class="row items-center justify-center">
    <q-card style="width: 450px">
      <q-card-section>
        <div class="text-h4 text-center">Autenticação</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="form.email" label="Email" />
        <q-input v-model="form.password" label="Password" type="password" />
      </q-card-section>
      <q-card-section class="row justify-center">
        <div class="column text-center">
          <q-btn color="primary" @click="signin">Entrar</q-btn>
          <span class="q-mt-lg">Não possui cadastro? Cadastrar</span>
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
