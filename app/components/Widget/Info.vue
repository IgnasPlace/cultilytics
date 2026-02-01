<template>
  <!-- Mobile Bottom Sheet -->
  <div
    class="sm:hidden fixed bottom-0 left-0 right-0 z-30 max-h-[80vh] bg-white rounded-t-xl shadow-2xl flex flex-col"
  >
    <!-- Header with Close Button -->
    <div class="flex justify-end px-4 pt-2">
      <button
        @click="closeWidget"
        class="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
      >
        ×
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="overflow-y-auto flex-1">
      <!-- Plant Header -->
      <WidgetPlantHeader
        :plant="data"
        :latest-health="latestHealth"
        :latest-growth="latestGrowth"
        :pending-tasks="pendingTasks"
      />

      <!-- Action Buttons -->
      <div class="flex gap-2 px-4 py-3 border-b border-gray-200">
        <button
          @click="showAddTreatment = true"
          class="flex-1 px-2 py-2 bg-[#4C763B] text-white rounded-md text-sm font-medium hover:bg-[#598b45] transition-colors"
        >
          + Treatment
        </button>
        <button
          @click="showAddGrowth = true"
          class="flex-1 px-2 py-2 bg-[#4C763B] text-white rounded-md text-sm font-medium hover:bg-[#598b45] transition-colors"
        >
          + Height
        </button>
        <button
          @click="showAddTask = true"
          class="flex-1 px-2 py-2 bg-[#B95E82] text-white rounded-md text-sm font-medium hover:bg-[#a85473] transition-colors"
        >
          + Task
        </button>
      </div>

      <div class="flex gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
        <button
          @click="showUpdateHealth = true"
          class="flex-1 px-3 py-2 bg-white border border-[#4C763B] text-[#4C763B] rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
        >
          Health
        </button>
        <button
          @click="showAddYield = true"
          class="flex-1 px-3 py-2 bg-white border border-amber-500 text-amber-600 rounded-md text-sm font-medium hover:bg-amber-50 transition-colors"
        >
          Harvest
        </button>
        <button
          @click="showAddExpense = true"
          class="flex-1 px-3 py-2 bg-white border border-red-400 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Expense
        </button>
        <button
          @click="deleteMarker"
          class="px-2 py-2 text-red-600 hover:text-red-800 transition-colors text-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Pending Tasks -->
      <div v-if="pendingTasks.length > 0" class="px-4 py-3 border-b border-gray-200 bg-yellow-50">
        <h4 class="text-xs font-medium text-yellow-800 uppercase mb-2">Pending Tasks ({{ pendingTasks.length }})</h4>
        <div class="space-y-2">
          <div
            v-for="task in pendingTasks.slice(0, 3)"
            :key="task.id"
            class="flex items-center gap-2 p-2 bg-white rounded-md border border-yellow-200"
          >
            <button
              @click="completeTask(task.id)"
              :disabled="completingTaskId === task.id"
              class="w-5 h-5 rounded border-2 border-yellow-400 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition-colors"
            >
              <svg v-if="completingTaskId === task.id" class="w-3 h-3 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ formatTaskType(task.taskType) }}</p>
              <p class="text-xs text-gray-500">Due {{ formatDate(task.dueDate) }}</p>
            </div>
            <span
              class="px-2 py-0.5 rounded text-xs font-medium"
              :class="task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'"
            >
              {{ task.priority }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <WidgetPlantTimeline
        :treatments="data.treatments || []"
        :growth-records="data.growthRecords || []"
        :health-records="data.healthRecords || []"
        :max-items="5"
      />

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div class="bg-white p-2 rounded-md border border-gray-200">
          <p class="text-xs text-gray-500 uppercase">Total Yield</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatYield(data.yieldRecords) }}</p>
        </div>
        <div class="bg-white p-2 rounded-md border border-gray-200">
          <p class="text-xs text-gray-500 uppercase">Total Expenses</p>
          <p class="text-lg font-semibold text-red-600">{{ formatExpenses(data.expenses) }}</p>
        </div>
      </div>

      <!-- Image Grid -->
      <div>
        <AtomsImageGrid
          :images="data.markerImage || []"
          :max-visible="4"
          @image-click="openImageCarousel"
        />
      </div>

      <!-- Image Uploader -->
      <div class="px-4 py-4 border-t border-gray-200">
        <WidgetImageUploader
          :marker-id="data.id"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />
      </div>
    </div>

    <!-- Image Carousel Modal -->
    <AtomsImageCarousel
      v-if="isCarouselOpen"
      :images="data.markerImage || []"
      :start-index="currentImageIndex"
      :marker-id="data.id"
      :marker-owner-id="data.userId"
      @close="closeImageCarousel"
      @image-deleted="handleImageDeleted"
    />
  </div>

  <!-- Desktop Layout -->
  <div class="hidden sm:block max-w-sm mx-auto absolute top-3 left-3 bg-white rounded-md z-20 shadow-lg">
    <div class="max-h-[85vh] overflow-y-auto">
      <!-- Close Button -->
      <div class="flex justify-end px-3 pt-2 sticky top-0 bg-white z-10">
        <button
          @click="closeWidget"
          class="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Plant Header -->
      <WidgetPlantHeader
        :plant="data"
        :latest-health="latestHealth"
        :latest-growth="latestGrowth"
        :pending-tasks="pendingTasks"
      />

      <!-- Action Buttons -->
      <div class="flex gap-2 px-4 py-3 border-b border-gray-200">
        <button
          @click="showAddTreatment = true"
          class="flex-1 px-3 py-2 bg-[#4C763B] text-white rounded-md text-sm font-medium hover:bg-[#598b45] transition-colors"
        >
          + Treatment
        </button>
        <button
          @click="showAddGrowth = true"
          class="flex-1 px-3 py-2 bg-[#4C763B] text-white rounded-md text-sm font-medium hover:bg-[#598b45] transition-colors"
        >
          + Height
        </button>
        <button
          @click="showAddTask = true"
          class="flex-1 px-3 py-2 bg-[#B95E82] text-white rounded-md text-sm font-medium hover:bg-[#a85473] transition-colors"
        >
          + Task
        </button>
      </div>

      <div class="flex gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
        <button
          @click="showUpdateHealth = true"
          class="flex-1 px-3 py-2 bg-white border border-[#4C763B] text-[#4C763B] rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
        >
          Health
        </button>
        <button
          @click="showAddYield = true"
          class="flex-1 px-3 py-2 bg-white border border-amber-500 text-amber-600 rounded-md text-sm font-medium hover:bg-amber-50 transition-colors"
        >
          Harvest
        </button>
        <button
          @click="showAddExpense = true"
          class="flex-1 px-3 py-2 bg-white border border-red-400 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Expense
        </button>
        <button
          @click="deleteMarker"
          class="px-2 py-2 text-red-600 hover:text-red-800 transition-colors text-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Pending Tasks -->
      <div v-if="pendingTasks.length > 0" class="px-4 py-3 border-b border-gray-200 bg-yellow-50">
        <h4 class="text-xs font-medium text-yellow-800 uppercase mb-2">Pending Tasks ({{ pendingTasks.length }})</h4>
        <div class="space-y-2">
          <div
            v-for="task in pendingTasks.slice(0, 3)"
            :key="task.id"
            class="flex items-center gap-2 p-2 bg-white rounded-md border border-yellow-200"
          >
            <button
              @click="completeTask(task.id)"
              :disabled="completingTaskId === task.id"
              class="w-5 h-5 rounded border-2 border-yellow-400 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition-colors"
            >
              <svg v-if="completingTaskId === task.id" class="w-3 h-3 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ formatTaskType(task.taskType) }}</p>
              <p class="text-xs text-gray-500">Due {{ formatDate(task.dueDate) }}</p>
            </div>
            <span
              class="px-2 py-0.5 rounded text-xs font-medium"
              :class="task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'"
            >
              {{ task.priority }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <WidgetPlantTimeline
        :treatments="data.treatments || []"
        :growth-records="data.growthRecords || []"
        :health-records="data.healthRecords || []"
        :max-items="5"
      />

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div class="bg-white p-2 rounded-md border border-gray-200">
          <p class="text-xs text-gray-500 uppercase">Total Yield</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatYield(data.yieldRecords) }}</p>
        </div>
        <div class="bg-white p-2 rounded-md border border-gray-200">
          <p class="text-xs text-gray-500 uppercase">Total Expenses</p>
          <p class="text-lg font-semibold text-red-600">{{ formatExpenses(data.expenses) }}</p>
        </div>
      </div>

      <!-- Image Grid -->
      <div class="border-t border-gray-200">
        <AtomsImageGrid
          :images="data.markerImage || []"
          :max-visible="4"
          @image-click="openImageCarousel"
        />
      </div>

      <!-- Image Uploader -->
      <div class="px-4 py-4 border-t border-gray-200">
        <WidgetImageUploader
          :marker-id="data.id"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />
      </div>

      <!-- Image Carousel Modal -->
      <AtomsImageCarousel
        v-if="isCarouselOpen"
        :images="data.markerImage || []"
        :start-index="currentImageIndex"
        :marker-id="data.id"
        :marker-owner-id="data.userId"
        @close="closeImageCarousel"
        @image-deleted="handleImageDeleted"
      />
    </div>
  </div>

  <!-- Treatment Form Modal -->
  <AtomsModal :is-open="showAddTreatment" title="Add Treatment" @close="showAddTreatment = false">
    <div class="w-full max-w-md">
      <WidgetTreatmentForm
        :marker-id="data.id"
        @close="showAddTreatment = false"
        @success="handleTreatmentSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Growth Form Modal -->
  <AtomsModal :is-open="showAddGrowth" title="Add Height Measurement" @close="showAddGrowth = false">
    <div class="w-full max-w-md">
      <WidgetGrowthForm
        :marker-id="data.id"
        @close="showAddGrowth = false"
        @success="handleGrowthSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Task Form Modal -->
  <AtomsModal :is-open="showAddTask" title="Create Task" @close="showAddTask = false">
    <div class="w-full max-w-md">
      <WidgetTaskForm
        :marker-id="data.id"
        @close="showAddTask = false"
        @success="handleTaskSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Health Form Modal -->
  <AtomsModal :is-open="showUpdateHealth" title="Update Health Status" @close="showUpdateHealth = false">
    <div class="w-full max-w-md">
      <WidgetHealthForm
        :marker-id="data.id"
        @close="showUpdateHealth = false"
        @success="handleHealthSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Yield Form Modal -->
  <AtomsModal :is-open="showAddYield" title="Record Harvest" @close="showAddYield = false">
    <div class="w-full max-w-md">
      <WidgetYieldForm
        :marker-id="data.id"
        @close="showAddYield = false"
        @success="handleYieldSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Expense Form Modal -->
  <AtomsModal :is-open="showAddExpense" title="Add Expense" @close="showAddExpense = false">
    <div class="w-full max-w-md">
      <WidgetExpenseForm
        :marker-id="data.id"
        @close="showAddExpense = false"
        @success="handleExpenseSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Delete Confirmation Modal -->
  <AtomsModal :is-open="showDeleteConfirm" title="Delete Marker" @close="showDeleteConfirm = false">
    <div class="p-6 max-w-sm">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Delete {{ data.name }}?</h3>
          <p class="text-sm text-gray-500">ID: {{ data.id }}</p>
        </div>
      </div>
      <p class="text-gray-600 mb-6">
        This action cannot be undone. All data including photos, treatment records, and task history will be permanently deleted.
      </p>
      <div class="flex gap-3">
        <button
          @click="showDeleteConfirm = false"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          :disabled="isDeleting"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          :disabled="isDeleting"
        >
          <svg v-if="isDeleting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </AtomsModal>
