<script lang="ts" setup>
import { useRoute } from "vue-router";
import ApexMap from "../components/ApexMap.vue";
import { Maps, DefaultMap, testLocations, ApexMapName } from "../libs";

const route = useRoute();
</script>

<template>
  <ApexMap
    :map="Maps[route.params.map as ApexMapName] || DefaultMap"
    :locations="testLocations"
    :scale-speed="0.0015"
  />
</template>
