<template>
  <AtomsModal :is-open="true" @close="$emit('close')">
    <div class="flex flex-col h-full">
      <!-- Main Image Container -->
      <div
        class="relative flex-1 bg-black flex items-center justify-center overflow-hidden"
        @click="handleImageClick"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Navigation Arrow Left -->
        <button
          v-if="images.length > 1"
          @click="previousImage"
          class="absolute left-1 sm:left-2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg transition-all duration-200"
          aria-label="Previous image"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Navigation Arrow Right -->
        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="absolute right-1 sm:right-2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg transition-all duration-200"
          aria-label="Next image"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Loading State -->
        <div
          v-if="imageLoading"
          class="absolute inset-0 flex items-center justify-center"
        >
          <AtomsSpinner />
        </div>

        <!-- Main Image -->
        <img
          v-if="currentImage"
          :src="currentImageUrl"
          :alt="currentImage.desc"
          :style="{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.3s ease',
          }"
          class="max-w-full max-h-full object-contain cursor-zoom-in select-none touch-pan-y"
          @load="imageLoading = false"
          @error="handleImageError"
        />

        <!-- Zoom Reset Button -->
        <button
          v-if="isZoomed"
          @click="resetZoom"
          class="absolute top-12 right-2 sm:top-14 sm:right-3 z-10 px-2 py-1 sm:px-3 bg-white/80 hover:bg-white rounded-full text-xs sm:text-sm text-gray-800 shadow-lg transition-all duration-200"
        >
          Reset Zoom
        </button>
      </div>

      <!-- Image Information -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="text-center mb-3">
          <h3 class="text-gray-800 font-medium truncate">
            {{ currentImage?.desc || "Image" }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ formatDate(currentImage?.createdAt) }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-3 mb-4">
          <button
            v-if="canDeleteCurrentImage"
            @click="confirmDelete"
            class="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-medium"
            :disabled="isDeleting"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>

        <!-- Dots Indicator -->
        <div
          v-if="images.length > 1"
          class="flex justify-center items-center gap-2"
        >
          <button
            v-for="(_, index) in images"
            :key="index"
            @click="goToImage(index)"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-gray-300 hover:bg-gray-400',
            ]"
            :aria-label="`Go to image ${index + 1}`"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <AtomsModal
      :is-open="showDeleteModal"
      @close="cancelDelete"
    >
      <div class="p-6 max-w-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Image</h3>
        </div>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this image? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            :disabled="isDeleting"
          >
            <AtomsSpinner v-if="isDeleting" class="w-4 h-4" />
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </AtomsModal>
  </AtomsModal>
</template>

<script setup>
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  startIndex: {
    type: Number,
    default: 0,
  },
  markerId: {
    type: String,
    required: true,
  },
  markerOwnerId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["close", "image-deleted"]);

const { loggedIn, user } = useUserSession();

const currentIndex = ref(props.startIndex);
const zoomLevel = ref(1);
const isZoomed = computed(() => zoomLevel.value > 1);
const imageLoading = ref(true);

const touchStartX = ref(0);
const touchStartY = ref(0);
const isTouching = ref(false);

const showDeleteModal = ref(false);
const isDeleting = ref(false);

const currentUserId = computed(() => {
  if (!loggedIn.value || !user.value) return null;
  return parseInt(String(user.value.id), 10);
});

const currentImage = computed(() => props.images[currentIndex.value]);

const canDeleteCurrentImage = computed(() => {
  if (!loggedIn.value || !currentUserId.value || !currentImage.value) return false;

  const isImageUploader = currentImage.value.userId === currentUserId.value;
  const isMarkerOwner = props.markerOwnerId === currentUserId.value;

  return isImageUploader || isMarkerOwner;
});

const currentImageUrl = computed(() => {
  const image = currentImage.value;
  if (!image) return "";

  return isZoomed.value
    ? `/api/uploads/${image.largePath}`
    : `/api/uploads/${image.mediumPath}`;
});

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};

const executeDelete = async () => {
  if (!currentImage.value) return;

  const imageId = currentImage.value.id;
  const wasLastImage = props.images.length === 1;

  isDeleting.value = true;
  try {
    await useDeleteMarkerImage(String(imageId), props.markerId);
    emit("image-deleted", imageId);

    if (wasLastImage) {
      emit("close");
    } else {
      showDeleteModal.value = false;
    }
  } catch (error) {
    console.error("Failed to delete image:", error);
  } finally {
    isDeleting.value = false;
  }
};

const previousImage = () => {
  if (props.images.length <= 1) return;
  currentIndex.value =
    currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
  resetZoom();
  imageLoading.value = true;
};

const nextImage = () => {
  if (props.images.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
  resetZoom();
  imageLoading.value = true;
};

const goToImage = (index) => {
  currentIndex.value = index;
  resetZoom();
  imageLoading.value = true;
};

const handleImageClick = (event) => {
  if (event.target.tagName === "IMG") {
    if (isZoomed.value) {
      resetZoom();
    } else {
      zoomLevel.value = 2;
    }
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

const handleImageError = () => {
  imageLoading.value = false;
  console.error("Failed to load image:", currentImageUrl.value);
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}-${date.getFullYear()}`;
};

const handleTouchStart = (event) => {
  if (event.touches.length === 1) {
    touchStartX.value = event.touches[0].clientX;
    touchStartY.value = event.touches[0].clientY;
    isTouching.value = true;
  }
};

const handleTouchMove = (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();
    const distance = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY,
    );

    if (distance > 150) {
      zoomLevel.value = Math.min(3, Math.max(1, distance / 75));
    }
  }
};

const handleTouchEnd = (event) => {
  if (isTouching.value && event.touches.length === 0) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.value;
    const deltaY = touchEndY - touchStartY.value;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        previousImage();
      } else {
        nextImage();
      }
    }

    isTouching.value = false;
  }
};

onMounted(() => {
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        previousImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "Escape":
        if (isZoomed.value) {
          resetZoom();
        } else if (showDeleteModal.value) {
          cancelDelete();
        } else {
          emit("close");
        }
        break;
      case " ":
        event.preventDefault();
        handleImageClick({ target: { tagName: "IMG" } });
        break;
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });
});
</script>
