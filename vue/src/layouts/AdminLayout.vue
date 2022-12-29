<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "src/components/AppHeader.vue";

const leftDrawerOpen = ref(false);
const miniState = ref(false);
const menuList = [
  {
    icon: "person",
    label: "Usuário",
    to: { name: "admin:user" },
  },
  {
    icon: "group",
    label: "Grupo",
    to: { name: "admin:group" },
  },
  {
    icon: "work",
    label: "Processo",
    to: { name: "admin:process" },
  },
  {
    icon: "assignment",
    label: "Pedido de abertura de processo",
    to: { name: "admin:process-request" },
  },
  {
    icon: "category",
    label: "Categoria de processo",
    to: { name: "admin:process-category" },
  },
];

function toggleMini() {
  miniState.value = !miniState.value;
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggle() {
  if (!leftDrawerOpen.value) {
    miniState.value = false;
    toggleLeftDrawer();
  } else {
    toggleMini();
  }
}
</script>

<template>
  <q-layout view="hHh LpR fff">
    <AppHeader :toggle-left-drawer="toggle" />

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      show-if-above
      side="left"
      bordered
    >
      <q-list>
        <template v-for="(item, index) in menuList" :key="index">
          <q-item :to="item.to" exact clickable>
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style lang="scss" scoped>
.q-toolbar__title {
  a,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: inherit;
  }
}
</style>
