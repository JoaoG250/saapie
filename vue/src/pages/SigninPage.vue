<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  email: "",
  password: "",
});

function signin() {
  // ...
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
        <q-btn color="primary" @click="signin">Entrar</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
