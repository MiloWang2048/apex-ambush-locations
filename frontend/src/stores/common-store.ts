import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import _ from "lodash";
import { DefaultMap } from "../libs/constants";

export const useCommonStore = defineStore("common", () => {
  const draggingMap = ref(false);

  const showLoginPanel = ref(false);
  const showUserProfile = ref(false);

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

  const pingNewLocation = ref(false);

  const route = useRoute();

  const mapName = computed(
    () => (route.params.map || DefaultMap.name) as string
  );

  return {
    showLoginPanel,
    showUserProfile,

    globalMessage,
    alert,

    draggingMap,
    mapName,
    pingNewLocation,
  };
});
