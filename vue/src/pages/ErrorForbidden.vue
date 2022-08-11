<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  document.title = "403 Acesso Negado - SAAPIE";
});
</script>

<template>
  <div
    class="fullscreen bg-negative text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">403</div>

      <div class="text-h2" style="opacity: 0.4">Acesso negado!</div>

      <q-btn
        class="q-mt-xl"
        color="black"
        label="Voltar a página inicial"
        :to="{ name: 'index' }"
        unelevated
        no-caps
      />
    </div>
  </div>
</template>

<style scoped></style>
