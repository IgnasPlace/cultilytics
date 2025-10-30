<template>
  <div
    v-if="loading"
    class="absolute z-50 bg-[#d6d6d69c] inset-0 flex items-center justify-center"
  >
    <p class="text-2xl">Saving...</p>
  </div>
  <div class="absolute top-3 left-3 text-xs z-10 bg-white p-2 rounded-md">
    <button
      v-if="addMarkerMode === 'off'"
      class=""
      @click="() => markerStore.setActivateAddMarkerMode('add')"
    >
      Add marker
    </button>
    <p class="" v-else-if="addMarkerMode === 'add'">
      Please click on the map to add a marker
    </p>
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
      <p>Longitude: {{ currentUnsavedMarker._lngLat.lng }}</p>
      <p>Latitude: {{ currentUnsavedMarker._lngLat.lat }}</p>
      <div class="flex gap-2 mt-4">
        <button
          @click="cancelHandler"
          type="button"
          class="w-1/2 bg-rose-100 py-1 px-2 rounded-md disabled:bg-gray-200"
          :disabled="buttonsDisabled"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="w-1/2 bg-green-200 py-1 px-2 rounded-md disabled:bg-gray-200"
          :disabled="buttonsDisabled"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const emit = defineEmits(["addMarkerToMap"]);

const markerStore = useStore("markers");
const { addMarkerMode, currentUnsavedMarker } = storeToRefs(markerStore);

const defaultInputs = {
  name: "",
  id: "",
  type: "tree",
};

const buttonsDisabled = ref(false);
const loading = ref(false);
const inputs = reactive(defaultInputs);

const cancelHandler = () => {
  buttonsDisabled.value = true;
  currentUnsavedMarker.value.remove();
  markerStore.setCurrentUnsavedMarker(null);
  markerStore.setActivateAddMarkerMode("off");
  setTimeout(() => (buttonsDisabled.value = false), 500);
  inputs.value = defaultInputs;
};

const submitSaveMarker = async () => {
  const body = {
    id: inputs.id,
    lng: currentUnsavedMarker.value._lngLat.lng,
    lat: currentUnsavedMarker.value._lngLat.lat,
    type: inputs.type,
    color: "#4C763B",
    name: inputs.name,
  };
  loading.value = true;
  try {
    await useSaveNewMarker(body);
    emit("addMarkerToMap", body);
    inputs.value = defaultInputs;
    loading.value = false;
  } catch (err) {
    console.log(err);
    loading.value = false;
  }
};
</script>
