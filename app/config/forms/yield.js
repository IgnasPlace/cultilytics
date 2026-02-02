/**
 * Form configuration for Yield form
 * Used with EntityForm component
 */
export const yieldFormConfig = {
  endpoint: (markerId) => `/api/marker/${markerId}/yield`,
  submitButtonText: 'Record Harvest',
  fields: [
    {
      name: 'quantity',
      type: 'number',
      label: 'Quantity',
      required: true,
      placeholder: '0',
      min: 0,
      step: 0.01
    },
    {
      name: 'unit',
      type: 'radio',
      label: 'Unit',
      required: true,
      layout: 'horizontal',
      options: [
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'g', label: 'Grams (g)' },
        { value: 'units', label: 'Units' }
      ]
    },
    {
      name: 'harvestDate',
      type: 'date',
      label: 'Harvest Date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      required: false,
      placeholder: 'Notes about the harvest...',
      rows: 2
    }
  ],
  transformData: (formData) => {
    // Convert grams to kg if needed
    let quantityValue = formData.quantity;
    if (formData.unit === 'g') {
      quantityValue = (parseFloat(formData.quantity) / 1000).toString();
    }
    
    return {
      quantity: Math.round(parseFloat(quantityValue) * 100),
      unit: formData.unit === 'g' ? 'kg' : formData.unit,
      harvestDate: new Date(formData.harvestDate).getTime(),
      notes: formData.notes || null
    };
  },
  validate: (formData) => {
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      return 'Please enter a valid quantity';
    }
    if (!formData.unit) return 'Please select a unit';
    return null;
  }
};
