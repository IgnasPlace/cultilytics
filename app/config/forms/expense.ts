import type { FormConfig } from './types';

/**
 * Form configuration for Expense form
 * Used with EntityForm component
 */
export const expenseFormConfig: FormConfig = {
  endpoint: (markerId: string) => `/api/marker/${markerId}/expenses`,
  submitButtonText: 'Add Expense',
  fields: [
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      placeholder: 'Select category...',
      options: [
        { value: 'seeds', label: 'Seeds/Plants' },
        { value: 'fertilizer', label: 'Fertilizer' },
        { value: 'tools', label: 'Tools/Equipment' },
        { value: 'water', label: 'Water' },
        { value: 'labor', label: 'Labor' },
        { value: 'pest_control', label: 'Pest Control' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Amount (€)',
      required: true,
      placeholder: '0.00',
      min: 0,
      step: 0.01
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      placeholder: 'What was purchased, supplier, etc.',
      rows: 2
    }
  ],
  transformData: (formData: Record<string, any>) => ({
    category: formData.category,
    amount: Math.round(parseFloat(formData.amount) * 100),
    date: new Date(formData.date).getTime(),
    description: formData.description || null
  }),
  validate: (formData: Record<string, any>) => {
    if (!formData.category) return 'Please select a category';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return 'Please enter a valid amount';
    }
    return null;
  }
};
