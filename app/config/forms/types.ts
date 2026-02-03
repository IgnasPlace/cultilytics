export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  layout?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: () => string | undefined;
  rows?: number;
  min?: number;
  step?: number;
}

export interface FormConfig {
  endpoint: (markerId: string) => string;
  submitButtonText: string;
  fields: FormField[];
  transformData: (formData: Record<string, any>) => Record<string, any>;
  validate: (formData: Record<string, any>) => string | null;
}
