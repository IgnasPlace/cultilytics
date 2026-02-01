<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Health Status <span class="text-red-500">*</span></label>
      <div class="grid grid-cols-1 gap-2">
        <label
          v-for="status in healthStatuses"
          :key="status.value"
          class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50"
          :class="form.status === status.value ? 'border-[#4C763B] bg-green-50' : 'border-gray-200'"
        >
          <input
            v-model="form.status"
            type="radio"
            :value="status.value"
            class="hidden"
          />
          <span
            class="w-4 h-4 rounded-full"
            :class="status.dotColor"
          />
          <span class="flex-1 font-medium" :class="form.status === status.value ? 'text-gray-900' : 'text-gray-700'">
            {{ status.label }}
          </span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Assessment Date <span class="text-red-500">*</span></label>
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
        placeholder="Describe the plant's condition, any issues observed..."
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
        :disabled="isSubmitting || !form.status"
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

const healthStatuses = [
  { value: 'excellent', label: 'Excellent', dotColor: 'bg-green-500' },
  { value: 'good', label: 'Good', dotColor: 'bg-emerald-500' },
  { value: 'fair', label: 'Fair', dotColor: 'bg-yellow-500' },
  { value: 'poor', label: 'Poor', dotColor: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', dotColor: 'bg-red-500' }
]

const form = reactive({
  status: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

const isSubmitting = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  if (!form.status) return

  isSubmitting.value = true
  error.value = null

  try {
    const requestBody = {
      status: form.status,
      recordedAt: new Date(form.date).getTime(),
      notes: form.notes || null
    }

    const result = await $fetch(`/api/marker/${props.markerId}/health`, {
      method: 'POST',
      body: requestBody
    })

    emit('success', result)
    emit('close')
  } catch (err) {
    console.error('Failed to update health status:', err)
    error.value = err.message || 'Failed to save health record'
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
