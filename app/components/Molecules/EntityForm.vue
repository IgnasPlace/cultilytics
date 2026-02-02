<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
    <div
      v-for="field in config.fields"
      :key="field.name"
    >
      <!-- Text/Number/Date Input -->
      <AtomsFormInput
        v-if="['text', 'number', 'date'].includes(field.type)"
        v-model="formData[field.name]"
        :label="field.label"
        :type="field.type"
        :required="field.required"
        :placeholder="field.placeholder"
        :min="field.min"
        :step="field.step"
      />

      <!-- Select Input -->
      <AtomsFormSelect
        v-else-if="field.type === 'select'"
        v-model="formData[field.name]"
        :label="field.label"
        :options="field.options"
        :required="field.required"
        :placeholder="field.placeholder"
      />

      <!-- Textarea Input -->
      <AtomsFormTextarea
        v-else-if="field.type === 'textarea'"
        v-model="formData[field.name]"
        :label="field.label"
        :required="field.required"
        :placeholder="field.placeholder"
        :rows="field.rows"
      />

      <!-- Radio Group Input -->
      <AtomsFormRadioGroup
        v-else-if="field.type === 'radio'"
        v-model="formData[field.name]"
        :label="field.label"
        :name="field.name"
        :options="field.options"
        :required="field.required"
        :layout="field.layout || 'horizontal'"
      />
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div class="flex gap-3 pt-2">
      <AtomsButton
        variant="outline"
        class="flex-1"
        @click="$emit('close')"
      >
        Cancel
      </AtomsButton>
      <AtomsButton
        type="submit"
        variant="primary"
        class="flex-1"
        :loading="isSubmitting"
      >
        {{ config.submitButtonText || 'Save' }}
      </AtomsButton>
    </div>
  </form>
</template>

<script setup>
import { useFormSubmit } from '@/composables/useFormSubmit';

const props = defineProps({
  markerId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'success']);

const toast = useToast();

// Initialize form data with default values
const formData = reactive(
  props.config.fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ? field.defaultValue() : '';
    return acc;
  }, {})
);

const { isSubmitting, error, submitForm } = useFormSubmit();

const handleSubmit = async () => {
  // Validate form
  if (props.config.validate) {
    const validationError = props.config.validate(formData);
    if (validationError) {
      error.value = validationError;
      return;
    }
  }

  try {
    // Transform data if needed
    const requestBody = props.config.transformData
      ? props.config.transformData(formData)
      : formData;

    const endpoint = typeof props.config.endpoint === 'function'
      ? props.config.endpoint(props.markerId)
      : props.config.endpoint;

    const result = await submitForm(
      endpoint,
      requestBody,
      'POST',
      (response) => {
        emit('success', response);
        emit('close');
      }
    );
  } catch (err) {
    console.error('Form submission failed:', err);
    toast.error({
      title: 'Error',
      message: err?.message || 'Failed to save',
      position: 'topCenter'
    });
  }
};
</script>
