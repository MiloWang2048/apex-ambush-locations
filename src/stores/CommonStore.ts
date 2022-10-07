import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("main", () => {
  const draggingMap = ref(false);
  function setDraggingMap(value: boolean) {
    draggingMap.value = value;
  }
  return { draggingMap, setDraggingMap };
});
