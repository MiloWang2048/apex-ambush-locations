import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
  const draggingMap = ref(false);
  function setDraggingMap(value: boolean) {
    draggingMap.value = value;
  }

  const showLoginPanel = ref(false);
  function setLoginPanelVisibility(value: boolean) {
    showLoginPanel.value = value;
  }

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
  return {
    draggingMap,
    setDraggingMap,
    showLoginPanel,
    setLoginPanelVisibility,
    globalMessage,
    alert,
  };
});
