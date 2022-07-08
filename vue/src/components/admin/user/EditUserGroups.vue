<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import { Group, User } from "src/interfaces";
import {
  GET_USER_GROUPS_QUERY,
  GetUserGroupsQueryResult,
  GetUserGroupsQueryVariables,
} from "src/apollo/queries";
import { ref } from "vue";
import { QTableProps, useQuasar } from "quasar";
import {
  RemoveUserFromGroupMutationResult,
  RemoveUserFromGroupMutationVariables,
  REMOVE_USER_FROM_GROUP_MUTATION,
} from "src/apollo/mutations";
import AddUserToGroupDialog from "./AddUserToGroupDialog.vue";

interface EditUserProps {
  user: User;
}

const props = defineProps<EditUserProps>();
const $q = useQuasar();
const groups = ref<Group[]>([]);
const columns: NonNullable<QTableProps["columns"]> = [
  {
    name: "name",
    label: "Nome",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "actions",
    label: "Ações",
    align: "right",
    field: () => {
      return;
    },
  },
];
const { onResult, loading } = useQuery<
  GetUserGroupsQueryResult,
  GetUserGroupsQueryVariables
>(
  GET_USER_GROUPS_QUERY,
  { id: props.user.id },
  { fetchPolicy: "network-only" }
);
onResult((result) => {
  groups.value = result.data.user.groups;
});

function addGroup(group: Group) {
  groups.value = [...groups.value, group];
}

async function removeUserFromGroup(group: Group) {
  const { mutate } = useMutation<
    RemoveUserFromGroupMutationResult,
    RemoveUserFromGroupMutationVariables
  >(REMOVE_USER_FROM_GROUP_MUTATION, {
    variables: { userId: props.user.id, groupId: group.id },
  });
  $q.dialog({
    title: "Confirmação",
    message: "Deseja realmente remover o usuário do grupo?",
    ok: { label: "Ok" },
    cancel: { flat: true, label: "Cancelar" },
    persistent: true,
  }).onOk(async () => {
    try {
      await mutate();
      $q.notify({
        position: "top",
        color: "positive",
        message: "Usuário removido do grupo com sucesso!",
        icon: "check",
      });
      groups.value = groups.value.filter((g) => g.id !== group.id);
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
  });
}
</script>

<template>
  <AddUserToGroupDialog :user="props.user" @add-group="addGroup">
    <template #activator="{ open, loading: addUserToGroupLoading }">
      <q-btn
        :loading="addUserToGroupLoading"
        class="q-mb-sm full-width"
        color="primary"
        label="Adicionar à grupo"
        @click="open"
      />
    </template>
  </AddUserToGroupDialog>
  <q-table
    :loading="loading"
    :rows="groups"
    :columns="columns"
    loading-label="Carregando..."
    row-key="name"
    no-data-label="Nenhum grupo encontrado"
  >
    <template #body-cell-actions="slotItem">
      <q-td :props="slotItem">
        <q-btn
          class="q-ml-sm"
          round
          icon="delete"
          size="xs"
          @click="removeUserFromGroup(slotItem.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
