<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DefaultMap, Maps } from "../libs/constants";
import { useCommonStore } from "../stores/CommonStore";
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
const commonStore = useCommonStore();

function handleClickUserButton() {
  if (!commonStore.user) {
    commonStore.showLoginPanel = true;
  } else {
    commonStore.showUserProfile = true;
  }
}
</script>

<template>
  <div
    class="z-1 fixed top-0 left-0 right-0 flex h-10 bg-zinc-600 bg-opacity-50 backdrop-blur-md"
  >
    <img
      class="block h-full w-10"
      src="/apex-icon.png"
      alt="icon"
      draggable="false"
    />
    <div
      v-for="map of Maps"
      class="flex h-full flex-col justify-center"
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
    <div class="grow"></div>
    <div class="flex h-full flex-col justify-center px-4">
      <button
        class="rounded-full bg-blue-500 px-4 hover:bg-blue-400"
        @click="handleClickUserButton"
      >
        {{
          commonStore.user
            ? commonStore.user.email || commonStore.user.username
            : "登录"
        }}
      </button>
    </div>
  </div>
</template>

<style></style>
