<script setup lang="ts">
import * as _ from "lodash";
import { QTableProps, useQuasar } from "quasar";
import {
  CreateUserMutationVariables,
  DeleteUserMutationVariables,
  UpdateUserMutationVariables,
} from "src/apollo/mutations";
import { UsersQueryVariables } from "src/apollo/queries";
import { User, PageInfo } from "src/interfaces";
import { computed, onMounted, ref, watch } from "vue";

export interface AdminTableProps {
  itemName: string;
  defaultItem: User;
  columns: NonNullable<QTableProps["columns"]>;
  crud: {
    list: (
      args: UsersQueryVariables
    ) => Promise<{ items: User[]; pageInfo: PageInfo }>;
    create?: (args: CreateUserMutationVariables) => Promise<User>;
    update?: (args: UpdateUserMutationVariables) => Promise<User>;
    delete?: (args: DeleteUserMutationVariables) => Promise<User>;
  };
  itemsPerPage: number;
}

const $q = useQuasar();
const props = defineProps<AdminTableProps>();
const loading = ref(true);
const dialogOpen = ref(false);
const items = ref<User[]>([]);
const pageInfo = ref<PageInfo>({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});
const editedIndex = ref<number>(-1);
const editedItem = ref<User>({ ...props.defaultItem });

const itemNameLowerCase = computed(() => props.itemName.toLowerCase());
const formTitle = computed(() => {
  return editedIndex.value === -1
    ? `Novo ${itemNameLowerCase.value}`
    : `Editar ${itemNameLowerCase.value}`;
});
const tableColumns = computed(() => {
  if (props.crud.update || props.crud.delete) {
    return props.columns;
  }
  return props.columns.filter((column) => column.name !== "actions");
});

watch(dialogOpen, (val) => {
  if (!val) {
    closeDialog();
  }
});

onMounted(() => {
  initialize();
});

function openDialog() {
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  editedIndex.value = -1;
  editedItem.value = { ...props.defaultItem };
}

async function initialize() {
  const { items: itemsList, pageInfo: pageInfoList } = await props.crud.list({
    first: props.itemsPerPage + 1,
  });
  items.value = itemsList;
  pageInfo.value = pageInfoList;
  loading.value = false;
}

function editItem(item: User) {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = {
    ...props.defaultItem,
    ..._.pick(item, _.keys(props.defaultItem)),
  };
  openDialog();
}

function deleteItem(item: User) {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = {
    ...props.defaultItem,
    ..._.pick(item, _.keys(props.defaultItem)),
  };
  $q.dialog({
    title: "Confirmação",
    message: `Deseja realmente excluir o ${itemNameLowerCase.value}?`,
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      if (!props.crud.delete) return;
      await props.crud.delete({ id: item.id });
      items.value.splice(editedIndex.value, 1);
      closeDialog();
    })
    .onCancel(() => {
      closeDialog();
    });
}

async function save() {
  try {
    const { id, ...itemData } = editedItem.value;
    if (editedIndex.value > -1) {
      if (!props.crud.update) return;
      await props.crud.update({ id, data: itemData });
      items.value[editedIndex.value] = editedItem.value;
    } else {
      if (!props.crud.create) return;
      const item = await props.crud.create({
        data: { password: "123456", ...itemData },
      });
      items.value.push(item);
    }
    closeDialog();
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
  <div class="q-pa-md">
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-mr-md">{{ formTitle }}</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </q-card-section>
        <q-card-section>
          <q-input v-model="editedItem.firstName" label="Nome" />
          <q-input v-model="editedItem.lastName" label="Sobrenome" />
          <q-input v-model="editedItem.email" label="Email" />
          <div class="q-mt-sm">
            <q-checkbox
              v-model="editedItem.isActive"
              class="q-mr-sm"
              label="Ativo"
            />
            <q-checkbox v-model="editedItem.isVerified" label="Verificado" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="closeDialog" />
          <q-btn color="primary" label="Salvar" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      :loading="loading"
      :rows="items"
      :columns="tableColumns"
      row-key="name"
    >
      <template #top>
        <div class="q-table__title">{{ itemName }}</div>
        <q-space />
        <q-btn
          v-if="crud.create"
          :label="`Novo ${itemNameLowerCase}`"
          icon="add"
          color="primary"
          @click="openDialog"
        />
      </template>
      <template #body-cell-actions="slotItem">
        <q-td :props="slotItem">
          <q-btn
            v-if="crud.update"
            round
            icon="edit"
            size="xs"
            @click="editItem(slotItem.row)"
          />
          <q-btn
            v-if="crud.delete"
            class="q-ml-sm"
            round
            icon="delete"
            size="xs"
            @click="deleteItem(slotItem.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style scoped></style>
