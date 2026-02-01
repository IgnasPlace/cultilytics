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
        <div class="text-center">
          <h3 class="text-gray-800 font-medium truncate">
            {{ currentImage?.desc || "Image" }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ formatDate(currentImage?.createdAt) }}
          </p>
        </div>

        <!-- Dots Indicator -->
        <div
          v-if="images.length > 1"
          class="flex justify-center items-center gap-2 mt-4"
        >
          <button
            v-for="(_, index) in images"
            :key="index"
            @click="goToImage(index)"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              index === currentIndex
                ? 'bg-[#4C763B] w-8'
                : 'bg-gray-300 hover:bg-gray-400',
            ]"
            :aria-label="`Go to image ${index + 1}`"
          />
        </div>
      </div>
    </div>
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
});

const emit = defineEmits(["close"]);

// Reactive state
const currentIndex = ref(props.startIndex);
const zoomLevel = ref(1);
const isZoomed = computed(() => zoomLevel.value > 1);
const imageLoading = ref(true);

// Touch gesture state
const touchStartX = ref(0);
const touchStartY = ref(0);
const isTouching = ref(false);

// Computed properties
const currentImage = computed(() => props.images[currentIndex.value]);
const currentImageUrl = computed(() => {
  const image = currentImage.value;
  if (!image) return "";

  // Use medium path for carousel, large path for zoom
  return isZoomed.value
    ? `/api/uploads/${image.largePath}`
    : `/api/uploads/${image.mediumPath}`;
});

// Methods
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
  // Only zoom if not clicking navigation buttons
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

// Touch gestures
const handleTouchStart = (event) => {
  if (event.touches.length === 1) {
    touchStartX.value = event.touches[0].clientX;
    touchStartY.value = event.touches[0].clientY;
    isTouching.value = true;
  }
};

const handleTouchMove = (event) => {
  if (event.touches.length === 2) {
    // Pinch to zoom
    event.preventDefault();
    const distance = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY,
    );

    // Simple zoom calculation (could be enhanced)
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

    // Swipe detection
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

// Keyboard navigation
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
