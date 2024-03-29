/* eslint-disable @typescript-eslint/no-explicit-any */
import * as _ from "lodash";
import { QTableProps, useQuasar } from "quasar";
import { TablePaginateArgs } from "src/interfaces";
import { computed, Ref, ref, watch } from "vue";

interface AdminStore<T> {
  state: {
    items: T[];
  };
  actions: {
    paginate: (paginate: TablePaginateArgs) => void;
    createItem?: (args: any) => Promise<T>;
    deleteItem?: (args: any) => Promise<T>;
    updateItem?: (args: any) => Promise<T>;
  };
}

type ExtraDataTypes =
  | string
  | number
  | boolean
  | { [key: string]: ExtraDataTypes };
type ExtraData = Ref<{ [key: string]: ExtraDataTypes }>;

interface UseCrudAdminTableArgs<T> {
  defaultItem: T;
  itemName: string;
  store: AdminStore<T>;
  extraCreateData?: ExtraData;
  extraUpdateData?: ExtraData;
  omitOnCreate?: string[];
  omitOnUpdate?: string[];
}

export function useCrudAdminTable<T extends { id: string }>({
  defaultItem,
  itemName,
  store,
  extraCreateData,
  extraUpdateData,
  omitOnCreate = [],
  omitOnUpdate = [],
}: UseCrudAdminTableArgs<T>) {
  const $q = useQuasar();
  const dialogOpen = ref(false);
  const editedIndex = ref<number>(-1);
  const editedItem = ref<T>({ ...defaultItem }) as Ref<T>;
  const itemNameLowerCase = computed(() => itemName.toLowerCase());
  const formTitle = computed(() => {
    return editedIndex.value === -1
      ? `Novo ${itemNameLowerCase.value}`
      : `Editar ${itemNameLowerCase.value}`;
  });

  const onRequest: QTableProps["onRequest"] = (requestProp) => {
    store.actions.paginate(requestProp.pagination);
  };

  watch(dialogOpen, (val) => {
    if (!val) {
      closeDialog();
    }
  });

  function openDialog() {
    dialogOpen.value = true;
  }

  function closeDialog() {
    dialogOpen.value = false;
    editedIndex.value = -1;
    editedItem.value = { ...defaultItem };
  }

  function editItem(item: T) {
    editedIndex.value = store.state.items.indexOf(item);
    editedItem.value = {
      ...defaultItem,
      ..._.pick(item, _.keys(defaultItem)),
    };
    openDialog();
  }

  function deleteItem(item: T) {
    editedIndex.value = store.state.items.indexOf(item);
    editedItem.value = {
      ...defaultItem,
      ..._.pick(item, _.keys(defaultItem)),
    };
    $q.dialog({
      title: "Confirmação",
      message: `Deseja realmente excluir o ${itemNameLowerCase.value}?`,
      ok: { label: "Ok" },
      cancel: { flat: true, label: "Cancelar" },
      persistent: true,
    }).onOk(async () => {
      if (!store.actions.deleteItem) return;
      try {
        await store.actions.deleteItem({ id: item.id });
        $q.notify({
          position: "top",
          color: "positive",
          message: `${itemName} excluído com sucesso!`,
          icon: "check",
        });
        store.state.items.splice(editedIndex.value, 1);
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

  async function save() {
    try {
      const { id, ...itemData } = editedItem.value;
      if (editedIndex.value > -1) {
        if (!store.actions.updateItem) return;
        const cleanedData = _.omit(itemData, omitOnUpdate);
        const extraData = extraUpdateData?.value || {};
        const item = await store.actions.updateItem({
          id,
          data: { ...cleanedData, ...extraData },
        });
        $q.notify({
          position: "top",
          color: "positive",
          message: `${itemName} atualizado com sucesso!`,
          icon: "check",
        });
        store.state.items[editedIndex.value] = item;
      } else {
        if (!store.actions.createItem) return;
        const cleanedData = _.omit(itemData, omitOnCreate);
        const extraData = extraCreateData?.value || {};
        const item = await store.actions.createItem({
          data: { ...cleanedData, ...extraData },
        });
        $q.notify({
          position: "top",
          color: "positive",
          message: `${itemName} criado com sucesso!`,
          icon: "check",
        });
        store.state.items.push(item);
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

  return {
    dialogOpen,
    editedIndex,
    editedItem,
    itemNameLowerCase,
    formTitle,
    onRequest,
    openDialog,
    closeDialog,
    editItem,
    deleteItem,
    save,
  };
}
