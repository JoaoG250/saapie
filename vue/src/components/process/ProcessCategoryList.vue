<script setup lang="ts">
import { ProcessCategory } from "src/interfaces";
import { RouterLink } from "vue-router";

interface ProcessCategoryListProps {
  processCategories: ProcessCategory[];
}
defineProps<ProcessCategoryListProps>();
</script>

<template>
  <div class="row justify-center q-col-gutter-md">
    <div
      v-for="(processCategory, index) in processCategories"
      :key="index"
      class="col-12 col-md-4"
    >
      <router-link
        class="muted-link"
        :to="{
          name: 'processes',
          query: { processCategory: processCategory.id },
        }"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6 process-category-name text-center">
              <span>{{ processCategory.name }}</span>
            </div>
          </q-card-section>
        </q-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/css/mixins";
.process-category {
  &-name {
    font-size: 1.2rem;
    line-height: unset;
    color: $primary;
    span {
      @include line-clamp(2);
    }
  }
}
</style>
