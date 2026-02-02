/**
 * Form configuration for Task form
 * Used with EntityForm component
 */
export const taskFormConfig = {
  endpoint: (markerId) => `/api/marker/${markerId}/tasks`,
  submitButtonText: 'Create Task',
  fields: [
    {
      name: 'taskType',
      type: 'select',
      label: 'Task Type',
      required: true,
      placeholder: 'Select task type...',
      options: [
        { value: 'water', label: 'Water' },
        { value: 'fertilize', label: 'Fertilize' },
        { value: 'prune', label: 'Prune' },
        { value: 'inspect', label: 'Inspect' },
        { value: 'harvest', label: 'Harvest' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Due Date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    {
      name: 'priority',
      type: 'radio',
      label: 'Priority',
      required: true,
      layout: 'horizontal',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      required: false,
      placeholder: 'Additional details...',
      rows: 2
    }
  ],
  transformData: (formData) => ({
    taskType: formData.taskType,
    dueDate: new Date(formData.dueDate).getTime(),
    priority: formData.priority,
    notes: formData.notes || null
  }),
  validate: (formData) => {
    if (!formData.taskType) return 'Please select a task type';
    if (!formData.priority) return 'Please select a priority';
    return null;
  }
};