</template>

<script setup>
const props = defineProps(["data"]);

const markerStore = useStore("markers");
const { showInfoWidget, currentSelectedMarker } = storeToRefs(markerStore);

const isCarouselOpen = ref(false);
const currentImageIndex = ref(0);
const showAddTreatment = ref(false);
const showAddGrowth = ref(false);
const showAddTask = ref(false);
const showUpdateHealth = ref(false);
const showAddYield = ref(false);
const showAddExpense = ref(false);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);
const completingTaskId = ref(null);

const latestHealth = computed(() => {
  if (!props.data?.healthRecords || props.data.healthRecords.length === 0) return null;
  return props.data.healthRecords[0];
});

const latestGrowth = computed(() => {
  if (!props.data?.growthRecords || props.data.growthRecords.length === 0) return null;
  return props.data.growthRecords[0];
});

const pendingTasks = computed(() => {
  if (!props.data?.tasks) return [];
  return props.data.tasks.filter(task => !task.completedAt);
});

const closeWidget = () => {
  showInfoWidget.value = false;
  currentSelectedMarker.value = null;
};

const deleteMarker = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    await useDeleteMarker(props.data.id);
    showDeleteConfirm.value = false;
    closeWidget();
  } catch (err) {
    console.error('Failed to delete marker:', err);
  } finally {
    isDeleting.value = false;
  }
};

