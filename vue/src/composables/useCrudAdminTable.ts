import * as _ from "lodash";
import { useQuasar } from "quasar";
import { PageInfo, PaginationArgs } from "src/interfaces";
import { onMounted, Ref, ref, watch } from "vue";

type ExtraDataTypes =
  | string
  | number
  | boolean
  | { [key: string]: ExtraDataTypes };
type ExtraData = Ref<{ [key: string]: ExtraDataTypes }>;

interface UseCrudAdminTableArgs<T> {
  defaultItem: T;
  itemName: string;
  crud: {
    list: (args: PaginationArgs) => Promise<{ items: T[]; pageInfo: PageInfo }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create?: (args: { data: any }) => Promise<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update?: (args: { id: string; data: any }) => Promise<T>;
    delete?: (args: { id: string }) => Promise<T>;
  };
  itemsPerPage: number;
  extraCreateData?: ExtraData;
  extraUpdateData?: ExtraData;
  stripFields?: string[];
}

export function useCrudAdminTable<T extends { id: string }>({
  defaultItem,
  itemName,
  crud,
  itemsPerPage,
  extraCreateData,
  extraUpdateData,
  stripFields = [],
}: UseCrudAdminTableArgs<T>) {
  const $q = useQuasar();
  const loading = ref(true);
  const dialogOpen = ref(false);
  const items = ref<T[]>([]) as Ref<T[]>;
  const pageInfo = ref<PageInfo>({
    startCursor: "",
    endCursor: "",
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const editedIndex = ref<number>(-1);
  const editedItem = ref<T>({ ...defaultItem }) as Ref<T>;

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
    editedItem.value = { ...defaultItem };
  }

  async function initialize() {
    const { items: itemsList, pageInfo: pageInfoList } = await crud.list({
      first: itemsPerPage + 1,
    });
    items.value = itemsList;
    pageInfo.value = pageInfoList;
    loading.value = false;
  }

  function editItem(item: T) {
    editedIndex.value = items.value.indexOf(item);
    editedItem.value = {
      ...defaultItem,
      ..._.pick(item, _.keys(defaultItem)),
    };
    openDialog();
  }

  function deleteItem(item: T) {
    editedIndex.value = items.value.indexOf(item);
    editedItem.value = {
      ...defaultItem,
      ..._.pick(item, _.keys(defaultItem)),
    };
    $q.dialog({
      title: "Confirmação",
      message: `Deseja realmente excluir o ${itemName.toLowerCase()}?`,
      cancel: true,
      persistent: true,
    })
      .onOk(async () => {
        if (!crud.delete) return;
        await crud.delete({ id: item.id });
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
      const cleanedData = _.omit(itemData, stripFields);
      if (editedIndex.value > -1) {
        if (!crud.update) return;
        const extraData = extraUpdateData?.value || {};
        const item = await crud.update({
          id,
          data: { ...cleanedData, ...extraData },
        });
        items.value[editedIndex.value] = item;
      } else {
        if (!crud.create) return;
        const extraData = extraCreateData?.value || {};
        const item = await crud.create({
          data: { ...cleanedData, ...extraData },
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

  return {
    loading,
    dialogOpen,
    items,
    pageInfo,
    editedIndex,
    editedItem,
    openDialog,
    closeDialog,
    editItem,
    deleteItem,
    save,
  };
}
