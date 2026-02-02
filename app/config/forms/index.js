// Import all form configurations
import { treatmentFormConfig } from './treatment';
import { growthFormConfig } from './growth';
import { healthFormConfig } from './health';
import { taskFormConfig } from './task';
import { yieldFormConfig } from './yield';
import { expenseFormConfig } from './expense';

// Map of form types to configurations
export const formConfigs = {
  treatment: treatmentFormConfig,
  growth: growthFormConfig,
  health: healthFormConfig,
  task: taskFormConfig,
  yield: yieldFormConfig,
  expense: expenseFormConfig
};

// Re-export individual configs
export {
  treatmentFormConfig,
  growthFormConfig,
  healthFormConfig,
  taskFormConfig,
  yieldFormConfig,
  expenseFormConfig
};
