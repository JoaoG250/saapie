<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  document.title = "404 Página não encontrada - SAAPIE";
});
</script>

<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Ops. Nada aqui...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        label="Voltar a página inicial"
        :to="{ name: 'index' }"
        unelevated
        no-caps
      />
    </div>
  </div>
</template>

<style scoped></style>
