<script setup lang="ts">
import {
  QTableProps,
  useQuasar,
  GlobalComponentConstructor,
  QEditorProps,
  QEditorSlots as QuasarEditorSlots,
  QEditor as QuasarEditor,
} from "quasar";
import { Process, SelectOption } from "src/interfaces";
import { computed, ref, watch, VNode } from "vue";
import { useCrudAdminTable } from "src/composables";
import { processRules } from "src/validation/process";
import { useProcessStore } from "src/stores/process";
import GroupSelect, {
  GroupSelectProps,
} from "components/admin/group/GroupSelect.vue";
import { cannotMatch } from "src/validation";

interface QEditorSlots extends QuasarEditorSlots {
  count: () => VNode;
}
type QEditorType = GlobalComponentConstructor<QEditorProps, QEditorSlots>;

const QEditor = QuasarEditor as unknown as QEditorType;
const $q = useQuasar();
const itemName = "Processo";
const defaultItem: Process = {
  id: "",
  name: "",
  slug: "",
  description: "",
  active: true,
  targetGroupId: "",
  forwardToGroupId: undefined,
  form: {
    id: "",
    name: "",
    definition: [],
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
const toolbar = [
  ["undo", "redo"],
  [
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: "no-icons",
      options: [
        "size-1",
        "size-2",
        "size-3",
        "size-4",
        "size-5",
        "size-6",
        "size-7",
      ],
    },
  ],
  [
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: "only-icons",
      options: ["left", "center", "right", "justify"],
    },
  ],
  ["bold", "italic", "strike", "underline", "quote"],
  ["token", "hr", "link"],
  ["unordered", "ordered", "outdent", "indent"],
  ["removeFormat", "fullscreen"],
  ["count"],
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
  editedItem,
  editedIndex,
  itemNameLowerCase,
  formTitle,
  onRequest,
  openDialog,
  closeDialog,
  editItem,
  deleteItem,
  save,
} = useCrudAdminTable<Process>({
  itemName,
  defaultItem: defaultItem,
  store: processStore,
  extraCreateData: extraData,
  extraUpdateData: extraData,
  omitOnCreate: ["slug", "active", "targetGroup", "forwardToGroup"],
  omitOnUpdate: ["slug", "targetGroup", "forwardToGroup"],
});

const forwardFor = ref(!!editedItem.value.forwardToGroupId);
const showForwardFor = computed(() => {
  return !!editedItem.value.forwardToGroupId || forwardFor.value;
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
    definition: JSON.stringify(item.form.definition, undefined, 2),
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

const targetGroupInitial = computed(() => {
  if (editedItem.value.targetGroup.id) {
    return {
      label: editedItem.value.targetGroup.name,
      value: editedItem.value.targetGroup.id,
    };
  }
  return undefined;
});
const forwardToGroupInitial = computed(() => {
  if (editedItem.value.forwardToGroup?.id) {
    return {
      label: editedItem.value.forwardToGroup.name,
      value: editedItem.value.forwardToGroup.id,
    };
  }
  return undefined;
});
const descriptionError = computed(() => {
  let error = "";
  for (const fn of processRules.description) {
    const validation = fn(editedItem.value.description);
    if (typeof validation === "string") {
      error = validation;
      break;
    }
  }
  return error;
});
</script>

<template>
  <q-dialog v-model="dialogOpen" maximized persistent>
    <q-card>
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
          <q-banner
            v-if="descriptionError"
            class="text-white bg-red q-mt-sm"
            rounded
          >
            <template #avatar>
              <q-icon name="error" color="white" />
            </template>
            {{ descriptionError }}
          </q-banner>
          <q-editor
            v-model="editedItem.description"
            placeholder="Descrição"
            min-height="15rem"
            class="q-mt-sm"
            :toolbar="toolbar"
          >
            <template #count>
              <q-chip square>{{ editedItem.description.length }}/4000</q-chip>
            </template>
          </q-editor>
          <GroupSelect
            label="Grupo alvo"
            :on-change="setTargetGroup"
            :rules="processRules.targetGroup"
            :initial-selected="targetGroupInitial"
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
            rows="15"
            :rules="processRules.form.definition"
          />
          <q-toggle
            v-if="editedIndex > -1"
            v-model="editedItem.active"
            class="q-mt-md"
            label="Processo ativo?"
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
            :initial-selected="forwardToGroupInitial"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="closeDialog" />
          <q-btn
            :loading="processStore.loading"
            color="primary"
            label="Salvar"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-table
    v-model:pagination="processStore.state.pagination"
    :loading="processStore.loading"
    :rows="processStore.state.items"
    :columns="columns"
    :no-data-label="`Nenhum ${itemNameLowerCase} encontrado`"
    loading-label="Carregando..."
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
</template>

<style scoped></style>
