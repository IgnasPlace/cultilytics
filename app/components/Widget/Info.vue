<template>
  <div class="max-w-xs sm:max-w-md mx-auto absolute top-3 left-3 bg-white rounded-md">
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
      <!-- Image Grid -->
      <AtomsImageGrid
        :images="data.markerImage"
        :max-visible="4"
        @image-click="openImageCarousel"
      />

      <!-- Image Carousel Modal -->
      <AtomsImageCarousel
        v-if="isCarouselOpen"
        :images="data.markerImage"
        :start-index="currentImageIndex"
        @close="closeImageCarousel"
      />
      <WidgetImageUploader
        :marker-id="data.id"
        @upload-success="handleUploadSuccess"
        @upload-error="handleUploadError"
        class="px-4 py-4"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["data"]);

const markerStore = useStore("markers");
const { showInfoWidget, currentSelectedMarker } = storeToRefs(markerStore);

// Carousel state
const isCarouselOpen = ref(false);
const currentImageIndex = ref(0);

const closeWidget = () => {
  showInfoWidget.value = false;
  currentSelectedMarker.value = null;
};

const deleteMarker = () => {
  useDeleteMarker(props.data.id);
};

const handleUploadSuccess = (result) => {
  console.log("Upload successful:", result);
};

const handleUploadError = (error) => {
  console.error("Upload error:", error);
};

// Carousel methods
const openImageCarousel = (index) => {
  currentImageIndex.value = index;
  isCarouselOpen.value = true;
};

const closeImageCarousel = () => {
  isCarouselOpen.value = false;
  currentImageIndex.value = 0;
};
</script>
