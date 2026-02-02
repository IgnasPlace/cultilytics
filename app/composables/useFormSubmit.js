/**
 * Composable for generic form submission with loading and error states
 * Eliminates duplicate form submission logic across form components
 */
export function useFormSubmit() {
  const isSubmitting = ref(false);
  const error = ref(null);

  /**
   * Submit form data to an API endpoint
   * @param {string} endpoint - API endpoint URL
   * @param {Object} data - Form data to submit
   * @param {string} method - HTTP method (POST, PUT, PATCH)
   * @param {Function} onSuccess - Callback on successful submission
   * @param {Function} onError - Callback on error
   * @returns {Promise<Object>} Response data
   */
  const submitForm = async (endpoint, data, method = 'POST', onSuccess = null, onError = null) => {
    isSubmitting.value = true;
    error.value = null;

    try {
      const response = await $fetch(endpoint, {
        method,
        body: data
      });

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
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
  const resetForm = () => {
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
