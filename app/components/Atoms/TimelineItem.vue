<template>
  <div class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', iconBgClass]">
      <svg class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
      </svg>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-medium text-gray-900">{{ title }}</p>
        <span class="text-xs text-gray-500 whitespace-nowrap">{{ formattedDate }}</span>
      </div>
      <p v-if="description" class="text-xs text-gray-600 mt-0.5">{{ description }}</p>
      <p v-if="meta" class="text-xs text-gray-400 mt-0.5">{{ meta }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['treatment', 'growth', 'health', 'task', 'image'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  meta: {
    type: String,
    default: ''
  },
  date: {
    type: [Number, String, Date],
    required: true
  }
});

const iconConfig = {
  treatment: {
    bg: 'bg-blue-100',
    color: 'text-blue-600',
    path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  growth: {
    bg: 'bg-green-100',
    color: 'text-green-600',
    path: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  },
  health: {
    bg: 'bg-emerald-100',
    color: 'text-emerald-600',
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  task: {
    bg: 'bg-yellow-100',
    color: 'text-yellow-600',
    path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  image: {
    bg: 'bg-purple-100',
    color: 'text-purple-600',
    path: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
  }
};

const iconBgClass = computed(() => iconConfig[props.type]?.bg || 'bg-gray-100');
const iconColorClass = computed(() => iconConfig[props.type]?.color || 'text-gray-600');
const iconPath = computed(() => iconConfig[props.type]?.path || '');

const formattedDate = computed(() => {
  if (!props.date) return '';
  const date = new Date(props.date);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});
</script>
