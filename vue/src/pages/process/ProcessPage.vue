<script setup lang="ts">
import { marked } from "marked";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  ProcessQueryResult,
  ProcessQueryVariables,
  PROCESS_QUERY,
} from "src/apollo/queries";
import { FormKitData } from "src/interfaces";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FormKit, FormKitSchema } from "@formkit/vue";
import { FormKitSchemaNode } from "@formkit/core";
import {
  CreateProcessRequestMutationResult,
  CreateProcessRequestMutationVariables,
  CREATE_PROCESS_REQUEST_MUTATION,
} from "src/apollo/mutations";
import { useQuasar } from "quasar";
import { getFilesFromFormKitData } from "src/common/forms";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const process = ref<ProcessQueryResult["process"]>();
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
const description = computed(() => {
  if (process.value) {
    return marked.parse(process.value.description);
  }
  return "";
});

const { onResult, loading } = useQuery<
  ProcessQueryResult,
  ProcessQueryVariables
>(PROCESS_QUERY, { slug: processSlug.value }, { fetchPolicy: "network-only" });
onResult((result) => {
  process.value = result.data.process;
});

async function submitHandler(data: FormKitData) {
  const attachments = getFilesFromFormKitData(data, true);
  const { mutate } = useMutation<
    CreateProcessRequestMutationResult,
    CreateProcessRequestMutationVariables
  >(CREATE_PROCESS_REQUEST_MUTATION, {
    variables: {
      data,
      attachments,
      processSlug: processSlug.value,
    },
  });

  try {
    await mutate();
    $q.notify({
      position: "top",
      color: "positive",
      message: "Pedido de abertura de processo enviado com sucesso!",
      icon: "check",
    });
    await router.push({ name: "process-requests" });
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
      <div v-if="process" class="column">
        <div class="text-h4 text-weight-bold q-mt-md">{{ process.name }}</div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="text-subtitle1 q-mb-sm" v-html="description" />
        <q-separator class="q-mb-md" inset />
        <FormKit type="form" @submit="submitHandler">
          <FormKitSchema :schema="schema" />
        </FormKit>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.container :deep(.formkit-form) {
  --fk-max-width-input: 100%;
}
</style>
