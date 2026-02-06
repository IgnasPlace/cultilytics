<template>
  <!-- Idle State -->
  <div
    v-if="addMarkerMode === 'off'"
    class="absolute top-3 left-3 z-10 bg-white rounded-md shadow-md px-3 py-2"
  >
    <button
      class="text-sm text-gray-700 hover:text-gray-900 transition-colors"
      @click="() => markerStore.setActivateAddMarkerMode('add')"
    >
      <span class="text-primary font-bold">+</span> Add new
      <span v-if="isMac" class="text-gray-400 ml-2 text-xs">⌘+A</span>
    </button>
  </div>

  <!-- Add Mode Banner -->
  <div
    v-else-if="addMarkerMode === 'add'"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
  >
    <div
      class="bg-white/85 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200/50 flex items-center gap-3"
    >
      <p class="text-sm font-medium whitespace-nowrap">
        Click on the map to add marker
      </p>
      <button
        @click="cancelHandler"
        class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Cancel"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Form Modal -->
  <AtomsModal
    v-else-if="addMarkerMode === 'selected'"
    :is-open="true"
    title="New Marker"
    @close="cancelHandler"
  >
    <div class="w-full max-w-md">
      <form @submit.prevent="submitSaveMarker" class="space-y-4 p-4">
        <AtomsFormInput
          v-model="inputs.name"
          label="Name"
          placeholder="Enter marker name"
          required
        />
        <AtomsFormInput
          v-model="inputs.id"
          label="Marker ID"
          placeholder="Enter unique marker ID"
          required
        />
        <AtomsFormSelect
          v-model="inputs.type"
          label="Type"
          :options="typeOptions"
          placeholder="Select type"
          required
        />

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <div class="flex gap-3 pt-2">
          <AtomsButton
            variant="outline"
            class="flex-1"
            :disabled="loading"
            @click="cancelHandler"
          >
            Cancel
          </AtomsButton>
          <AtomsButton
            type="submit"
            variant="primary"
            class="flex-1"
            :loading="loading"
          >
            Save
          </AtomsButton>
        </div>
      </form>
    </div>
  </AtomsModal>
</template>

<script setup>
import { COLORS } from "@/config/colors";

const markerStore = useStore("markers");
const { addMarkerMode, currentUnsavedMarker } = storeToRefs(markerStore);

const typeOptions = [
  { value: "tree", label: "Tree" },
  { value: "other", label: "Other" },
];

const loading = ref(false);
const error = ref("");
const inputs = reactive({
  name: "",
  id: "",
  type: typeOptions[0].value,
});

const isMac = ref(false);
onMounted(() => {
  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "a") {
      if (addMarkerMode.value === "off") {
        e.preventDefault();
        markerStore.setActivateAddMarkerMode("add");
      }
    }
  }
  document.addEventListener("keydown", handleKeyDown);

  const userAgent = window.navigator.userAgent;
  const isMacLike = /Mac|Macintosh/.test(userAgent);
  const isNotTouch = navigator.maxTouchPoints === 0;

  isMac.value = isMacLike && isNotTouch;
});

const cancelHandler = () => {
  if (currentUnsavedMarker.value) {
    markerStore.setCurrentUnsavedMarker(null);
  }
  markerStore.setActivateAddMarkerMode("off");
  resetInputs();
};

const submitSaveMarker = async () => {
  const body = {
    id: inputs.id,
    lng: currentUnsavedMarker.value.lng,
    lat: currentUnsavedMarker.value.lat,
    type: inputs.type,
    color: COLORS.MARKER,
    name: inputs.name,
  };
  try {
    loading.value = true;
    await useSaveNewMarker(body);
    resetInputs();
    loading.value = false;
  } catch (err) {
    console.log(err);
    loading.value = false;
  }
};

const resetInputs = () => {
  inputs.name = "";
  inputs.id = "";
  inputs.type = "tree";
  error.value = "";
};
</script>
