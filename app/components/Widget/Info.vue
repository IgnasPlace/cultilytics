<template>
  <div class="max-w-md mx-auto absolute top-3 left-3 bg-white rounded-md">
    <div class="card">
      <div
        class="card-header flex justify-between items-center border-b border-gray-200 px-4 py-2"
      >
        <h3 class="text-xl font-bold text-gray-800">{{ data.id }}</h3>
        <button
          @click="closeWidget"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div class="card-body px-4 py-2">
        <div
          class="flex justify-between items-center border-b border-[#4c763b82]"
        >
          <label class="text-gray-600 pr-2">Name:</label>
          <p class="text-gray-800">{{ data.name }}</p>
        </div>

        <div
          class="flex justify-between items-center border-b border-[#4c763b82]"
        >
          <label class="text-gray-600 pr-2">Latin Name:</label>
          <p class="text-gray-800">Almendrus</p>
        </div>
        <div class="flex justify-between items-center">
          <label class="text-gray-600 pr-2">Type:</label>
          <p class="text-gray-800">{{ data.type }}</p>
        </div>
      </div>

      <div
        class="card-footer flex justify-between gap-4 px-4 py-2 border-t border-gray-200"
      >
        <button
          @click="deleteMarker"
          class="px-4 py-1 text-red-600 hover:text-red-800 transition-colors"
        >
          Delete
        </button>
        <button
          class="px-4 py-1 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["data"]);

const markerStore = useStore("markers");
const { showInfoWidget, currentSelectedMarker } = storeToRefs(markerStore);

const closeWidget = () => {
  showInfoWidget.value = false;
  currentSelectedMarker.value = null;
};
const deleteMarker = () => {
  useDeleteMarker(props.data.id);
};
</script>
