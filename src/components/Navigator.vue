<template>
  <div class="fixed h-10 z-1 top-0 left-0 right-0 backdrop-blur-md flex">
    <img
      class="block h-full w-10"
      src="/apex-icon.png"
      alt="icon"
      draggable="false"
    />
    <div
      v-for="map of Maps"
      class="flex flex-col justify-center h-full"
      :class="{
        'bg-apex-red': hoverMap
          ? hoverMap === map.name
          : currentMap?.name === map.name,
      }"
      @mouseenter="hoverMap = map.name"
      @mouseleave="hoverMap = undefined"
    >
      <router-link class="px-5 text-white" :to="`/${map.name}`">
        {{ map.displayName }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DefaultMap, Maps } from "../libs/constants";
import { ApexMap, ApexMapName } from "../types";

const route = useRoute();
const currentMap = ref<ApexMap>();
watch(
  () => route.params.map,
  (mapName) => {
    currentMap.value = Maps[mapName as ApexMapName] || DefaultMap;
  }
);
const hoverMap = ref<ApexMapName>();
</script>

<style></style>
