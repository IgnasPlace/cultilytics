<template>
  <div class="px-4 pt-4 pb-3 border-b border-gray-200">
    <!-- Plant Icon & Name -->
    <div class="flex items-start gap-3">
      <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">{{ plantIcon }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-bold text-gray-900 leading-tight truncate">
          {{ plant.name }}
        </h2>
        <p class="text-sm text-gray-500">#{{ plant.id }}</p>
        <div class="flex items-center gap-2 mt-1">
          <AtomsHealthBadge v-if="latestHealth" :status="latestHealth.status" />
          <span v-else class="text-xs text-gray-400">No health data</span>
          <span class="text-xs text-gray-400">•</span>
          <span class="text-xs text-gray-600">{{ plantType }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-2 mt-4">
      <div class="bg-gray-50 rounded-lg p-2 text-center">
        <div class="flex items-center justify-center gap-1 text-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span class="text-sm font-semibold">{{ currentHeight }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">Height</p>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-2 text-center">
        <div class="flex items-center justify-center gap-1 text-blue-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-semibold">{{ plantAge }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">Age</p>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-2 text-center">
        <div class="flex items-center justify-center gap-1" :class="nextTaskColor">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text-sm font-semibold">{{ nextTaskText }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">Next Task</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  plant: {
    type: Object,
    required: true
  },
  latestHealth: {
    type: Object,
    default: null
  },
  latestGrowth: {
    type: Object,
    default: null
  },
  pendingTasks: {
    type: Array,
    default: () => []
  }
});

const plantIcons = {
  tree: '🌳',
  shrub: '🌿',
  flower: '🌸',
  vegetable: '🥬',
  fruit: '🍎',
  herb: '🌿',
  default: '🌱'
};

const plantIcon = computed(() => {
  const type = props.plant?.type?.toLowerCase();
  return plantIcons[type] || plantIcons.default;
});

const plantType = computed(() => {
  return props.plant?.type?.charAt(0).toUpperCase() + props.plant?.type?.slice(1) || 'Plant';
});

const currentHeight = computed(() => {
  if (!props.latestGrowth) return '0cm';
  return `${props.latestGrowth.height}cm`;
});

const plantAge = computed(() => {
  if (!props.plant?.createdAt) return 'New';
  const created = new Date(props.plant.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays}d`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}m`;
  return `${Math.floor(diffDays / 365)}y`;
});

const nextTask = computed(() => {
  if (!props.pendingTasks || props.pendingTasks.length === 0) return null;
  return props.pendingTasks[0];
});

const nextTaskText = computed(() => {
  if (!nextTask.value) return 'None';
  const due = new Date(nextTask.value.dueDate);
  const now = new Date();
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d';
  if (diffDays <= 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
});

const nextTaskColor = computed(() => {
  if (!nextTask.value) return 'text-gray-400';
  const due = new Date(nextTask.value.dueDate);
  const now = new Date();
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'text-red-600';
  if (diffDays <= 1) return 'text-orange-600';
  if (diffDays <= 3) return 'text-yellow-600';
  return 'text-green-600';
});
</script>
