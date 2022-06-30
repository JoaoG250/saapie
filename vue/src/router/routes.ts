import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "signin",
        name: "signin",
        component: () => import("pages/auth/SigninPage.vue"),
      },
      {
        path: "signup",
        name: "signup",
        component: () => import("pages/auth/SignupPage.vue"),
      },
      {
        path: "activate-account/:token",
        name: "activate-account",
        component: () => import("pages/auth/ActivateAccountPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
