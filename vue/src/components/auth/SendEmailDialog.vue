<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { reactive, ref } from "vue";
import {
  SendPasswordResetEmailMutationResult,
  SendPasswordResetEmailMutationVariables,
  SEND_PASSWORD_RESET_EMAIL_MUTATION,
} from "src/apollo/mutations";
import { useQuasar } from "quasar";

const $q = useQuasar();
const loading = ref(false);
const open = ref(false);
const form = reactive({
  email: "",
  emailConfirmation: "",
});
// TODO: Add field validation

function openDialog() {
  open.value = true;
}

function closeDialog() {
  open.value = false;
}

async function sendEmail() {
  const { mutate } = useMutation<
    SendPasswordResetEmailMutationResult,
    SendPasswordResetEmailMutationVariables
  >(SEND_PASSWORD_RESET_EMAIL_MUTATION, { variables: { email: form.email } });

  try {
    loading.value = true;
    await mutate();
    $q.notify({
      position: "top",
      color: "positive",
      message: "Email enviado com sucesso! Verifique sua caixa de entrada.",
      icon: "check",
    });
    closeDialog();
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
  <slot name="activator" :open="openDialog"></slot>
  <q-dialog v-model="open" persistent>
    <q-card style="max-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 q-mr-md">Enviar email de recuperação de senha</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>
      <q-card-section>
        <q-input v-model="form.email" label="Email" type="email" />
        <q-input
          v-model="form.emailConfirmation"
          type="email"
          label="Confirmar email"
        />
      </q-card-section>
      <q-card-section>
        <q-btn
          color="primary"
          text
          label="Enviar email"
          :loading="loading"
          @click="sendEmail"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
