import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  function setUser(v) {
    user.value = v;
  }

  return { user, setUser };
});
