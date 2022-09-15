<script setup lang="ts">
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

const { onResult, loading } = useQuery<
  ProcessQueryResult,
  ProcessQueryVariables
>(PROCESS_QUERY, { slug: processSlug.value }, { fetchPolicy: "network-only" });
onResult((result) => {
  if (result.data.process) {
    process.value = result.data.process;
    document.title = `${process.value.name} - SAAPIE`;
  } else {
    router.push({ name: "not-found" });
  }
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
        message:
          "Não foi possível enviar o pedido de abertura de processo. Tente novamente.",
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
        <div class="text-h4 text-weight-bold text-center q-my-md process-name">
          {{ process.name }}
        </div>
        <q-separator class="q-mb-md" inset />
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="text-subtitle1 q-mb-sm process-description"
          v-html="process.description"
        />
        <!-- eslint-enable vue/no-v-html -->
        <q-separator class="q-mb-md" inset />
        <q-banner
          v-if="!process.active"
          class="text-white bg-warning q-mb-md"
          rounded
        >
          <template #avatar>
            <q-icon name="warning" />
          </template>
          <div class="text-weight-bold text-body1">
            O formulário para este processo está fechado e não aceitará mais
            respostas.
          </div>
        </q-banner>
        <FormKit
          type="form"
          :disabled="!process.active"
          @submit="submitHandler"
        >
          <FormKitSchema :schema="schema" />
        </FormKit>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/mixins";
.container :deep(.formkit-form) {
  --fk-max-width-input: 100%;
}
@include screen(xs) {
  .process-name {
    font-size: 1.6rem;
  }
  .process-description :deep(p) {
    font-size: 0.9rem;
  }
}
</style>
