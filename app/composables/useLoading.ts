import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useLoading = defineStore("loading", () => {
  const isLoading = ref<boolean>(true);
  const minimumDuration: number = 2000;
  let startTime: number = Date.now();

  const startLoading = (): void => {
    isLoading.value = true;
    startTime = Date.now();
  };

  const stopLoading = async (): Promise<void> => {
    const elapsed: number = Date.now() - startTime;
    const remaining: number = Math.max(0, minimumDuration - elapsed);
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    isLoading.value = false;
  };

  return { isLoading, startLoading, stopLoading };
});
