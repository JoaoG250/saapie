<script setup lang="ts">
import { Process } from "src/interfaces";
import { RouterLink } from "vue-router";

interface ProcessListProps {
  processes: Process[];
}
defineProps<ProcessListProps>();
</script>

<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="(process, index) in processes"
      :key="index"
      class="col-12 col-md-4"
    >
      <router-link
        class="muted-link"
        :to="{ name: 'process', params: { slug: process.slug } }"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ process.name }}</div>
            <div class="q-mt-sm">
              {{ process.description }}
            </div>
          </q-card-section>
        </q-card>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
