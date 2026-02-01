<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Task Type <span class="text-red-500">*</span></label>
      <select
        v-model="form.taskType"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      >
        <option value="" disabled>Select task type...</option>
        <option v-for="type in taskTypes" :key="type.value" :value="type.value">
          {{ type.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Due Date <span class="text-red-500">*</span></label>
      <input
        v-model="form.dueDate"
        type="date"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C763B] focus:border-[#4C763B]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
      <div class="flex gap-2">
        <label
          v-for="priority in priorities"
          :key="priority.value"
          class="flex-1 flex items-center justify-center gap-2 p-2 border rounded-md cursor-pointer transition-all"
          :class="form.priority === priority.value ? priority.activeClass : 'border-gray-200 hover:bg-gray-50'"
        >
          <input
            v-model="form.priority"
            type="radio"
            :value="priority.value"
            class="hidden"
          />
          <span :class="form.priority === priority.value ? 'font-medium' : 'text-gray-600'">
            {{ priority.label }}
          </span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
      <textarea
        v-model="form.notes"
        rows="3"
        placeholder="Task details, instructions..."
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
        :disabled="isSubmitting || !form.taskType"
        class="flex-1 px-4 py-2 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Creating...' : 'Create Task' }}
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

const taskTypes = [
  { value: 'water', label: 'Water' },
  { value: 'fertilize', label: 'Fertilize' },
  { value: 'prune', label: 'Prune' },
  { value: 'inspect', label: 'Inspect' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'other', label: 'Other' }
]

const priorities = [
  { value: 'low', label: 'Low', activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'medium', label: 'Medium', activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
  { value: 'high', label: 'High', activeClass: 'border-red-400 bg-red-50 text-red-700' }
]

const form = reactive({
  taskType: '',
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'medium',
  notes: ''
})

const isSubmitting = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  if (!form.taskType) return

  isSubmitting.value = true
  error.value = null

  try {
    const requestBody = {
      taskType: form.taskType,
      dueDate: new Date(form.dueDate).getTime(),
      priority: form.priority,
      notes: form.notes || null
    }

    const result = await $fetch(`/api/marker/${props.markerId}/tasks`, {
      method: 'POST',
      body: requestBody
    })

    emit('success', result)
    emit('close')
  } catch (err) {
    console.error('Failed to create task:', err)
    error.value = err.message || 'Failed to create task'
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