const handleUploadSuccess = (result) => {
  console.log("Upload successful:", result);
};

const handleUploadError = (error) => {
  console.error("Upload error:", error);
};

const handleImageDeleted = (imageId) => {
  if (props.data.markerImage.length === 0) {
    closeImageCarousel();
  }
};

const openImageCarousel = (index) => {
  currentImageIndex.value = index;
  isCarouselOpen.value = true;
};

const closeImageCarousel = () => {
  isCarouselOpen.value = false;
  currentImageIndex.value = 0;
};

const refreshMarkerData = async () => {
  try {
    const refreshedData = await $fetch(`/api/marker/${props.data.id}`);

    // Update the marker in savedMarkers array
    const markerIndex = markerStore.savedMarkers.findIndex(m => m.id === props.data.id);
    if (markerIndex !== -1) {
      markerStore.savedMarkers[markerIndex] = refreshedData;
    }

    // Update currentSelectedMarker to trigger reactivity
    markerStore.setCurrentSelectedMarker(refreshedData);
  } catch (err) {
    console.error('Failed to refresh marker data:', err);
  }
};

const handleTreatmentSuccess = async () => {
  showAddTreatment.value = false;
  await refreshMarkerData();
};

const handleGrowthSuccess = async () => {
  showAddGrowth.value = false;
  await refreshMarkerData();
};

