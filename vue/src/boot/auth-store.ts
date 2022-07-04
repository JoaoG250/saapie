import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/auth";

export default boot(async () => {
  const authStore = useAuthStore();
  if (authStore.getters.isAuthenticated()) {
    try {
      await authStore.actions.fetchUser();
    } catch (err) {
      authStore.actions.signout();
    }
  }
});
