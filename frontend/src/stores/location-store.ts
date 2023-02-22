import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { DefaultLocation } from "../libs/constants";
import backend from "backend";
import { Location } from "backend/dist/client/entities/location";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
import { ApexMapName } from "../libs/types";
import { useUserStore } from "./user-store";
import { useCommonStore } from "./common-store";

export const useLocationStore = defineStore("location", () => {
  const router = useRouter();
  const route = useRoute();
  const rawLocations = ref<Location[]>([]);
  const userStore = useUserStore();
  const commonStore = useCommonStore();

  const fetchLocations = async () => {
    rawLocations.value = await backend.locations.get(commonStore.mapName);
  };
  watchEffect(fetchLocations);

  const locations = computed(() => {
    const locations = rawLocations.value;
    if (parseInt(String(route.params.locationId)) === DefaultLocation.id) {
      locations?.push({
        ...DefaultLocation,
        map: commonStore.mapName as ApexMapName,
        userId: userStore.user?.id!,
        x: parseFloat(String(route.query.x ?? "0")),
        y: parseFloat(String(route.query.y ?? "0")),
      });
    } else {
      _.remove(locations, (item) => item.id === DefaultLocation.id);
    }
    return locations;
  });

  async function updateLocation(location: Location) {
    if (!userStore.jwt) return;
    backend.locations.update(userStore.jwt, location);
    await fetchLocations();
  }

  async function addLocation(location: Location) {
    if (!userStore.jwt) return;
    const id = await backend.locations.add(userStore.jwt, location);
    await fetchLocations();
    if (id) {
      await router.push(`/${commonStore.mapName}/location/${id}`);
    } else {
      await router.push(`/${commonStore.mapName}`);
    }
  }

  async function removeLocation(locationId: number) {
    if (!userStore.jwt) return;
    await backend.locations.delete(userStore.jwt, locationId);
    await fetchLocations();
  }

  const myLocations = ref<Location[]>();
  async function fetchMyLocations() {
    if (!userStore.jwt) return;
    myLocations.value = await backend.locations.getMine(userStore.jwt);
  }

  return {
    locations,
    updateLocation,
    addLocation,
    removeLocation,
    myLocations,
    fetchMyLocations,
  };
});
