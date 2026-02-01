<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Quantity <span class="text-red-500">*</span></label>
        <input
          v-model="form.quantity"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="0.00"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Unit <span class="text-red-500">*</span></label>
        <select
          v-model="form.unit"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
        >
          <option v-for="unit in units" :key="unit.value" :value="unit.value">
            {{ unit.label }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Harvest Date <span class="text-red-500">*</span></label>
      <input
        v-model="form.harvestDate"
        type="date"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Quality</label>
      <div class="flex gap-2">
        <label
          v-for="quality in qualities"
          :key="quality.value"
          class="flex-1 flex items-center justify-center p-2 border rounded-md cursor-pointer transition-all text-sm"
          :class="form.quality === quality.value ? quality.activeClass : 'border-gray-200 hover:bg-gray-50 text-gray-600'"
        >
          <input
            v-model="form.quality"
            type="radio"
            :value="quality.value"
            class="hidden"
          />
          {{ quality.label }}
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
      <textarea
        v-model="form.notes"
        rows="2"
        placeholder="Varieties, storage notes, etc."
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
        {{ isSubmitting ? 'Saving...' : 'Record Harvest' }}
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

const units = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'units', label: 'Units' },
  { value: 'baskets', label: 'Baskets' }
]

const qualities = [
  { value: 'excellent', label: 'Excellent', activeClass: 'border-green-500 bg-green-50 text-green-700 font-medium' },
  { value: 'good', label: 'Good', activeClass: 'border-blue-400 bg-blue-50 text-blue-700 font-medium' },
  { value: 'average', label: 'Avg', activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700 font-medium' },
  { value: 'poor', label: 'Poor', activeClass: 'border-red-400 bg-red-50 text-red-700 font-medium' }
]

const form = reactive({
  quantity: '',
  unit: 'kg',
  harvestDate: new Date().toISOString().split('T')[0],
  quality: 'good',
  notes: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!form.quantity || parseFloat(form.quantity) <= 0) return

  isSubmitting.value = true

  try {
    let quantityValue = form.quantity
    if (form.unit === 'g') {
      quantityValue = (parseFloat(form.quantity) / 1000).toString()
    }

    const requestBody = {
      quantity: Math.round(parseFloat(quantityValue) * 100),
      unit: form.unit === 'g' ? 'kg' : form.unit,
      harvestDate: new Date(form.harvestDate).getTime(),
      quality: form.quality,
      notes: form.notes || null
    }

    const result = await $fetch(`/api/marker/${props.markerId}/yield`, {
      method: 'POST',
      body: requestBody
    })

    emit('success', result)
    emit('close')
  } catch (err) {
    console.error('Failed to record harvest:', err)
    toast.error({
      title: 'Error',
      message: err?.message || 'Failed to record harvest',
      position: 'topCenter'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
