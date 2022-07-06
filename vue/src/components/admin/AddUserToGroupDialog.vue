<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import {
  AddUserToGroupMutationResult,
  AddUserToGroupMutationVariables,
  ADD_USER_TO_GROUP_MUTATION,
} from "src/apollo/mutations";
import { Group, User } from "src/interfaces";
import { ref } from "vue";
import GroupSelect, { GroupSelectProps } from "./GroupSelect.vue";

interface AddUserToGroupDialogProps {
  user: User;
}

const props = defineProps<AddUserToGroupDialogProps>();
const emit = defineEmits<{ (e: "add-group", group: Group): void }>();
const $q = useQuasar();
const group = ref<Group>();
const open = ref(false);
const loading = ref(false);
const setGroup: GroupSelectProps["onChange"] = (option) => {
  if (option) {
    group.value = {
      id: option.value,
      name: option.label,
    };
  } else {
    group.value = undefined;
  }
};

function openDialog() {
  open.value = true;
}

async function addUserToGroup() {
  if (!group.value) return;
  const { mutate } = useMutation<
    AddUserToGroupMutationResult,
    AddUserToGroupMutationVariables
  >(ADD_USER_TO_GROUP_MUTATION, {
    variables: { userId: props.user.id, groupId: group.value.id },
  });

  try {
    loading.value = true;
    await mutate();
    $q.notify({
      position: "top",
      color: "positive",
      message: "Usuário adicionado ao grupo com sucesso!",
      icon: "check",
    });
    emit("add-group", group.value);
    open.value = false;
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
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <slot name="activator" :open="openDialog" :loading="loading"></slot>
  <q-dialog v-model="open" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 q-mr-md">Adicionar usuário à grupo</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>
      <q-card-section>
        <GroupSelect label="Grupo" :on-change="setGroup" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup label="Cancelar" />
        <q-btn color="primary" label="Adicionar" @click="addUserToGroup" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
