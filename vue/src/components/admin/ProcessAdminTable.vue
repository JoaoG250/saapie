<script setup lang="ts">
import { QTableProps } from "quasar";
import { Process, SelectOption } from "src/interfaces";
import { computed, ref, watch } from "vue";
import { useCrudAdminTable } from "src/composables";
import { processRules } from "src/validation/process";
import { useProcessStore } from "src/stores/process";
import GroupSelect, { GroupSelectProps } from "./GroupSelect.vue";
import { cannotMatch } from "src/validation";

const itemName = "Processo";
const defaultItem: Process = {
  id: "",
  name: "",
  slug: "",
  description: "",
  targetGroupId: "",
  forwardToGroupId: undefined,
  form: {
    id: "",
    name: "",
    definition: {},
  },
  targetGroup: {
    id: "",
    name: "",
  },
  forwardToGroup: {
    id: "",
    name: "",
  },
};
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

const processStore = useProcessStore();
const extraData = ref({
  form: {
    name: "",
    definition: "",
  },
});
const {
  dialogOpen,
  loading,
  editedIndex,
  editedItem,
  openDialog,
  closeDialog,
  editItem,
  deleteItem,
  save,
} = useCrudAdminTable<Process>({
  itemName: itemName,
  defaultItem: defaultItem,
  store: processStore,
  extraCreateData: extraData,
  extraUpdateData: extraData,
  omitOnSave: ["slug", "targetGroup", "forwardToGroup"],
});

const forwardFor = ref(!!editedItem.value.forwardToGroupId);
const showForwardFor = computed(() => {
  return !!editedItem.value.forwardToGroupId || forwardFor.value;
});
const itemNameLowerCase = computed(() => itemName.toLowerCase());
const formTitle = computed(() => {
  return editedIndex.value === -1
    ? `Novo ${itemNameLowerCase.value}`
    : `Editar ${itemNameLowerCase.value}`;
});
const forwardToGroupRules = [
  (value: SelectOption | null) =>
    cannotMatch({
      value: value?.value,
      target: editedItem.value.targetGroupId,
      valueLabel: "Grupo de encaminhamento",
      targetLabel: "Grupo de destino",
    }),
];

watch(editedItem, (item) => {
  extraData.value.form = {
    name: item.form.name,
    definition: JSON.stringify(item.form.definition),
  };
});

watch(forwardFor, (val) => {
  if (!val) {
    if (
      typeof editedItem.value.forwardToGroupId === "string" &&
      editedItem.value.forwardToGroupId.length === 0
    ) {
      editedItem.value.forwardToGroupId = undefined;
    }
  }
});

const onRequest: QTableProps["onRequest"] = (requestProp) => {
  processStore.actions.paginate(requestProp.pagination);
};

const setTargetGroup: GroupSelectProps["onChange"] = (option) => {
  if (option) {
    editedItem.value.targetGroupId = option.value;
  } else {
    editedItem.value.targetGroupId = "";
  }
};

const setForwardToGroup: GroupSelectProps["onChange"] = (option) => {
  if (option) {
    editedItem.value.forwardToGroupId = option.value;
  } else {
    editedItem.value.forwardToGroupId = undefined;
  }
};
</script>

<template>
  <div class="q-pa-md">
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 400px">
        <q-form @submit="save">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 q-mr-md">{{ formTitle }}</div>
            <q-space />
            <q-btn flat round dense icon="close" @click="closeDialog" />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="editedItem.name"
              label="Nome"
              :rules="processRules.name"
            />
            <q-input
              v-model="editedItem.description"
              label="Descrição"
              type="textarea"
              :rules="processRules.description"
            />
            <GroupSelect
              label="Grupo alvo"
              :on-change="setTargetGroup"
              :rules="processRules.targetGroup"
            />
            <q-input
              v-model="extraData.form.name"
              label="Nome do formulário"
              :rules="processRules.form.name"
            />
            <q-input
              v-model="extraData.form.definition"
              label="Definição do formulário"
              type="textarea"
              :rules="processRules.form.definition"
            />
            <q-toggle
              v-model="forwardFor"
              class="q-mt-md"
              label="Emcaminhar para grupo?"
            />
            <GroupSelect
              v-if="showForwardFor"
              label="Grupo de encaminhamento"
              :on-change="setForwardToGroup"
              :rules="forwardToGroupRules"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn label="Cancelar" @click="closeDialog" />
            <q-btn color="primary" label="Salvar" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-table
      :loading="loading"
      :rows="processStore.state.items"
      :columns="columns"
      row-key="name"
      @request="onRequest"
    >
      <template #top>
        <div class="q-table__title">{{ itemName }}</div>
        <q-space />
        <q-btn
          :label="`Novo ${itemNameLowerCase}`"
          icon="add"
          color="primary"
          @click="openDialog"
        />
      </template>
      <template #body-cell-actions="slotItem">
        <q-td :props="slotItem">
          <q-btn round icon="edit" size="xs" @click="editItem(slotItem.row)" />
          <q-btn
            class="q-ml-sm"
            round
            icon="delete"
            size="xs"
            @click="deleteItem(slotItem.row)"
          />
        </q-td>
      </template>
      <template #pagination="scope">
        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />
        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />
      </template>
    </q-table>
  </div>
</template>

<style scoped></style>
