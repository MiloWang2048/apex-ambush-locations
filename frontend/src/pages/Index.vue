<script lang="ts" setup>
import { useRoute } from "vue-router";
import ApexMap from "../components/ApexMap.vue";
import { Maps, DefaultMap } from "../libs/constants";
import { ApexMapName } from "../libs/types";
import { useCommonStore } from "../stores/common-store";
import { useLocationStore } from "../stores/location-store";

const route = useRoute();
const locationStore = useLocationStore();
</script>

<template>
  <ApexMap
    :map="Maps[route.params.map as ApexMapName] || DefaultMap"
    :locations="locationStore.locations"
    :scale-speed="0.0015"
  />
</template>
