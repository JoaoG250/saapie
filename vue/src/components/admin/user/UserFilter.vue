<script setup lang="ts">
import { reactive } from "vue";
import { useUserStore } from "stores/user";
import { UserWhereInput } from "src/interfaces";

const userStore = useUserStore();
const userFilter = reactive<UserWhereInput>({
  email: "",
});

function filter() {
  userStore.actions.filter(userFilter);
}
</script>

<template>
  <q-form class="row q-col-gutter-sm" @submit="filter">
    <div class="col-12 col-sm-9">
      <q-input v-model="userFilter.email" label="Email" outlined />
    </div>
    <div class="col-12 col-sm-3">
      <q-btn
        class="full-width full-height"
        label="Buscar"
        type="submit"
        icon="search"
        push
      />
    </div>
  </q-form>
</template>

<style scoped></style>
