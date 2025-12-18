import { useUserStore } from "@/stores/useUserStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, user } = useUserSession();

  if (loggedIn.value) {
    useUserStore().setUser(user);

    if (to.path === "/login" || to.path === "/register") {
      return navigateTo("/");
    }
  }
  return;
});
