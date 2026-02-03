import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserStore {
  user: Ref<User | null>;
  setUser: (v: User | null) => void;
}

export const useUserStore = defineStore("user", (): UserStore => {
  const user = ref<User | null>(null);

  function setUser(v: User | null): void {
    user.value = v;
  }

  return { user, setUser };
});
