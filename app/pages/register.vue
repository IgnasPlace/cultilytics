<template>
  <div
    class="register-bg min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full space-y-8 bg-gray-800 text-gray-300 rounded-xl shadow-lg p-8"
    >
      <!-- <div class="space-y-4">
        <h2 class="text-3xl font-bold text-center">Register</h2>
      </div> -->

      <div class="space-y-4">
        <h3 class="text-base text-center">
          Direct registration is not supported right now. We apologize for the
          inconvenience
        </h3>
        <p class="text-sm text-center">
          Please contact Customer Service to create a new account
        </p>
      </div>

      <!-- <form @submit.prevent="register" class="flex flex-col gap-4">
        <div class="rounded-md shadow-sm space-y-2">
          <input
            v-model="state.name"
            type="text"
            required
            placeholder="Name *"
            class="login-input"
          />
        </div>

        <div class="rounded-md shadow-sm space-y-2">
          <input
            v-model="state.email"
            type="email"
            required
            placeholder="Email *"
            class="login-input"
          />
        </div>

        <div class="rounded-md shadow-sm space-y-2">
          <input
            v-model="state.password"
            type="password"
            required
            placeholder="Password *"
            class="login-input"
            minlength="8"
          />
        </div>

        <div class="rounded-md shadow-sm space-y-2">
          <input
            v-model="state.passwordConfirm"
            type="password"
            required
            placeholder="Confirm password *"
            class="login-input"
            minlength="8"
          />
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </form> -->
      <div class="text-center text-sm">
        <p>
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-fuchsia-400 hover:text-fuchsia-300 underline"
            >Login</NuxtLink
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

const toast = useToast();

const { loggedIn, user, fetch: refreshSession } = useUserSession();

const state = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

async function register() {
  if (state.password !== state.passwordConfirm) {
    toast.error({
      title: "Error",
      message: "Password fields must be the same",
      position: "topCenter",
    });
    return;
  }
  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: state.name,
        email: state.email,
        password: state.password,
      },
    });

    if (!response.success) {
      throw new Error("Registration error");
    }
    // Refresh the session on client-side and redirect to the home page
    await refreshSession();
    await navigateTo("/");
  } catch (err) {
    toast.error({
      title: "Error",
      message: "Registration error",
      position: "topCenter",
    });
  }
}
</script>
