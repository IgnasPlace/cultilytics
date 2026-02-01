<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm) <span class="text-red-500">*</span></label>
      <input
        v-model="form.height"
        type="number"
        min="0"
        required
        placeholder="e.g., 150"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
      <p class="text-xs text-gray-500 mt-1">Enter height in centimeters</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Measurement Date <span class="text-red-500">*</span></label>
      <input
        v-model="form.date"
        type="date"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
      <textarea
        v-model="form.notes"
        rows="3"
        placeholder="Any additional observations..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B] resize-none"
      ></textarea>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="button"
        @click="$emit('close')"
        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex-1 px-4 py-2 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </form>
</template>

<script setup>
const toast = useToast()

const props = defineProps({
  markerId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const form = reactive({
  height: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

const isSubmitting = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  if (!form.height || form.height <= 0) return

  isSubmitting.value = true
  error.value = null

  try {
    const requestBody = {
      height: parseInt(form.height),
      measuredAt: new Date(form.date).getTime(),
      notes: form.notes || null
    }

    const result = await $fetch(`/api/marker/${props.markerId}/growth`, {
      method: 'POST',
      body: requestBody
    })

    emit('success', result)
    emit('close')
  } catch (err) {
    console.error('Failed to add growth record:', err)
    error.value = err.message || 'Failed to save height measurement'
    toast.error({
      title: 'Error',
      message: error.value,
      position: 'topCenter'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
