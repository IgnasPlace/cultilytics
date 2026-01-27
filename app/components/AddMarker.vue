<template>
  <div
    v-if="loading"
    class="fixed z-50 bg-[#d6d6d69c] inset-0 flex items-center justify-center"
  >
    <AtomsSpinner />
  </div>
  <div class="absolute top-3 left-3 text-xs z-10 bg-white p-2 rounded-md">
    <button
      v-if="addMarkerMode === 'off'"
      class=""
      @click="() => markerStore.setActivateAddMarkerMode('add')"
    >
      <span class="text-green-600">+</span> Add new <span v-if="isMac" class="text-gray-400 ml-2">⌘+A</span>
    </button>
    <div v-else-if="addMarkerMode === 'add'">
      <p class="mb-2">Please click on the map to add a marker</p>
      <button
        @click="cancelHandler"
        type="button"
        class="bg-rose-100 py-1 px-4 rounded-md disabled:bg-gray-200"
      >
        Cancel
      </button>
    </div>
    <form
      @submit.prevent="submitSaveMarker"
      class=""
      v-else-if="addMarkerMode === 'selected'"
    >
      <h1 class="text-base underline mb-4">New Marker</h1>
      <div class="flex flex-col gap-2 mb-4">
        <input
          v-model="inputs.name"
          type="text"
          placeholder="Marker name"
          class="border border-gray-300 py-1 px-1 rounded-md"
          required
        />
        <input
          v-model="inputs.id"
          type="text"
          placeholder="Marker id"
          class="border border-gray-300 py-1 px-1 rounded-md"
          required
        />
        <select
          v-model="inputs.type"
          name="type"
          id="type-select"
          class="border border-gray-300 py-1 rounded-md"
        >
          <option value="tree" selected>Tree</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          @click="cancelHandler"
          type="button"
          class="w-1/2 bg-rose-100 py-1 px-2 rounded-md disabled:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="w-1/2 bg-green-200 hover:bg-300 py-1 px-2 rounded-md disabled:bg-gray-200"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const markerStore = useStore("markers");
const { addMarkerMode, currentUnsavedMarker } = storeToRefs(markerStore);

const loading = ref(false);
const inputs = reactive({
  name: "",
  id: "",
  type: "tree",
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
    color: "#4C763B",
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
};
</script>
