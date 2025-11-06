<template>
  <div
    class="auth-img min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
      <div class="space-y-4">
        <h2 class="text-3xl font-bold text-center text-gray-600">Login</h2>
      </div>

      <form @submit.prevent="login" class="flex flex-col gap-4">
        <div class="rounded-md shadow-sm space-y-2">
          <input
            v-model="state.email"
            type="email"
            required
            placeholder="Email"
            class="login-input"
          />
        </div>

        <div class="rounded-md shadow-sm space-y-2">
          <input
            v-model="state.password"
            type="password"
            required
            placeholder="Password"
            class="login-input"
            minlength="8"
          />
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
      <div class="text-center text-sm text-gray-600">
        <p>
          Dont have an account?
          <NuxtLink to="/register" class="text-indigo-600 underline"
            >Sign up</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { loggedIn, user, fetch: refreshSession } = useUserSession();

const state = reactive({
  email: "",
  password: "",
});

async function login() {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: state,
    });

    // Refresh the session on client-side and redirect to the home page
    await refreshSession();
    await navigateTo("/");
  } catch {
    alert("Bad credentials");
  }
}
</script>
