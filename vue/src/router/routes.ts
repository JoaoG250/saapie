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
      {
        path: "/processes",
        name: "processes",
        component: () => import("pages/process/ProcessesPage.vue"),
      },
      {
        path: "/processes/:slug",
        name: "process",
        component: () => import("pages/process/ProcessPage.vue"),
      },
      {
        path: "/processes/requests",
        name: "process-requests",
        component: () => import("pages/process/ProcessRequestsPage.vue"),
      },
      {
        path: "/processes/requests/:id",
        name: "process-request",
        component: () => import("pages/process/ProcessRequestPage.vue"),
      },
    ],
    meta: {
      authRequired: true,
    },
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
      {
        path: "reset-password/:token",
        name: "reset-password",
        component: () => import("pages/auth/ResetPasswordPage.vue"),
      },
    ],
  },

  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "admin",
        component: () => import("pages/admin/AdminPage.vue"),
      },
      {
        path: "user",
        name: "admin:user",
        component: () => import("pages/admin/UserAdminPage.vue"),
      },
      {
        path: "group",
        name: "admin:group",
        component: () => import("pages/admin/GroupAdminPage.vue"),
      },
      {
        path: "process",
        name: "admin:process",
        component: () => import("pages/admin/ProcessAdminPage.vue"),
      },
      {
        path: "process-request",
        name: "admin:process-request",
        component: () => import("pages/admin/ProcessRequestAdminPage.vue"),
      },
    ],
    meta: {
      authRequired: true,
      groupRequired: "ADMINISTRATORS",
    },
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    name: "forbidden",
    component: () => import("pages/ErrorForbidden.vue"),
  },
];

export default routes;