const handleTaskSuccess = async () => {
  showAddTask.value = false;
  await refreshMarkerData();
};

const handleHealthSuccess = async () => {
  showUpdateHealth.value = false;
  await refreshMarkerData();
};

const handleYieldSuccess = async () => {
  showAddYield.value = false;
  await refreshMarkerData();
};

const handleExpenseSuccess = async () => {
  showAddExpense.value = false;
  await refreshMarkerData();
};

const formatTaskType = (type) => {
  const types = {
    water: 'Water',
    fertilize: 'Fertilize',
    prune: 'Prune',
    inspect: 'Inspect',
    harvest: 'Harvest',
    other: 'Other'
  };
  return types[type] || type;
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatYield = (records) => {
  if (!records || records.length === 0) return '0 kg';
  const totalKg = records.reduce((sum, r) => {
    if (r.unit === 'kg') return sum + r.quantity / 100;
    if (r.unit === 'g') return sum + r.quantity / 100000;
    return sum;
  }, 0);
  return `${totalKg.toFixed(1)} kg`;
};

const formatExpenses = (expenses) => {
  if (!expenses || expenses.length === 0) return '€0';
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return `€${(total / 100).toFixed(2)}`;
};

const completeTask = async (taskId) => {
  completingTaskId.value = taskId;
  try {
    await $fetch(`/api/marker/${props.data.id}/tasks/${taskId}`, {
      method: 'PATCH',
      body: { completed: true }
    });
    await refreshMarkerData();
  } catch (err) {
    console.error('Failed to complete task:', err);
    alert('Failed to complete task');
  } finally {
    completingTaskId.value = null;
  }
};
</script>
