/**
 * Form configuration for Treatment form
 * Used with EntityForm component
 */
export const treatmentFormConfig = {
  endpoint: (markerId) => `/api/marker/${markerId}/treatments`,
  submitButtonText: 'Save',
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Treatment Type',
      required: true,
      placeholder: 'Select type...',
      options: [
        { value: 'pruning', label: 'Pruning' },
        { value: 'fertilizing', label: 'Fertilizing' },
        { value: 'watering', label: 'Watering' },
        { value: 'pest_control', label: 'Pest Control' },
        { value: 'mulching', label: 'Mulching' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    {
      name: 'cost',
      type: 'number',
      label: 'Cost (€)',
      required: false,
      placeholder: '0.00',
      min: 0,
      step: 0.01
    },
    {
      name: 'products',
      type: 'text',
      label: 'Products Used',
      required: false,
      placeholder: 'e.g., Organic fertilizer, Compost...'
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      required: false,
      placeholder: 'Additional details about the treatment...',
      rows: 3
    }
  ],
  transformData: (formData) => ({
    type: formData.type,
    date: new Date(formData.date).getTime(),
    cost: formData.cost !== '' ? Math.round(parseFloat(formData.cost) * 100) : undefined,
    products: formData.products || undefined,
    notes: formData.notes || undefined
  }),
  validate: (formData) => {
    if (!formData.type) return 'Please select a treatment type';
    return null;
  }
};
