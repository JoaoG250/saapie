import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/auth";

export default boot(async () => {
  const authStore = useAuthStore();
  if (authStore.getters.isAuthenticated()) {
    await authStore.actions.fetchUser();
  }
});
