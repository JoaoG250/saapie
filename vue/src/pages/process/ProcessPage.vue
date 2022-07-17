<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  ProcessQueryResult,
  ProcessQueryVariables,
  PROCESS_QUERY,
} from "src/apollo/queries";
import { Process, FormKitData } from "src/interfaces";
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

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
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

function changeFileName(file: File, name: string): File {
  const extention = file.name.split(".").pop();
  const newName = `${name}.${extention}`;
  return new File([file], newName, { type: file.type });
}

function getFilesFromFormKitData(
  data: FormKitData,
  removeKeys = true,
  renameWithKey = true
): File[] {
  const files: File[] = [];
  for (const key in data) {
    const value = data[key];
    if (!(value instanceof Array)) continue;
    for (const fileValue of value) {
      if (!(typeof fileValue === "object")) continue;
      if (!fileValue.file) continue;
      const file = renameWithKey
        ? changeFileName(fileValue.file, key)
        : fileValue.file;
      files.push(file);
      if (removeKeys) delete data[key];
    }
  }
  return files;
}

async function submitHandler(data: FormKitData) {
  const files = getFilesFromFormKitData(data, true);
  const { mutate } = useMutation<
    CreateProcessRequestMutationResult,
    CreateProcessRequestMutationVariables
  >(CREATE_PROCESS_REQUEST_MUTATION, {
    variables: {
      data,
      processSlug: processSlug.value,
      attachments: files,
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
        <div class="text-subtitle1 q-mb-lg">{{ process.description }}</div>
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
