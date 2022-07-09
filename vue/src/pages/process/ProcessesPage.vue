<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessesQueryResult,
  ProcessesQueryVariables,
  PROCESSES_QUERY,
} from "src/apollo/queries";
import { Process } from "src/interfaces";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const processes = ref<Process[]>([]);
const { onResult } = useQuery<ProcessesQueryResult, ProcessesQueryVariables>(
  PROCESSES_QUERY,
  { first: 50 },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  processes.value = result.data.processes.edges.map((edge) => edge.node);
});
</script>

<template>
  <q-page class="container">
    <div class="row q-col-gutter-md">
      <template v-for="(process, index) in processes" :key="index">
        <div class="col-12 col-md-4">
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
      </template>
    </div>
  </q-page>
</template>

<style scoped></style>
