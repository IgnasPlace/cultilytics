<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Treatment Type <span class="text-red-500">*</span></label>
      <select
        v-model="form.type"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      >
        <option value="" disabled>Select type...</option>
        <option v-for="type in treatmentTypes" :key="type.value" :value="type.value">
          {{ type.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Date <span class="text-red-500">*</span></label>
      <input
        v-model="form.date"
        type="date"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Cost (€)</label>
      <input
        v-model="form.cost"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Products Used</label>
      <input
        v-model="form.products"
        type="text"
        placeholder="e.g., Organic fertilizer, Compost..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
      <textarea
        v-model="form.notes"
        rows="3"
        placeholder="Additional details about the treatment..."
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

const treatmentTypes = [
  { value: 'pruning', label: 'Pruning' },
  { value: 'fertilizing', label: 'Fertilizing' },
  { value: 'watering', label: 'Watering' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'mulching', label: 'Mulching' },
  { value: 'other', label: 'Other' }
]

const form = reactive({
  type: '',
  date: new Date().toISOString().split('T')[0],
  cost: '',
  products: '',
  notes: ''
})

const isSubmitting = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  if (!form.type) return

  isSubmitting.value = true
  error.value = null

  try {
    const requestBody = {
      type: form.type,
      date: new Date(form.date).getTime(),
      cost: form.cost !== '' ? Math.round(parseFloat(form.cost) * 100) : undefined,
      products: form.products || undefined,
      notes: form.notes || undefined
    }

    const result = await $fetch(`/api/marker/${props.markerId}/treatments`, {
      method: 'POST',
      body: requestBody
    })

    emit('success', result)
    emit('close')
  } catch (err) {
    console.error('Failed to add treatment:', err)
    error.value = err.message || 'Failed to save treatment'
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
