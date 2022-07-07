import * as _ from "lodash";
import { QTableProps, useQuasar } from "quasar";
import { computed, Ref, ref, watch } from "vue";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface AdminStore<T> {
  state: {
    items: T[];
  };
  actions: {
    paginate: (paginate: {
      sortBy: string;
      descending: boolean;
      page: number;
      rowsPerPage: number;
    }) => void;
    createItem?: (args: any) => Promise<T>;
    deleteItem?: (args: any) => Promise<T>;
    updateItem?: (args: any) => Promise<T>;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
  omitOnSave?: string[];
}

export function useCrudAdminTable<T extends { id: string }>({
  defaultItem,
  itemName,
  store,
  extraCreateData,
  extraUpdateData,
  omitOnSave = [],
}: UseCrudAdminTableArgs<T>) {
  const $q = useQuasar();
  const loading = ref(false);
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
      cancel: true,
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
      const cleanedData = _.omit(itemData, omitOnSave);
      if (editedIndex.value > -1) {
        if (!store.actions.updateItem) return;
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
    loading,
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
