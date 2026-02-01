<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="handleOverlayClick"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <!-- Modal Content -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="relative bg-white rounded-lg shadow-2xl max-w-[95vw] max-h-[95vh] sm:max-w-[90vw] sm:max-h-[90vh] md:max-w-[80vw] md:max-h-[85vh] lg:max-w-[80vw] lg:max-h-[85vh] overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- Header with Title and Close Button -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
            <button
              @click="close"
              class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content Slot -->
          <div class="flex-1 overflow-y-auto">
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}

// Keyboard navigation
onMounted(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && props.isOpen) {
      close()
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
/* Prevent body scroll when modal is open */
:global(body.modal-open) {
  overflow: hidden;
}
</style>