import { defineStore } from "pinia";
import { computed, ref, shallowRef, watch, watchEffect } from "vue";
import cloudbase from "@cloudbase/js-sdk";
import {
  AmbushLocation,
  ApexMapName,
  DefaultMap,
  locationDescriptionPlaceholder,
} from "../libs";
import { useRoute, useRouter } from "vue-router";
import _ from "lodash";

export const useCommonStore = defineStore("common", () => {
  const router = useRouter();

  const {
    TCB_ENV_ID = import.meta.env.VITE_TCB_ENV_ID,
    TCB_REGION = import.meta.env.VITE_TCB_REGION,
  } = window._tcbEnv || {};

  if (!TCB_ENV_ID || !TCB_REGION) {
    router.push(encodeURI("/error?msg=500: TCB init failed."));
  }

  const tcb = cloudbase.init({
    env: TCB_ENV_ID ?? "",
    region: TCB_REGION ?? "",
  });

  const auth = tcb.auth({ persistence: "local" });
  const db = tcb.database();
  const cmd = db.command;

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

  const user = shallowRef<cloudbase.auth.IUser | undefined>(
    auth.hasLoginState()?.user
  );

  const pingNewLocation = ref(false);

  const route = useRoute();

  const mapName = computed(
    () => (route.params.map || DefaultMap.name) as string
  );

  const rawLocations = ref<AmbushLocation[]>();

  async function fetchLocations(map: string) {
    const { data } = await db
      .collection("locations")
      .where({ map })
      .limit(1000)
      .get();
    rawLocations.value = data as AmbushLocation[];
  }

  watch(mapName, fetchLocations, { immediate: true });

  const locations = computed(() => {
    const locations = rawLocations.value ?? [];
    if (route.params.locationId === "new") {
      locations?.push({
        name: "点位名称",
        map: mapName.value as ApexMapName,
        _id: "new",
        _openid: user.value?.uid ?? "",
        x: parseFloat(String(route.query.x ?? "0")),
        y: parseFloat(String(route.query.y ?? "0")),
        description: locationDescriptionPlaceholder,
      });
    } else {
      _.remove(locations, (item) => item._id === "new");
    }
    return locations;
  });

  async function updateLocation(location: AmbushLocation) {
    const res = await db
      .collection("locations")
      .doc(location._id)
      .update(_.omit(location, "_id", "_openid"));
    console.log(res);
    await fetchLocations(mapName.value);
  }

  async function addLocation(location: AmbushLocation) {
    const res = await db
      .collection("locations")
      .add(_.omit(location, "_id", "_openid"));
    console.log(res);
    await fetchLocations(mapName.value);
  }

  return {
    draggingMap,

    showLoginPanel,
    showUserProfile,

    globalMessage,
    alert,

    user,

    pingNewLocation,
    locations,
    mapName,
    updateLocation,
    addLocation,
  };
});
