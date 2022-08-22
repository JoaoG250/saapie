<script setup lang="ts">
import { useMenuList } from "src/composables";
import { useAuthStore } from "src/stores/auth";
import { useRouter, RouterLink } from "vue-router";
import { userIsAdmin } from "src/common/permissions";

interface AppHeaderProps {
  toggleLeftDrawer: () => void;
}

defineProps<AppHeaderProps>();
const authStore = useAuthStore();
const router = useRouter();
const menuList = useMenuList();

async function handleSignout() {
  await authStore.actions.signout();
  await router.push({ name: "signin" });
}
</script>

<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title>
        <router-link :to="{ name: 'index' }">SAAPIE</router-link>
      </q-toolbar-title>

      <q-tabs class="show-desktop-only">
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
            <q-item
              v-if="userIsAdmin(authStore.state.user.groups)"
              v-close-popup
              clickable
              :to="{ name: 'admin' }"
            >
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
