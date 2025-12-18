<template>
  <div class="max-w-md mx-auto absolute top-3 left-3 bg-white rounded-md">
    <div class="card">
      <div
        class="flex justify-between items-center border-b border-gray-200 px-4 py-2"
      >
        <h3 class="text-xl font-bold text-gray-800">{{ data.id }}</h3>
        <button
          @click="closeWidget"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div class="px-4 py-2">
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
        class="flex justify-between gap-4 px-4 py-2 border-y border-gray-200"
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
      <div
        v-if="data.markerImage.length > 0"
        class="max-h-[250px] overflow-scroll"
      >
        <div
          v-for="image in data.markerImage"
          :key="image.id"
          class="max-w-[180px] relative"
        >
          <img
            :src="`/uploads/${image.photoPath}`"
            :alt="image.desc"
            class="w-full"
          />
          <p class="absolute bottom-1 left-1 bg-white rounded-sm px-1">
            {{
              new Date(image.createdAt).getMonth() +
              "-" +
              new Date(image.createdAt).getFullYear()
            }}
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-2 px-4 py-2">
        <label
          v-if="files.length < 1"
          for="add-photo-input"
          class="bg-blue-500 text-white text-center py-1 rounded-md cursor-pointer"
          >Add photo</label
        >
        <div v-else>
          <p>Files selected:</p>
          <ul>
            <li
              v-for="file in files"
              class="max-w-[180px] text-gray-500 list-disc list-inside"
            >
              {{ file.name }}
            </li>
          </ul>
        </div>
        <input
          type="file"
          id="add-photo-input"
          hidden
          @input="handleFileInput"
        />
        <button
          v-if="files.length > 0"
          @click="handleImageUpload"
          class="px-4 py-1 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["data"]);

const markerStore = useStore("markers");
const { showInfoWidget, currentSelectedMarker } = storeToRefs(markerStore);

const { handleFileInput, files, clearFiles } = useFileStorage();

const closeWidget = () => {
  showInfoWidget.value = false;
  currentSelectedMarker.value = null;
};
const deleteMarker = () => {
  useDeleteMarker(props.data.id);
};

const handleImageUpload = async (e) => {
  $fetch(`/api/marker-image/${props.data.id}`, {
    method: "POST",
    body: {
      files: files.value,
    },
    onResponse: ({ response }) => {
      const toast = useToast();
      if (response._data.success) {
        toast.success({
          title: "Done!",
          message: "Image saved",
          position: "topCenter",
        });
        clearFiles();
        markerStore.addMarkerImages(props.data.id, response._data.result);
      } else {
        console.log(response);
        toast.error({
          title: "Error",
          message: response._data.message,
          position: "topCenter",
        });
      }
    },
  });
};
</script>
