import { ref } from "vue";

/**
 * Composable for generic form submission with loading and error states
 * Eliminates duplicate form submission logic across form components
 */
export function useFormSubmit() {
  const isSubmitting = ref<boolean>(false);
  const error = ref<string | null>(null);

  /**
   * Submit form data to an API endpoint
   * @param endpoint - API endpoint URL
   * @param data - Form data to submit
   * @param method - HTTP method (POST, PUT, PATCH, GET, DELETE)
   * @param onSuccess - Callback on successful submission
   * @param onError - Callback on error
   * @returns Response data
   */
  const submitForm = async <T = any>(
    endpoint: string,
    data: Record<string, any>,
    method: "POST" | "PUT" | "PATCH" | "GET" | "DELETE" = "POST",
    onSuccess: ((response: T) => void) | null = null,
    onError: ((error: Error) => void) | null = null
  ): Promise<T> => {
    isSubmitting.value = true;
    error.value = null;

    try {
      const response: T = await $fetch(endpoint, {
        method: method as any,
        body: data
      });

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      console.error('Form submission error:', err);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Reset the form state
   */
  const resetForm = (): void => {
    isSubmitting.value = false;
    error.value = null;
  };

  return {
    isSubmitting,
    error,
    submitForm,
    resetForm
  };
}
