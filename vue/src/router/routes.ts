import { userIsAdmin } from "src/common/permissions";
import { useAuthStore } from "src/stores/auth";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        redirect: () => {
          const authStore = useAuthStore();
          const groups = authStore.state.user?.groups;
          if (groups && groups.length) {
            if (userIsAdmin(groups)) {
              return { name: "admin" };
            }
            return { name: "process-request-manage" };
          }
          return { name: "process-categories" };
        },
      },
      {
        path: "/process-categories",
        name: "process-categories",
        component: () => import("pages/process/ProcessCategoriesPage.vue"),
        meta: {
          title: "Categorias de processos",
        },
      },
      {
        path: "/processes",
        name: "processes",
        component: () => import("pages/process/ProcessesPage.vue"),
        meta: {
          title: "Processos",
        },
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
        meta: {
          title: "Meus Pedidos",
        },
      },
      {
        path: "/processes/requests/:id",
        name: "process-request",
        component: () => import("pages/process/ProcessRequestPage.vue"),
      },
      {
        path: "/processes/requests/manage",
        name: "process-request-manage",
        component: () => import("pages/process/ManageProcessRequestsPage.vue"),
        meta: {
          title: "Gerenciar Pedidos",
        },
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
        meta: {
          title: "Autenticação",
        },
      },
      {
        path: "signup",
        name: "signup",
        component: () => import("pages/auth/SignupPage.vue"),
        meta: {
          title: "Cadastro",
        },
      },
      {
        path: "activate-account/:token",
        name: "activate-account",
        component: () => import("pages/auth/ActivateAccountPage.vue"),
        meta: {
          title: "Ativação de Conta",
        },
      },
      {
        path: "reset-password/:token",
        name: "reset-password",
        component: () => import("pages/auth/ResetPasswordPage.vue"),
        meta: {
          title: "Redefinição de Senha",
        },
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
        meta: {
          title: "Administração",
        },
      },
      {
        path: "user",
        name: "admin:user",
        component: () => import("pages/admin/UserAdminPage.vue"),
        meta: {
          title: "Administrar Usuários",
        },
      },
      {
        path: "group",
        name: "admin:group",
        component: () => import("pages/admin/GroupAdminPage.vue"),
        meta: {
          title: "Administrar Grupos",
        },
      },
      {
        path: "process",
        name: "admin:process",
        component: () => import("pages/admin/ProcessAdminPage.vue"),
        meta: {
          title: "Administrar Processos",
        },
      },
      {
        path: "process-request",
        name: "admin:process-request",
        component: () => import("pages/admin/ProcessRequestAdminPage.vue"),
        meta: {
          title: "Administrar Pedidos de abertura de processo",
        },
      },
      {
        path: "process-category",
        name: "admin:process-category",
        component: () => import("pages/admin/ProcessCategoryAdminPage.vue"),
        meta: {
          title: "Administrar Categorias de processos",
        },
      },
    ],
    meta: {
      authRequired: true,
      groupRequired: "ADMINISTRATORS",
    },
  },

  {
    path: "/:catchAll(.*)*",
    name: "not-found",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    name: "forbidden",
    component: () => import("pages/ErrorForbidden.vue"),
  },
];

export default routes;
