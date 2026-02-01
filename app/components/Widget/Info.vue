<template>
  <!-- Mobile Bottom Sheet -->
  <div
    class="sm:hidden fixed bottom-0 left-0 right-0 z-30 max-h-[80vh] bg-white rounded-t-xl shadow-2xl flex flex-col"
  >
    <!-- Header - Always visible -->
    <div class="flex justify-between items-center border-b border-gray-200 px-4 pt-4 pb-2 shrink-0">
      <h3 class="text-lg font-bold text-gray-800">{{ data.id }}</h3>
      <button
        @click="closeWidget"
        class="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
      >
        ×
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="overflow-y-auto flex-1 px-4 pb-6">
      <!-- Info Fields -->
      <div class="space-y-2 mb-3 pt-3">
        <div class="flex justify-between items-center">
          <label class="text-gray-600 text-sm">Name:</label>
          <p class="text-gray-800 text-sm">{{ data.name }}</p>
        </div>
        <div class="flex justify-between items-center">
          <label class="text-gray-600 text-sm">Latin Name:</label>
          <p class="text-gray-800 text-sm">Almendrus</p>
        </div>
        <div class="flex justify-between items-center">
          <label class="text-gray-600 text-sm">Type:</label>
          <p class="text-gray-800 text-sm">{{ data.type }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between gap-4 py-3 border-y border-gray-200 mb-3">
        <button
          @click="deleteMarker"
          class="px-4 py-1.5 text-red-600 hover:text-red-800 transition-colors text-sm"
        >
          Delete
        </button>
        <button
          class="px-4 py-1.5 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors text-sm"
        >
          Edit
        </button>
      </div>

      <!-- Image Grid (Horizontal Scroll) -->
      <AtomsImageGrid
        :images="data.markerImage"
        :max-visible="6"
        @image-click="openImageCarousel"
      />

      <!-- Image Carousel Modal -->
      <AtomsImageCarousel
        v-if="isCarouselOpen"
        :images="data.markerImage"
        :start-index="currentImageIndex"
        :marker-id="data.id"
        :marker-owner-id="data.userId"
        @close="closeImageCarousel"
        @image-deleted="handleImageDeleted"
      />

      <!-- Image Uploader -->
      <WidgetImageUploader
        :marker-id="data.id"
        @upload-success="handleUploadSuccess"
        @upload-error="handleUploadError"
        class="mt-4"
      />
    </div>
  </div>

  <!-- Desktop Layout -->
  <div class="hidden sm:block max-w-xs mx-auto absolute top-3 left-3 bg-white rounded-md z-20">
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
        :marker-id="data.id"
        :marker-owner-id="data.userId"
        @close="closeImageCarousel"
        @image-deleted="handleImageDeleted"
      />
      <!-- Image Uploader -->
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

const handleImageDeleted = (imageId) => {
  if (props.data.markerImage.length === 0) {
    closeImageCarousel();
  }
};

const openImageCarousel = (index) => {
  currentImageIndex.value = index;
  isCarouselOpen.value = true;
};

const closeImageCarousel = () => {
  isCarouselOpen.value = false;
  currentImageIndex.value = 0;
};
</script>
