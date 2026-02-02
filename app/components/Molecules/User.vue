<script setup>
const { loggedIn, user, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  // await navigateTo("/login");
}
</script>

<template>
  <div
    class="card max-w-24 p-2 mx-auto absolute top-3 right-3 bg-white rounded-md"
  >
    <div v-if="loggedIn">
      <h1>{{ user.name }}</h1>
      <button
        @click="logout"
        class="bg-blue-500 mt-2 text-white text-center py-1 px-2 rounded-md cursor-pointer"
      >
        Logout
      </button>
    </div>
    <div v-else>
      <NuxtLink to="/login">Login</NuxtLink>
    </div>
  </div>
</template>
