<template>
  <div class="relative group">
    <!-- Loading State -->
    <div
      v-if="uploadStatus === 'uploading'"
      class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center"
    >
      <AtomsSpinner class="w-6 h-6" />
    </div>
    
    <!-- Success State -->
    <div
      v-else-if="uploadStatus === 'success'"
      class="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center"
    >
      <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    
    <!-- Error State -->
    <div
      v-else-if="uploadStatus === 'error'"
      class="w-24 h-24 bg-red-100 rounded-lg flex flex-col items-center justify-center"
    >
      <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    
    <!-- Preview State -->
    <div v-else class="relative">
      <img
        :src="previewUrl"
        :alt="file.name"
        class="w-24 h-24 object-cover rounded-lg"
      />
      
      <!-- Hover Overlay -->
      <div
        v-if="!disabled"
        class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <button
          @click="handleRemove"
          class="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          :aria-label="`Remove ${file.name}`"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- File Info -->
    <div class="mt-2 text-xs">
      <p class="text-gray-700 font-medium truncate w-24" :title="file.name">
        {{ file.name }}
      </p>
      <p class="text-gray-500">
        {{ formatFileSize(file.size) }}
      </p>
      <p v-if="errorMessage" class="text-red-500 text-xs mt-1">
        {{ errorMessage }}
      </p>
    </div>
    
    <!-- Progress Bar (when uploading) -->
    <div v-if="uploadStatus === 'uploading' && uploadProgress > 0" class="mt-1">
      <div class="w-24 bg-gray-200 rounded-full h-1">
        <div
          class="bg-[#4C763B] h-1 rounded-full transition-all"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['remove', 'retry'])

const props = defineProps({
  file: {
    type: File,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  uploadStatus: {
    type: String,
    default: 'pending', // pending, uploading, success, error
  },
  uploadProgress: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const previewUrl = ref('')

const generatePreview = () => {
  if (!props.file || !props.file.type.startsWith('image/')) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.onerror = () => {
    console.error('Failed to generate preview for', props.file.name)
  }
  reader.readAsDataURL(props.file)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleRemove = () => {
  if (props.disabled) return
  emit('remove', props.file)
}

const handleRetry = () => {
  if (props.disabled) return
  emit('retry', props.file)
}

// Generate preview when component mounts or file changes
watch(() => props.file, generatePreview, { immediate: true })

// Cleanup preview URL when component unmounts
onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>