<script lang="ts" setup>
import { useRoute } from "vue-router";
import ApexMap from "../components/ApexMap.vue";
import { Maps, DefaultMap, ApexMapName } from "../libs";
import { useCommonStore } from "../stores/common-store";

const route = useRoute();
const commonStore = useCommonStore();
</script>

<template>
  <ApexMap
    :map="Maps[route.params.map as ApexMapName] || DefaultMap"
    :locations="commonStore.locations"
    :scale-speed="0.0015"
  />
</template>
