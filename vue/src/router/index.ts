import { route } from "quasar/wrappers";
import { useAuthStore } from "src/stores/auth";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    authRequired?: boolean;
    groupRequired?: string;
  }
}

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.authRequired) {
      if (!authStore.getters.isAuthenticated()) {
        return { name: "signin" };
      }
    }
    if (to.meta.groupRequired) {
      const userIsInGroup = authStore.state.user?.groups.some(
        (group) => group.name === to.meta.groupRequired
      );
      if (!userIsInGroup) {
        return { name: "forbidden" };
      }
    }
  });

  Router.afterEach((to) => {
    if (to.meta.title) {
      document.title = `${to.meta.title} - SAAPIE`;
    } else {
      document.title = "SAAPIE";
    }
  });

  return Router;
});
