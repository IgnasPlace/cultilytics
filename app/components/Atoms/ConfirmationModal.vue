<template>
  <AtomsModal :is-open="isOpen" :title="title" @close="$emit('close')">
    <div class="p-6 max-w-sm">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="iconBgClass"
        >
          <AtomsIcon
            :name="iconName"
            size="md"
            :color="iconColor"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
        </div>
      </div>
      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>
      <div class="flex gap-3">
        <AtomsButton
          variant="outline"
          class="flex-1"
          :disabled="isProcessing"
          @click="$emit('close')"
        >
          {{ cancelText }}
        </AtomsButton>
        <AtomsButton
          :variant="confirmVariant"
          class="flex-1"
          :loading="isProcessing"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </AtomsButton>
      </div>
    </div>
  </AtomsModal>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmVariant: {
    type: String,
    default: 'danger',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  isProcessing: {
    type: Boolean,
    default: false
  },
  iconName: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'trash', 'info'].includes(value)
  }
});

defineEmits(['close', 'confirm']);

const iconConfig = {
  warning: { bg: 'bg-yellow-100', color: 'amber' },
  trash: { bg: 'bg-red-100', color: 'red' },
  info: { bg: 'bg-blue-100', color: 'gray' }
};

const iconBgClass = computed(() => iconConfig[props.iconName].bg);
const iconColor = computed(() => iconConfig[props.iconName].color);
</script>
