import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import cloudbase from "@cloudbase/js-sdk";

export const useCommonStore = defineStore("common", () => {
  const draggingMap = ref(false);

  const showLoginPanel = ref(false);

  const globalMessage = ref<string>();
  const timerHandle = ref<number>();
  function alert(msg: string, time = 3000) {
    if (typeof timerHandle.value !== "undefined")
      clearTimeout(timerHandle.value);
    globalMessage.value = msg;
    timerHandle.value = setTimeout(() => {
      globalMessage.value = undefined;
    }, time);
  }

  const user = shallowRef<cloudbase.auth.IUser>();

  return {
    draggingMap,

    showLoginPanel,

    globalMessage,
    alert,

    user,
  };
});
