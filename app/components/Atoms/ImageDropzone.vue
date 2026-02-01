<template>
  <div
    :class="[
      'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
      isDragActive
        ? 'border-[#4C763B] bg-[#4c763b10]'
        : 'border-gray-300 hover:border-[#4C763B] hover:bg-gray-50',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    @click="handleClick"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    tabindex="0"
    role="button"
    :aria-label="`Click or drag to upload images (max ${maxFiles} files)`"
  >
    <input
      ref="fileInput"
      type="file"
      :multiple="maxFiles > 1"
      :accept="acceptTypes"
      :disabled="disabled"
      @change="handleFileInput"
      class="hidden"
    />
    
    <div class="flex flex-col items-center gap-3">
      <div class="text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <div>
        <p class="text-sm font-medium text-gray-700">
          {{ isDragActive ? 'Drop images here' : `Click or drag images here` }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          Maximum {{ maxFiles }} images • JPG, PNG, WebP • Max 5MB each
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['files-selected', 'error'])

const props = defineProps({
  maxFiles: {
    type: Number,
    default: 3
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const fileInput = ref(null)
const isDragActive = ref(false)

const VALID_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const acceptTypes = VALID_FORMATS.map(format => format.split('/')[1]).join(',')

const validateFile = (file) => {
  if (!VALID_FORMATS.includes(file.type)) {
    throw new Error(`Invalid file format. Please use JPG, PNG, or WebP`)
  }
  
  if (file.size > MAX_SIZE) {
    throw new Error(`File is too large. Maximum size is 5MB`)
  }
  
  return true
}

const validateFiles = (files) => {
  if (files.length > props.maxFiles) {
    throw new Error(`Maximum ${props.maxFiles} files allowed`)
  }
  
  files.forEach(validateFile)
  
  return true
}

const handleClick = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const handleFileInput = (event) => {
  const files = Array.from(event.target.files || [])
  processFiles(files)
  event.target.value = '' // Reset input
}

const handleDragOver = (event) => {
  if (props.disabled) return
  event.dataTransfer.dropEffect = 'copy'
}

const handleDragEnter = (event) => {
  if (props.disabled) return
  isDragActive.value = true
}

const handleDragLeave = (event) => {
  if (props.disabled) return
  if (event.target !== event.currentTarget) return
  isDragActive.value = false
}

const handleDrop = (event) => {
  if (props.disabled) return
  isDragActive.value = false
  
  const files = Array.from(event.dataTransfer.files).filter(file => 
    VALID_FORMATS.includes(file.type)
  )
  
  processFiles(files)
}

const processFiles = (files) => {
  try {
    validateFiles(files)
    emit('files-selected', files)
  } catch (error) {
    emit('error', error.message)
  }
}

// Cleanup drag state when component unmounts
onUnmounted(() => {
  isDragActive.value = false
})
</script>

<style scoped>
/* Ensure consistent focus styles */
*:focus {
  outline: 2px solid #4C763B;
  outline-offset: 2px;
}
</style>