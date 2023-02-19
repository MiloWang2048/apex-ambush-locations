import { defineStore } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { ApexMapName } from "../libs/types";
import { useRoute, useRouter } from "vue-router";
import _ from "lodash";
import backend from "backend";
import type { Location } from "backend/dist/client/entities/location";
import type { User } from "backend/dist/client/entities/user";
import { DefaultLocation, DefaultMap, StorageKeys } from "../libs/constants";
import { useLocalStorage } from "@vueuse/core";

export const useCommonStore = defineStore("common", () => {
  const router = useRouter();

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

  const rawLocations = ref<Location[]>([]);

  const user = ref<User>();
  const jwt = useLocalStorage<string | undefined>(StorageKeys.jwt, undefined);

  watchEffect(async () => {
    if (jwt.value) {
      user.value = await backend.user.getSelf(jwt.value);
    } else {
      user.value = undefined;
    }
  });

  const fetchLocations = async (mapName: string) => {
    rawLocations.value = await backend.locations.get(mapName);
  };

  watch(mapName, fetchLocations, { immediate: true });

  const locations = computed(() => {
    const locations = rawLocations.value;
    if (parseInt(String(route.params.locationId)) === DefaultLocation.id) {
      locations?.push({
        ...DefaultLocation,
        map: mapName.value as ApexMapName,
        userId: user.value?.id!,
        x: parseFloat(String(route.query.x ?? "0")),
        y: parseFloat(String(route.query.y ?? "0")),
      });
    } else {
      _.remove(locations, (item) => item.id === DefaultLocation.id);
    }
    return locations;
  });

  async function updateLocation(location: Location) {
    if (!jwt.value) return;
    backend.locations.update(jwt.value, location);
    await fetchLocations(mapName.value);
  }

  async function addLocation(location: Location) {
    if (!jwt.value) return;
    await backend.locations.add(jwt.value, location);
    await fetchLocations(mapName.value);
  }

  return {
    draggingMap,

    showLoginPanel,
    showUserProfile,

    globalMessage,
    alert,

    user,
    jwt,

    pingNewLocation,
    locations,
    mapName,
    updateLocation,
    addLocation,
  };
});
