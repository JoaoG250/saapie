<script setup lang="ts">
import { Process } from "src/interfaces";
import { RouterLink } from "vue-router";

interface ProcessListProps {
  processes: Process[];
}
defineProps<ProcessListProps>();

function htmlToText(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
</script>

<template>
  <div class="row justify-center q-col-gutter-md">
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
            <div class="text-h6 process-name">
              <span>{{ process.name }}</span>
            </div>
            <div class="q-mt-sm process-description">
              <span>{{ htmlToText(process.description) }}</span>
            </div>
          </q-card-section>
        </q-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/css/mixins";
.process {
  &-name {
    font-size: 1.2rem;
    line-height: unset;
    height: 55px;
    span {
      @include line-clamp(2);
    }
  }
  &-description {
    height: 100px;
    span {
      @include line-clamp(5);
    }
  }
}
</style>
