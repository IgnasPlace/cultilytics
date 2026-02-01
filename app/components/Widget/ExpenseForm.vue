<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Category <span class="text-red-500">*</span></label>
      <select
        v-model="form.category"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      >
        <option value="" disabled>Select category...</option>
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Amount (€) <span class="text-red-500">*</span></label>
      <input
        v-model="form.amount"
        type="number"
        min="0"
        step="0.01"
        required
        placeholder="0.00"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
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
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        v-model="form.description"
        rows="2"
        placeholder="What was purchased, supplier, etc."
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
        {{ isSubmitting ? 'Saving...' : 'Add Expense' }}
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

const categories = [
  { value: 'seeds', label: 'Seeds/Plants' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'tools', label: 'Tools/Equipment' },
  { value: 'water', label: 'Water' },
  { value: 'labor', label: 'Labor' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'other', label: 'Other' }
]

const form = reactive({
  category: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  description: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!form.category || !form.amount || parseFloat(form.amount) <= 0) return

  isSubmitting.value = true

  try {
    const requestBody = {
      category: form.category,
      amount: Math.round(parseFloat(form.amount) * 100),
      date: new Date(form.date).getTime(),
      description: form.description || null
    }

    const result = await $fetch(`/api/marker/${props.markerId}/expenses`, {
      method: 'POST',
      body: requestBody
    })

    emit('success', result)
    emit('close')
  } catch (err) {
    console.error('Failed to add expense:', err)
    toast.error({
      title: 'Error',
      message: err?.message || 'Failed to add expense',
      position: 'topCenter'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
