<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
      badgeClasses
    ]"
  >
    <span :class="['w-2 h-2 rounded-full', dotClasses]" />
    {{ displayStatus }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['excellent', 'good', 'fair', 'poor', 'critical'].includes(value)
  }
});

const statusConfig = {
  excellent: {
    bg: 'bg-green-100 text-green-800',
    dot: 'bg-green-500'
  },
  good: {
    bg: 'bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500'
  },
  fair: {
    bg: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-500'
  },
  poor: {
    bg: 'bg-orange-100 text-orange-800',
    dot: 'bg-orange-500'
  },
  critical: {
    bg: 'bg-red-100 text-red-800',
    dot: 'bg-red-500'
  }
};

const badgeClasses = computed(() => statusConfig[props.status]?.bg || 'bg-gray-100 text-gray-800');
const dotClasses = computed(() => statusConfig[props.status]?.dot || 'bg-gray-500');
const displayStatus = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1);
});
</script>
