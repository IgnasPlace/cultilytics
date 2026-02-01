<template>
  <div class="px-4 py-3">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-900">Recent Activity</h3>
      <button 
        v-if="timelineItems.length > 0"
        @click="showAll = !showAll"
        class="text-xs text-[#4C763B] hover:text-[#598b45]"
      >
        {{ showAll ? 'Show Less' : 'View All' }}
      </button>
    </div>
    
    <div v-if="timelineItems.length === 0" class="text-center py-6 text-gray-400">
      <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm">No activity yet</p>
    </div>
    
    <div v-else>
      <AtomsTimelineItem
        v-for="item in displayItems"
        :key="item.id"
        :type="item.type"
        :title="item.title"
        :description="item.description"
        :meta="item.meta"
        :date="item.date"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  treatments: {
    type: Array,
    default: () => []
  },
  growthRecords: {
    type: Array,
    default: () => []
  },
  healthRecords: {
    type: Array,
    default: () => []
  },
  maxItems: {
    type: Number,
    default: 5
  }
});

const showAll = ref(false);

const treatmentTypeLabels = {
  pruning: 'Pruned',
  fertilizing: 'Fertilized',
  watering: 'Watered',
  pest_control: 'Pest Control',
  mulching: 'Mulched',
  other: 'Treated'
};

const timelineItems = computed(() => {
  const items = [];
  
  props.treatments.forEach(treatment => {
    items.push({
      id: `treatment-${treatment.id}`,
      type: 'treatment',
      title: treatmentTypeLabels[treatment.type] || 'Treated',
      description: treatment.notes || '',
      meta: treatment.cost ? `€${(treatment.cost / 100).toFixed(2)}` : '',
      date: treatment.date,
      sortDate: new Date(treatment.date).getTime()
    });
  });
  
  props.growthRecords.forEach(record => {
    items.push({
      id: `growth-${record.id}`,
      type: 'growth',
      title: `Height: ${record.height}cm`,
      description: record.notes || '',
      meta: '',
      date: record.measuredAt,
      sortDate: new Date(record.measuredAt).getTime()
    });
  });
  
  props.healthRecords.forEach(record => {
    items.push({
      id: `health-${record.id}`,
      type: 'health',
      title: `Health: ${record.status}`,
      description: record.notes || '',
      meta: '',
      date: record.recordedAt,
      sortDate: new Date(record.recordedAt).getTime()
    });
  });
  
  return items.sort((a, b) => b.sortDate - a.sortDate);
});

const displayItems = computed(() => {
  if (showAll.value) return timelineItems.value;
  return timelineItems.value.slice(0, props.maxItems);
});
</script>
