import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { DefaultLocation } from "../libs/constants";
import backend from "backend";
import type { Location } from "backend/dist/client/entities/location";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
import { ApexMapName } from "../libs/types";
import { useUserStore } from "./user-store";
import { useCommonStore } from "./common-store";

export const useLocationStore = defineStore("location", () => {
  const router = useRouter();
  const route = useRoute();
  const rawLocations = ref<Location[]>([]);
  const { user, jwt } = useUserStore();
  const { mapName } = useCommonStore();

  const fetchLocations = async () => {
    rawLocations.value = await backend.locations.get(mapName);
  };
  watchEffect(fetchLocations);

  const locations = computed(() => {
    const locations = rawLocations.value;
    if (parseInt(String(route.params.locationId)) === DefaultLocation.id) {
      locations?.push({
        ...DefaultLocation,
        map: mapName as ApexMapName,
        userId: user?.id!,
        x: parseFloat(String(route.query.x ?? "0")),
        y: parseFloat(String(route.query.y ?? "0")),
      });
    } else {
      _.remove(locations, (item) => item.id === DefaultLocation.id);
    }
    return locations;
  });

  async function updateLocation(location: Location) {
    if (!jwt) return;
    backend.locations.update(jwt, location);
    await fetchLocations();
  }

  async function addLocation(location: Location) {
    if (!jwt) return;
    const id = await backend.locations.add(jwt, location);
    await fetchLocations();
    if (id) {
      await router.push(`/${mapName}/location/${id}`);
    } else {
      await router.push(`/${mapName}`);
    }
  }
  async function removeLocation(locationId: number) {
    if (!jwt) return;
    await backend.locations.delete(jwt, locationId);
    await fetchLocations();
  }
  return {
    locations,
    updateLocation,
    addLocation,
    removeLocation,
  };
});
