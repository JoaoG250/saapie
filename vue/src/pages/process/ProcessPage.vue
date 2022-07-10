<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  ProcessQueryResult,
  ProcessQueryVariables,
  PROCESS_QUERY,
} from "src/apollo/queries";
import { Process, FormKitData } from "src/interfaces";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { FormKit, FormKitSchema } from "@formkit/vue";
import { FormKitSchemaNode } from "@formkit/core";
import {
  CreateProcessRequestMutationResult,
  CreateProcessRequestMutationVariables,
  CREATE_PROCESS_REQUEST_MUTATION,
} from "src/apollo/mutations";

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

const formData = ref({
  nome: {
    value: "John Doe",
  },
  cpf: {
    value: "12345678901",
  },
  email: {
    value: "john@doe.com",
  },
  curso: {
    value: "Engenharia de Software",
  },
  matricula: {
    value: 123456789,
  },
  telefone: {
    value: "99999999999",
  },
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
    if (value instanceof Array) {
      for (const fileValue of value) {
        if (typeof fileValue === "object") {
          if (fileValue.file) {
            const file = renameWithKey
              ? changeFileName(fileValue.file, key)
              : fileValue.file;
            files.push(file);
            if (removeKeys) {
              delete data[key];
            }
          }
        }
      }
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
      data: { data, processId: "", userId: "" },
      attachments: files,
    },
  });
  await mutate();
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
        <FormKitSchema :data="formData" :schema="schema" />
      </FormKit>
    </div>
  </q-page>
</template>

<style scoped></style>
