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
      <MoleculesPlantHeader
        :plant="data"
        :latest-health="latestHealth"
        :latest-growth="latestGrowth"
        :pending-tasks="pendingTasks"
      />

      <!-- Action Buttons -->
      <div class="flex gap-2 px-4 py-3 border-b border-gray-200">
        <AtomsButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click="showAddTreatment = true"
        >
          + Treatment
        </AtomsButton>
        <AtomsButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click="showAddGrowth = true"
        >
          + Height
        </AtomsButton>
        <AtomsButton
          variant="secondary"
          size="sm"
          class="flex-1"
          @click="showAddTask = true"
        >
          + Task
        </AtomsButton>
      </div>

      <div class="flex gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
        <AtomsButton
          variant="outline"
          size="sm"
          class="flex-1 border-primary text-primary hover:bg-green-50"
          @click="showUpdateHealth = true"
        >
          Health
        </AtomsButton>
        <AtomsButton
          variant="outline"
          size="sm"
          class="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50"
          @click="showAddYield = true"
        >
          Harvest
        </AtomsButton>
        <AtomsButton
          variant="outline"
          size="sm"
          class="flex-1 border-red-400 text-red-500 hover:bg-red-50"
          @click="showAddExpense = true"
        >
          Expense
        </AtomsButton>
        <button
          @click="deleteMarker"
          class="px-2 py-2 text-red-600 hover:text-red-800 transition-colors text-sm"
        >
          <AtomsIcon name="trash" color="red" />
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
              <AtomsIcon v-if="completingTaskId === task.id" name="spinner" size="sm" />
            </button>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ formatTaskType(task.taskType) }}</p>
              <p class="text-xs text-gray-500">Due {{ formatDate(task.dueDate) }}</p>
            </div>
            <AtomsBadge :variant="task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'" size="sm">{{ task.priority }}</AtomsBadge>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <MoleculesPlantTimeline
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
        <MoleculesImageUploader
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
      <MoleculesPlantHeader
        :plant="data"
        :latest-health="latestHealth"
        :latest-growth="latestGrowth"
        :pending-tasks="pendingTasks"
      />

      <!-- Action Buttons -->
      <div class="flex gap-2 px-4 py-3 border-b border-gray-200">
        <AtomsButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click="showAddTreatment = true"
        >
          + Treatment
        </AtomsButton>
        <AtomsButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click="showAddGrowth = true"
        >
          + Height
        </AtomsButton>
        <AtomsButton
          variant="secondary"
          size="sm"
          class="flex-1"
          @click="showAddTask = true"
        >
          + Task
        </AtomsButton>
      </div>

      <div class="flex gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
        <AtomsButton
          variant="outline"
          size="sm"
          class="flex-1 border-primary text-primary hover:bg-green-50"
          @click="showUpdateHealth = true"
        >
          Health
        </AtomsButton>
        <AtomsButton
          variant="outline"
          size="sm"
          class="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50"
          @click="showAddYield = true"
        >
          Harvest
        </AtomsButton>
        <AtomsButton
          variant="outline"
          size="sm"
          class="flex-1 border-red-400 text-red-500 hover:bg-red-50"
          @click="showAddExpense = true"
        >
          Expense
        </AtomsButton>
        <button
          @click="deleteMarker"
          class="px-2 py-2 text-red-600 hover:text-red-800 transition-colors text-sm"
        >
          <AtomsIcon name="trash" color="red" />
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
              <AtomsIcon v-if="completingTaskId === task.id" name="spinner" size="sm" />
            </button>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ formatTaskType(task.taskType) }}</p>
              <p class="text-xs text-gray-500">Due {{ formatDate(task.dueDate) }}</p>
            </div>
            <AtomsBadge :variant="task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'" size="sm">{{ task.priority }}</AtomsBadge>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <MoleculesPlantTimeline
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
        <MoleculesImageUploader
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
      <MoleculesEntityForm
        :marker-id="data.id"
        :config="treatmentFormConfig"
        @close="showAddTreatment = false"
        @success="handleTreatmentSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Growth Form Modal -->
  <AtomsModal :is-open="showAddGrowth" title="Add Height Measurement" @close="showAddGrowth = false">
    <div class="w-full max-w-md">
      <MoleculesEntityForm
        :marker-id="data.id"
        :config="growthFormConfig"
        @close="showAddGrowth = false"
        @success="handleGrowthSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Task Form Modal -->
  <AtomsModal :is-open="showAddTask" title="Create Task" @close="showAddTask = false" class="min-w-[90vw]">
    <div class="w-full max-w-md">
      <MoleculesEntityForm
        :marker-id="data.id"
        :config="taskFormConfig"
        @close="showAddTask = false"
        @success="handleTaskSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Health Form Modal -->
  <AtomsModal :is-open="showUpdateHealth" title="Update Health Status" @close="showUpdateHealth = false">
    <div class="w-full max-w-md">
      <MoleculesEntityForm
        :marker-id="data.id"
        :config="healthFormConfig"
        @close="showUpdateHealth = false"
        @success="handleHealthSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Yield Form Modal -->
  <AtomsModal :is-open="showAddYield" title="Record Harvest" @close="showAddYield = false">
    <div class="w-full max-w-md">
      <MoleculesEntityForm
        :marker-id="data.id"
        :config="yieldFormConfig"
        @close="showAddYield = false"
        @success="handleYieldSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Expense Form Modal -->
  <AtomsModal :is-open="showAddExpense" title="Add Expense" @close="showAddExpense = false">
    <div class="w-full max-w-md">
      <MoleculesEntityForm
        :marker-id="data.id"
        :config="expenseFormConfig"
        @close="showAddExpense = false"
        @success="handleExpenseSuccess"
      />
    </div>
  </AtomsModal>

  <!-- Delete Confirmation Modal -->
  <AtomsConfirmationModal
    :is-open="showDeleteConfirm"
    title="Delete Marker"
    :subtitle="`ID: ${data.id}`"
    message="This action cannot be undone. All data including photos, treatment records, and task history will be permanently deleted."
    confirm-text="Delete"
    :confirm-variant="'danger'"
    :is-processing="isDeleting"
    icon-name="trash"
    @close="showDeleteConfirm = false"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import {
  treatmentFormConfig,
  growthFormConfig,
  healthFormConfig,
  taskFormConfig,
  yieldFormConfig,
  expenseFormConfig
} from '~/config/forms';

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
