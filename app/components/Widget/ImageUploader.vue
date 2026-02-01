<template>
  <div class="flex flex-col gap-4">
    <!-- Not Logged In Message -->
    <div v-if="!loggedIn" class="p-3 bg-gray-50 rounded-md text-center">
      <p class="text-gray-500 text-sm">Please log in to upload images</p>
      <NuxtLink
        to="/login"
        class="text-[#4C763B] text-sm hover:underline mt-1 inline-block"
      >
        Log in
      </NuxtLink>
    </div>

    <!-- Uploader Content (Only when logged in) -->
    <template v-else>
      <!-- Dropzone -->
      <AtomsImageDropzone
        :max-files="maxFiles"
        :disabled="uploading"
        @files-selected="handleFilesSelected"
        @error="handleDropzoneError"
      />

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 rounded-md p-3"
      >
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Selected Files -->
      <div v-if="files.length > 0">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-sm font-medium text-gray-700">
            Selected Images ({{ files.length }}/{{ maxFiles }})
          </h4>
          <button
            v-if="!uploading"
            @click="clearAllFiles"
            class="text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            Clear All
          </button>
        </div>

        <!-- Files Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AtomsImagePreview
            v-for="(file, index) in files"
            :key="file.name + index"
            :file="file"
            :disabled="uploading"
            :upload-status="getUploadStatus(file)"
            :upload-progress="getUploadProgress(file)"
            :error-message="getFileError(file)"
            @remove="handleRemoveFile"
            @retry="handleRetryUpload"
          />
        </div>

        <!-- Upload Button -->
        <div class="flex justify-end mt-4">
          <button
            @click="handleUpload"
            :disabled="uploading || files.length === 0"
            class="px-6 py-2 bg-[#4C763B] text-white rounded-md hover:bg-[#598b45] transition-colors disabled:bg-[#63745d] disabled:cursor-not-allowed flex items-center gap-2"
          >
            <AtomsSpinner v-if="uploading" class="w-4 h-4" />
            {{
              uploading
                ? "Uploading..."
                : `Upload ${files.length} Image${files.length > 1 ? "s" : ""}`
            }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const emit = defineEmits(["upload-success", "upload-error"]);

const props = defineProps({
  markerId: {
    type: String,
    required: true,
  },
  maxFiles: {
    type: Number,
    default: 3,
  },
});

const toast = useToast();
const markerStore = useStore("markers");

// Authentication check
const { loggedIn } = useUserSession();

const files = ref([]);
const uploading = ref(false);
const errorMessage = ref("");

// Track upload progress and status per file
const uploadStatus = ref({}); // file.name -> 'pending'|'uploading'|'success'|'error'
const uploadProgress = ref({}); // file.name -> number (0-100)
const fileErrors = ref({}); // file.name -> error message

const handleFilesSelected = (selectedFiles) => {
  // Replace existing files (not append) to maintain maxFiles limit
  files.value = selectedFiles;
  errorMessage.value = "";

  // Reset upload states for new files
  selectedFiles.forEach((file) => {
    uploadStatus.value[file.name] = "pending";
    uploadProgress.value[file.name] = 0;
    fileErrors.value[file.name] = "";
  });
};

const handleDropzoneError = (error) => {
  errorMessage.value = error;
  // Clear error after 5 seconds
  setTimeout(() => {
    errorMessage.value = "";
  }, 5000);
};

const handleRemoveFile = (fileToRemove) => {
  const index = files.value.findIndex(
    (file) => file.name === fileToRemove.name,
  );
  if (index > -1) {
    files.value.splice(index, 1);
    // Clean up state
    delete uploadStatus.value[fileToRemove.name];
    delete uploadProgress.value[fileToRemove.name];
    delete fileErrors.value[fileToRemove.name];
  }
};

const clearAllFiles = () => {
  files.value = [];
  uploadStatus.value = {};
  uploadProgress.value = {};
  fileErrors.value = {};
  errorMessage.value = "";
};

const handleRetryUpload = (fileToRetry) => {
  // Reset specific file status
  uploadStatus.value[fileToRetry.name] = "pending";
  uploadProgress.value[fileToRetry.name] = 0;
  fileErrors.value[fileToRetry.name] = "";
};

const getUploadStatus = (file) => {
  return uploadStatus.value[file.name] || "pending";
};

const getUploadProgress = (file) => {
  return uploadProgress.value[file.name] || 0;
};

const getFileError = (file) => {
  return fileErrors.value[file.name] || "";
};

const handleUpload = async () => {
  if (files.value.length === 0) return;

  uploading.value = true;
  errorMessage.value = "";

  try {
    const formData = new FormData();

    // Add all files to FormData
    files.value.forEach((file) => {
      formData.append("files", file);
      uploadStatus.value[file.name] = "uploading";
      uploadProgress.value[file.name] = 50; // Indicate upload started
    });

    await $fetch(`/api/marker-image/${props.markerId}`, {
      method: "POST",
      body: formData,
      onResponse: ({ response }) => {
        if (response._data.success) {
          // Mark all files as successful
          files.value.forEach((file) => {
            uploadStatus.value[file.name] = "success";
            uploadProgress.value[file.name] = 100;
          });

          toast.success({
            title: "Upload Complete!",
            message: `${files.value.length} image${files.value.length > 1 ? "s" : ""} saved`,
            position: "topCenter",
          });

          // Update marker store
          markerStore.addMarkerImages(props.markerId, response._data.result);

          // Emit success event
          emit("upload-success", response._data.result);

          // Clear files after successful upload
          setTimeout(() => {
            clearAllFiles();
          }, 1500);
        }
      },
      onResponseError: ({ response }) => {
        console.error("Upload error:", response);

        // Mark all files as failed
        files.value.forEach((file) => {
          uploadStatus.value[file.name] = "error";
          fileErrors.value[file.name] =
            response._data.message || "Upload failed";
        });

        toast.error({
          title: "Upload Failed",
          message: response._data.message || "Something went wrong",
          position: "topCenter",
        });

        emit("upload-error", response._data);
      },
    });
  } catch (err) {
    console.error("Unexpected upload error:", err);

    // Mark all files as failed
    files.value.forEach((file) => {
      uploadStatus.value[file.name] = "error";
      fileErrors.value[file.name] = "Network error";
    });

    errorMessage.value = "Network error. Please try again.";

    toast.error({
      title: "Upload Failed",
      message: "Network error. Please try again.",
      position: "topCenter",
    });

    emit("upload-error", { message: errorMessage.value });
  } finally {
    uploading.value = false;
  }
};

// Cleanup on unmount
onUnmounted(() => {
  clearAllFiles();
});
</script>
