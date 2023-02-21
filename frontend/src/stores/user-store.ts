import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { StorageKeys } from "../libs/constants";
import type { User } from "backend/dist/client/entities/user";
import backend from "backend";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>();
  const jwt = useLocalStorage<string | undefined>(StorageKeys.jwt, undefined);

  watchEffect(async () => {
    if (jwt.value) {
      user.value = await backend.user.getSelf(jwt.value);
    } else {
      user.value = undefined;
    }
  });
  return {
    user,
    jwt,
  };
});
