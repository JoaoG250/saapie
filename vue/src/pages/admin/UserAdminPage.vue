<script setup lang="ts">
import UserAdminTable from "src/components/admin/UserAdminTable.vue";
import UserFilter from "../../components/admin/UserFilter.vue";
</script>

<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <UserFilter />
    </div>
    <UserAdminTable />
  </q-page>
</template>

<style scoped></style>
