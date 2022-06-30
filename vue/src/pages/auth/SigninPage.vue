<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";
import SendEmailDialog from "src/components/auth/SendEmailDialog.vue";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: "",
  password: "",
});
// TODO: Add field validation

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
        <q-input v-model="form.email" label="Email" type="email" />
        <q-input v-model="form.password" label="Senha" type="password" />
      </q-card-section>
      <q-card-section class="row justify-center">
        <div class="column text-center">
          <q-btn
            :loading="authStore.state.loading"
            class="q-mb-sm"
            color="primary"
            @click="signin"
            >Entrar
          </q-btn>
          <SendEmailDialog>
            <template #activator="{ open }">
              <q-btn flat dense no-caps @click="open">
                Esqueceu sua senha?
              </q-btn>
            </template>
          </SendEmailDialog>
          <span class="q-mt-lg">
            Não possui cadastro?
            <router-link :to="{ name: 'signup' }"> Cadastrar </router-link>
          </span>
          <span class="q-mt-sm">
            <router-link :to="{ name: 'index' }">
              Voltar a página inicial
            </router-link>
          </span>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
