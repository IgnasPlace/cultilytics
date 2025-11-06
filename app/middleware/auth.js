export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  // Redirect logged-in users
  if (loggedIn.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/");
  }

  // Allow navigation to proceed for other cases
  return;
});
