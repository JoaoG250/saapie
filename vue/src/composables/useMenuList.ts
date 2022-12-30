import { useAuthStore } from "src/stores/auth";

export function useMenuList() {
  const authStore = useAuthStore();
  const menuList = [
    {
      icon: "category",
      label: "Categorias",
      to: { name: "process-categories" },
    },
    {
      icon: "account_tree",
      label: "Processos",
      to: { name: "processes" },
    },
    {
      icon: "assignment",
      label: "Meus Pedidos",
      to: { name: "process-requests" },
    },
  ];

  if (authStore.state.user && authStore.state.user.groups.length) {
    menuList.push({
      icon: "mail",
      label: "Pedidos atribuídos",
      to: { name: "process-request-manage" },
    });
  }

  return menuList;
}
