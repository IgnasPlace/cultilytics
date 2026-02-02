/**
 * Form configuration for Health form
 * Used with EntityForm component
 */
export const healthFormConfig = {
  endpoint: (markerId) => `/api/marker/${markerId}/health`,
  submitButtonText: 'Save',
  fields: [
    {
      name: 'status',
      type: 'radio',
      label: 'Health Status',
      required: true,
      layout: 'vertical',
      options: [
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'critical', label: 'Critical' }
      ]
    },
    {
      name: 'date',
      type: 'date',
      label: 'Assessment Date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      required: false,
      placeholder: "Describe the plant's condition, any issues observed...",
      rows: 3
    }
  ],
  transformData: (formData) => ({
    status: formData.status,
    recordedAt: new Date(formData.date).getTime(),
    notes: formData.notes || null
  }),
  validate: (formData) => {
    if (!formData.status) return 'Please select a health status';
    return null;
  }
};
