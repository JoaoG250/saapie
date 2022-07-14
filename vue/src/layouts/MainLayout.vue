<script setup lang="ts">
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const menuList = [
  {
    icon: "account_tree",
    label: "Processos",
    to: { name: "processes" },
  },
  {
    icon: "assignment",
    label: "Requisições",
    to: { name: "process-requests" },
  },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
async function handleSignout() {
  await authStore.actions.signout();
  await router.push({ name: "signin" });
}
</script>

<template>
  <q-layout view="hHh LpR lfr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <router-link :to="{ name: 'index' }">SAAPIE</router-link>
        </q-toolbar-title>

        <q-tabs>
          <template v-for="(item, index) in menuList" :key="index">
            <q-route-tab :label="item.label" :to="item.to" exact />
          </template>
        </q-tabs>

        <q-btn
          v-if="authStore.state.user"
          class="q-ml-md"
          color="primary"
          icon="menu"
          :label="authStore.state.user.firstName"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item v-close-popup clickable :to="{ name: 'admin' }">
                <q-item-section>
                  <div class="row justify-between items-center">
                    Admin
                    <q-icon name="local_police" size="1.2rem" />
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-close-popup clickable @click="handleSignout">
                <q-item-section>
                  <div class="row justify-between items-center">
                    Sair
                    <q-icon name="logout" size="1.2rem" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          v-else
          :to="{ name: 'signin' }"
          icon="login"
          color="secondary"
          label="Autenticar"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
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
