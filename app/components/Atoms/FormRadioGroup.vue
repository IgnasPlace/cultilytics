<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div
      :class="[
        'flex gap-3',
        layout === 'horizontal' ? 'flex-row' : 'flex-col'
      ]"
    >
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          :required="required"
          :disabled="disabled || option.disabled"
          class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
          @change="$emit('update:modelValue', option.value)"
        >
        <span
          :class="[
            'text-sm',
            disabled || option.disabled ? 'text-gray-400' : 'text-gray-700'
          ]"
        >
          {{ option.label }}
        </span>
      </label>
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => options.every(opt => 'value' in opt && 'label' in opt)
  },
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>
