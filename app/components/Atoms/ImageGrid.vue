<template>
  <div v-if="images.length > 0" class="py-3 border-t border-gray-200 sm:px-4">
    <!-- Mobile: Horizontal Scroll -->
    <div class="sm:hidden">
      <div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x snap-mandatory">
        <div
          v-for="(image, index) in visibleImages"
          :key="image.id"
          @click="handleImageClick(index)"
          class="relative group cursor-pointer overflow-hidden rounded-md bg-gray-100 hover:shadow-md transition-all duration-200 flex-shrink-0 w-20 h-20 snap-start"
        >
          <img
            :src="`/uploads/${image.thumbnailPath}`"
            :alt="image.desc"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />

          <!-- Overlay with remaining count for last item when more images exist -->
          <div
            v-if="showRemainingOverlay(index)"
            class="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-sm"
          >
            <div class="text-center">
              <span class="text-base font-bold">+{{ remainingCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button (Mobile) -->
      <button
        v-if="images.length > maxVisible"
        @click="handleViewAllClick"
        class="w-full mt-2 px-3 py-1.5 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors duration-200 text-xs font-medium"
      >
        View all {{ images.length }} images
      </button>
    </div>

    <!-- Desktop: Grid Layout -->
    <div class="hidden sm:block">
      <!-- Thumbnail Grid -->
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div
          v-for="(image, index) in visibleImages"
          :key="image.id"
          @click="handleImageClick(index)"
          class="relative group cursor-pointer overflow-hidden rounded-md aspect-square bg-gray-100 hover:shadow-md transition-all duration-200"
        >
          <img
            :src="`/uploads/${image.thumbnailPath}`"
            :alt="image.desc"
            class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            @error="handleImageError"
          />

          <!-- Overlay with remaining count for last item when more images exist -->
          <div
            v-if="showRemainingOverlay(index)"
            class="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-sm"
          >
            <div class="text-center">
              <span class="text-xl font-bold">+{{ remainingCount }}</span>
              <p class="text-xs">more</p>
            </div>
          </div>

          <!-- Hover overlay for image info -->
          <div
            v-if="!showRemainingOverlay(index)"
            class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <div class="absolute bottom-1 left-1 right-1 text-white">
              <p class="text-xs truncate">{{ image.desc || "Image" }}</p>
              <p class="text-xs opacity-75">{{ formatDate(image.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button (Desktop) -->
      <button
        v-if="images.length > maxVisible"
        @click="handleViewAllClick"
        class="w-full px-4 py-2 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors duration-200 text-sm font-medium"
      >
        View all {{ images.length }} images
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<script setup>
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  maxVisible: {
    type: Number,
    default: 4,
  },
});

const emit = defineEmits(["image-click"]);

// Computed properties
const visibleImages = computed(() => props.images.slice(0, props.maxVisible));

const remainingCount = computed(() =>
  Math.max(0, props.images.length - props.maxVisible),
);

const showRemainingOverlay = (index) => {
  return index === props.maxVisible - 1 && remainingCount.value > 0;
};

// Methods
const handleImageClick = (index) => {
  emit("image-click", index);
};

const handleViewAllClick = () => {
  // Open carousel from the first image
  emit("image-click", 0);
};

const handleImageError = (event) => {
  console.error("Failed to load thumbnail:", event.target.src);
  // Could set a fallback image here
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}-${date.getFullYear()}`;
};
</script>
