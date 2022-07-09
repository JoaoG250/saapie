<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessQueryResult,
  ProcessQueryVariables,
  PROCESS_QUERY,
} from "src/apollo/queries";
import { Process } from "src/interfaces";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { FormKit, FormKitSchema } from "@formkit/vue";
import { FormKitSchemaNode } from "@formkit/core";

const route = useRoute();
const process = ref<Process>();
const schema = computed<FormKitSchemaNode[]>(() => {
  if (process.value) {
    return process.value.form.definition as FormKitSchemaNode[];
  }
  return [];
});
const processSlug = computed<string>(() => {
  const slug = route.params.slug;
  if (typeof slug === "string") {
    return slug;
  } else {
    throw new Error("Invalid id");
  }
});

const { onResult, loading } = useQuery<
  ProcessQueryResult,
  ProcessQueryVariables
>(PROCESS_QUERY, { slug: processSlug.value }, { fetchPolicy: "network-only" });
onResult((result) => {
  process.value = result.data.process;
});

function submitHandler(event: Event) {
  event.preventDefault();
  console.log(event);
}
</script>

<template>
  <q-page>
    <div class="container">
      <div
        v-if="loading"
        class="column justify-center items-center window-height"
      >
        <q-spinner-hourglass color="primary" size="5em" />
        <div class="text-h5 text-center">Carregando...</div>
      </div>
      <FormKit v-else type="form" @submit="submitHandler">
        <FormKitSchema :schema="schema" />
      </FormKit>
    </div>
  </q-page>
</template>

<style scoped></style>
