import type { FormConfig } from './types';

/**
 * Form configuration for Growth form
 * Used with EntityForm component
 */
export const growthFormConfig: FormConfig = {
  endpoint: (markerId: string) => `/api/marker/${markerId}/growth`,
  submitButtonText: 'Record Height',
  fields: [
    {
      name: 'height',
      type: 'number',
      label: 'Height (cm)',
      required: true,
      placeholder: '0',
      min: 0,
      step: 0.1
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      required: false,
      placeholder: 'Any observations about growth...',
      rows: 2
    }
  ],
  transformData: (formData: Record<string, any>) => ({
    height: parseInt(formData.height),
    measuredAt: new Date(formData.date).getTime(),
    notes: formData.notes || null
  }),
  validate: (formData: Record<string, any>) => {
    if (!formData.height || parseFloat(formData.height) <= 0) {
      return 'Please enter a valid height';
    }
    return null;
  }
};
