<script setup>
const { loggedIn, user, clear: clearSession } = useUserSession();

const isDropdownOpen = ref(false);
const showSettingsModal = ref(false);
const dropdownRef = ref(null);

async function logout() {
  await clearSession();
  isDropdownOpen.value = false;
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function openSettings() {
  showSettingsModal.value = true;
  isDropdownOpen.value = false;
}

function closeSettings() {
  showSettingsModal.value = false;
}

// Close dropdown when clicking outside
onMounted(() => {
  function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  }

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

<template>
  <div ref="dropdownRef" class="absolute top-3 right-3 z-10">
    <!-- Logged in: User trigger with dropdown -->
    <div v-if="loggedIn">
      <!-- Trigger -->
      <div
        @click="toggleDropdown"
        class="bg-white rounded-md shadow-md px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <IconsIconUser size="sm" class="text-gray-600" />
        <span class="text-sm font-medium text-gray-800">{{ user?.name }}</span>
      </div>

      <!-- Dropdown menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute top-full right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden"
      >
        <button
          @click="openSettings"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Settings
        </button>
        <button
          @click="logout"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Logged out: Login button -->
    <div v-else>
      <NuxtLink
        to="/login"
        class="bg-white rounded-md shadow-md px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm"
        >Login</NuxtLink
      >
    </div>

    <!-- Settings Modal -->
    <AtomsModal
      :is-open="showSettingsModal"
      title="Settings"
      @close="closeSettings"
    >
      <div class="p-4 space-y-4">
        <p class="text-gray-600 text-sm">Settings panel coming soon...</p>
        <AtomsButton variant="primary" size="sm" @click="closeSettings">
          Close
        </AtomsButton>
      </div>
    </AtomsModal>
  </div>
</template>
